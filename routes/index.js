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
        app.device(guid).subscribe('http://'+process.env.HOSTNAME+'/callback',true,function(err) {
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
    , globalOverrideKey = 'user:'+req.body.id+':override'
    , userData
    , zoneId
    , zoneData;

  async.waterfall([

    function fetchZoneId(cb) {

      req.redisClient.hget(triggerKey,req.body.DA,cb);
    },

    function nonRepudiate(zId,cb) {

      if (!zId) {
        cb(true);
        return;
      }

      var alertKey = 'user:'+req.body.id+':zone:'+zId+':alerted';

      req.redisClient.exists(alertKey,function(err,exists) {
        if (err) throw err;

        // Do our best to only send 1 alert per X seconds
        if (exists) {
          console.log("Surpressing alert for user "+req.body.id+" in zone "+zId);
          cb(true);
        } else {
          req.redisClient.setex(alertKey,DEFAULTNONREPUDIATION,'1');
          cb(null,zId);
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
        zoneDataObj.id = zoneId;
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

          req.redisClient.get(globalOverrideKey,function(err,data) {

            if (err) miniCb(err)
            else if (!data) miniCb(null,null)
            else miniCb(null,data);
          });

        },

        zoneOverride: function(miniCb) {

          miniCb(null,(zoneData.overrideActive=='true'));
        },

        zoneActive: function(miniCb) {

          miniCb(null,helpers.withinActiveTime(req.body,zoneData));
        },

      },
      function(err,results) {

        if (err) cb(err);
        else if (null !== results.globalOverride) {
            // if globalOverride is true, we must alert
            // if it is false, we must not alert
            if (results.globalOverride==='true') cb(null)
            else cb(true)
        }
        else if (results.zoneOverride || results.zoneActive) cb(null);
        else cb(true)
      });

    }

  ], function(err) {

    if (err) {
      res.send(200)
      return;
    }

    var aKey = 'user:'+req.body.id+':alerts';
    req.redisClient.hgetall(aKey,function(err,alertData) {

      for (var i in alertData) {
        if (alertData.hasOwnProperty(i)) {
          try {
            alertData[i] = JSON.parse(alertData[i]);
          } catch (err) {
            console.log({error:"There was an unrecoverable database error, alert "+i+" has been deleted"});
            req.redisClient.hdel(aKey,i);
          }
        }
      }

      // If we've gotten to this point, we need to alert
      helpers.intruderAlert(req,zoneData,alertData);

      helpers.logActivity(req.redisClient,
        req.body.id,
        'alert',
        'Alert in '+zoneData.name
      );
      res.send(200)
    });

  });

};


exports.proxy = function(req,res) {

  // Extend the request's query string with the access token
  var query = req.query;
  query.access_token = req.session.token;
  // Make the request
  request({
      url:'https://api.ninja.is'+req.url,
      method:req.method,
      qs:query,
      json:req.body
  }).pipe(res);
};

exports.index = function(req, res){

  res.sendfile('public/index.html');
  
};

exports.setGlobalOverride = function(req,res) {

  var globalOverrideKey = 'user:'+req.session.ninja.id+':override';

  if (!req.body.override) {
    res.json({error:'Parameter `override` is required'},400);
    return;
  }

  if (req.body.override != "false" && req.body.override != "true") {
    res.json({error:'Parameter `override` must be true or false'},400);
    return;
  }

  req.redisClient.set(globalOverrideKey,req.body.override.toString(),function(err) {

    if (err) {
      res.json({error:'Unknown database error'},500);
      return;
    }

    helpers.logActivity(req.redisClient,
      req.session.ninja.id,
      'info',
      'Global override was enabled and '+((req.body.override=="true")?'WILL':'WILL NOT')+' alert'
    );

    res.send(200);
  });
};

exports.removeGlobalOverride = function(req,res) {

  var globalOverrideKey = 'user:'+req.session.ninja.id+':override';
  req.redisClient.del(globalOverrideKey,function(err) {

    if (err) {
      res.json({error:'Unknown database error'},500);
      return;
    }
    res.send(200);
  });
};

exports.getGlobalOverride = function(req,res) {

  var globalOverrideKey = 'user:'+req.session.ninja.id+':override';
  req.redisClient.get(globalOverrideKey,function(err,data) {

    if (err) {
      res.json({error:'Unknown database error'},500);
      return;
    }


    res.json({override:(data==='true')},200);
  });
};

exports.fetchHistory = function(req,res) {

  var userHistoryKey = 'user:'+req.session.ninja.id+':history';
  req.redisClient.lrange(userHistoryKey,'0','-1',function(err,data) {

    if (err) {
      res.json({error:'Unknown database error'},500);
      return;
    }

    for (var i=0;i<data.length;i++) {
      try {
        data[i] = JSON.parse(data[i]);
      } catch (err) {
        delete data[i];
      }
    }
    res.json(data,200);
  });
};

exports.nukeUser = function(req,res) {
  var keys = [
    'user:'+req.session.ninja.id+':zones',
    'user:'+req.session.ninja.id+':alerts',
    'user:'+req.session.ninja.id+':override',
    'user:'+req.session.ninja.id+':triggers',
    'user:'+req.session.ninja.id+':history'
  ];

  var app = ninjaBlocks.app({access_token:req.session.token});
  app.devices('rf433',function(err,devices) {

    if (err) {
      res.json({error:err.message},500);
      return;
    }

    // First unsubscribe from all callbacks
    // Then nuke all reference to the user
    // Destroy the session and go back home

    async.series([
      function(callback) {

        async.forEach(Object.keys(devices), function(guid,cb) {

          app.device(guid).unsubscribe(function(err) {
            // We try and ensure we've unsubscribed from all devices, so we ignore a 404
            if (!err || err.statusCode===404) cb(null);
            else cb(err);
          });
        },callback);

      },
      function(callback) {

        async.forEach(keys,function(key,cb) {
          req.redisClient.del(key,cb);
        },callback);
      }
    ],function(err) {

        if (err) {
          res.json({error:err.message}, 500);
          return;
        }
        req.session.destroy();
        res.redirect('/?nuked=true');
    });

  });
};