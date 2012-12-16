var ninjaBlocks = require('ninja-blocks')
  , request = require('request')
  , util = require('util')
  , async = require('async')
  , helpers = require('../lib/helpers.js')
  , TempoDBClient = require('tempodb').TempoDBClient
  , tempodb = new TempoDBClient(process.env.TEMPODB_API_KEY, process.env.TEMPODB_API_SECRET);

var DEFAULTNONREPUDIATION = 5;

exports.handleNinjaAuthentication = function(req,res,ninja) {

  // Setup our session data
  // We don't need to store this data long term.
  // If the session expires, the user will reauthenticate
  // And the session data will be repopulated.
  req.session.ninja = ninja.data;
  req.session.token = ninja.token;

  var app = ninjaBlocks.app({access_token:ninja.token});

  app.devices('rf433',function(err,devices) {

    if (err) {
      res.json({error:err.message},500);
      return;
    }

    Object.keys(devices).forEach(function(guid) {
        app.device(guid).subscribe('http://'+req.HOSTNAME+'/callback',true,function(err) {
      })
    });
    res.redirect('/');

  });

};

/**
 * Called when a device datapoint is
 * received from the Ninja Cloud
 *
 * @param {Object} req Request Object
 * @param {Object} req.body The body of the request
 * @param {String} req.body.id The user ID the device belongs to
 * @param {String} req.body.DA The data value
 * @param {Object} res Response Object
 */

exports.handleDeviceCallback = function(req,res) {

  if (!req.body.DA || !req.body.id) {
    res.send(400);
    return;
  }

  var userKey = 'user:'+req.body.id
    , triggerKey = 'user:'+req.body.id+':triggers'
    , zoneKey = 'user:'+req.body.id+':zones'
    , globalOverrideKey = 'user:'+req.body.id+':overrideActive'
    , userData
    , zoneId
    , zoneData;

  async.waterfall([

    function fetchZoneId(cb) {

      req.redisClient.hget(triggerKey,req.body.DA,cb);
    },

    function nonRepudiate(zId,cb) {

      var alertKey = 'user:'+req.body.id+':zone:'+zId+':alerted';

      req.redisClient.exists(alertKey,function(err,exists) {
        if (err) throw err;

        // Do our best to only send 1 alert per X seconds
        if (!exists) {
          cb(null,zId);
          req.redisClient.setex(alertKey,DEFAULTNONREPUDIATION,'1');
        } else {
          cb(true);
          console.log("Surpressing alert for "+req.body.id+" in zone "+zId);
        }
      });
    },

    function fetchZoneData(zId,cb) {

      if (!zId) {
        cb(true)
        return;
      }

      zoneId = zId;
      req.redisClient.hget(zoneKey,zoneId,cb);
    },

    function parseZoneData(zData,cb) {

      if (!zData) {
        cb(true)
        return;
      }
      try {
        var zoneDataObj = JSON.parse(zData);
      }
      catch (err) {
        // There is invalid JSON in this key, nuke it.
        req.redisClient.hdel(zoneKey,zoneId);
        cb(true)
      }

      cb(null,zoneDataObj);
    },

    function sendHistoricalCount(zoneData,cb) {

      var tempoKey = 'user:'+req.body.id+':'+zoneId+':'+req.body.DA;

      var data = [
        { t: new Date(req.body.timestamp), v: 1 },
      ];
      tempodb.write_key(tempoKey, data, function(result) {
        if (result.response!==200) console.log(result.body);
      });

      cb(null,zoneData)
    },

    function fetchAlertData(zDataObj,cb) {

      zoneData = zDataObj;

      async.parallel({

        globalOverride: function(miniCb) {

          req.redisClient.exists(globalOverrideKey,function(err,exists) {

            if (err) miniCb(err)
            else if (exists) miniCb(null,true);
            else miniCb(null,false);
          });

        },
        zoneOverride: function(miniCb) {

          miniCb(null,(zoneData.overrideActive=='true'));
        },

        zoneActive: function(miniCb) {

          miniCb(null,helpers.withinActiveTime(userData,zoneData.activeTimes));
        }
      },
      function(err,results) {

        console.log(results);

        if (err) cb(err);
        else if (results.globalOverride || results.zoneOverride || results.zoneActive) cb(null,true);
        else cb(true)
      });

    }

  ],function(err,results) {
    if (err) {
      return;
    }
    helpers.intruderAlert(userData,zoneData);

  });

  res.send(200)
};


exports.proxy = function(req,res) {

  // Extend the request's query string with the access token
  var query = req.query;
  query.access_token = req.session.token;
  // Make the request
  request({
      url:'https://api.ninja.is'+req.url,
      qs:query,
      json:true
  }).pipe(res);
};

exports.index = function(req, res){

  var ninja = ninjaBlocks.app({access_token:req.session.token});
  ninja.devices(function(err,devices) {

    res.render('index.jade',{
      title:'Ninja Sentinel',
      ninja:req.session.ninja,
      devices:devices
    });
  });
};

exports.setGlobalOverride = function(req,res) {

  var globalOverrideKey = 'user:'+req.session.ninja.id+':overrideActive';
  req.redisClient.set(globalOverrideKey,'1',function(err) {

    if (err) {
      res.json({error:'Unknown database error'},500);
      return;
    }
    res.send(200);
  });
};

exports.removeGlobalOverride = function(req,res) {

  var globalOverrideKey = 'user:'+req.session.ninja.id+':overrideActive';
  req.redisClient.del(globalOverrideKey,function(err) {

    if (err) {
      res.json({error:'Unknown database error'},500);
      return;
    }
    res.send(200);
  });
};


exports.testCall = function(req,res) {
  req.phone.setup(function() {

    console.log('Phone Setup, making call');
    // Alright, our phone number is set up. Let's, say, make a call:
    req.phone.makeCall(process.env.TEST_CALL_NUMBER, null, function(call) {

      var Twiml = require('twilio').Twiml;

      console.log("Waiting for answer");

      call.on('answered', function(reqParams, res) {

          console.log('Call answered');
          res.append(new Twiml.Say('Hello, there!'));
          res.send();
      });

      call.on('ended', function(reqParams) {
          console.log('Call ended');
      });
    });

  });

};