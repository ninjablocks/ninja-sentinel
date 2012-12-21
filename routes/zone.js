var uuid = require('node-uuid')
  , util = require('util')
  , helpers = require('../lib/helpers');

exports.fetchAllZones = function(req,res) {

  // We pull out all the zones
  var zKey = 'user:'+req.session.ninja.id+':zones';
  req.redisClient.hgetall(zKey,function(err,data) {

    if (err) {
      res.json({error:"There was an unkown database error"},500);
      return;
    }

    for (var i in data) {
      if (data.hasOwnProperty(i)) {
        try {
          data[i] = JSON.parse(data[i]);
        } catch (err) {
          res.json({error:"There was an unrecoverable database error, zone "+i+" has been deleted"},500);
          req.redisClient.hdel(zKey,i);
          return;
        }
      }
    }

    res.json(data||{} ,200);
  });
}

exports.createZone = function(req,res) {

  var requiredParams = ['name']
    , optionalParams = ['activeTimes','overrideActive']
    , forbiddenParams = ['triggers'];

  // Check they have only given us what we've asked for
  for (var i in req.body) {
    if (req.body.hasOwnProperty(i)) {
      if (requiredParams.indexOf(i) === -1 && optionalParams.indexOf(i) === -1) {
        res.json({error:"Parameter `"+i+"` is not recognised"},400);
        return;
      }
      if (forbiddenParams.indexOf(i)>-1) {
        res.json({error:"Parameter `"+i+"` is not allowed to be set via this endpoint"},403);
        return;
      }
    }
  }

  // Iterate over the required parameters to ensure they
  // have met the requirements
  for (var i=0;i<requiredParams.length;i++) {
    if (!req.body.hasOwnProperty(requiredParams[i])) {
      res.json({error:"Parameter `"+requiredParams[i]+"` is required"},400);
      return;
    }
  }

  var zKey = 'user:'+req.session.ninja.id+':zones';
  var zId = uuid.v4();
  req.body.triggers = {};

  var zData = JSON.stringify(req.body);

  req.redisClient.hmset(zKey,zId,zData,function(err) {

    if (err) res.json({error:"There was an unkown database error"},500);
    else {
      helpers.logActivity(req.redisClient,
        req.session.ninja.id,
        'info',
        'Zone '+zData.name+' was created'
      );
      res.json({id:zId},200);
    }
  });

};

exports.fetchZone = function(req,res) {

  // We pull out all the zones
  var zKey = 'user:'+req.session.ninja.id+':zones';
  var zId = req.params.zoneId;

  req.redisClient.hget(zKey,zId,function(err,data) {

    if (err) {
      res.json({error:"There was an unkown database error"},500);
      return;
    }

    if (!data) {
      res.json({error:"Unkown Zone"},404);
      return;
    }

    try {
      var data = JSON.parse(data);
    } catch (err) {
      res.json({error:"There was an unrecoverable database error, this zone has been deleted"},500);
      req.redisClient.hdel(zKey,zId);
      return;
    }

    res.json(data,200);
  });
}

exports.updateZone = function(req,res) {

  var allowedParams = ['name','activeTimes','overrideActive'];
  var forbiddenParams = ['triggers'];


  // Check they have only given us what we've asked for
  for (var i in req.body) {
    if (req.body.hasOwnProperty(i)) {
      if (allowedParams.indexOf(i)===-1) {
        res.json({error:"Parameter `"+i+"` is not recognised"},400);
        return;
      }
      if (forbiddenParams.indexOf(i)>-1) {
        res.json({error:"Parameter `"+i+"` is not allowed to be set via this endpoint"},403);
        return;
      }
    }
  }

  if (req.body.activeTimes) {
    var isValidActiveTimes = helpers.validateActiveTimes(req.body.activeTimes);
    if (typeof isValidActiveTimes === "string") {
      res.json({error:"Parameter `activeTimes` is not valid, "+isValidActiveTimes},400);
      return;
    }
  }


  var zKey = 'user:'+req.session.ninja.id+':zones';
  var zId = req.params.zoneId;

  req.redisClient.hget(zKey,zId,function(err,data) {

    if (err) {
      res.json({error:"There was an unkown database error"},500);
      return;
    }

    if (!data) {
      res.json({error:"Unkown Zone"},404);
      return;
    }

    try {
      var zoneData = JSON.parse(data);
    } catch (err) {
      res.json({error:"There was an unrecoverable database error, this zone has been deleted"},500);
      req.redisClient.hdel(zKey,zId);
      return;
    }

    for (var x in req.body)
      zoneData[x] = req.body[x];

    var toWrite = JSON.stringify(zoneData);

    req.redisClient.hset(zKey,zId,toWrite,function(err) {
      if (err) res.json({error:"There was an unkown database error"},500);
      else {
        helpers.logActivity(req.redisClient,
          req.session.ninja.id,
          'info',
          'Zone '+zoneData.name+' was updated'
        );
        res.send(200);
      }
    });
  });

};

exports.deleteZone = function(req,res) {

  // We pull out all the zones
  var zKey = 'user:'+req.session.ninja.id+':zones';
  var zId = req.params.zoneId;

  req.redisClient.hdel(zKey,zId,function(err,data) {

    if (err) {
      res.json({error:"There was an unkown database error"},500);
      return;
    }


    helpers.logActivity(req.redisClient,
      req.session.ninja.id,
      'info',
      'Zone '+zId+' was deleted'
    );

    res.send(200);
  });
};

exports.registerTrigger = function(req,res) {

  // This one got ugly quickly
  // TODO: beat it with a simple stick

  var requiredParams = ['data','type','name'];

  for (var i=0;i<requiredParams.length;i++) {
    if (!req.body.hasOwnProperty(requiredParams[i])) {
      res.json({error:"Parameter `"+requiredParams[i]+"` is required"},400);
      return;
    }
  }

  var zKey = 'user:'+req.session.ninja.id+':zones'
    , zId = req.params.zoneId
    , tKey = 'user:'+req.session.ninja.id+':triggers'
    , tData = req.body.data;

  if (typeof tData !== "string" || !tData) {
      res.json({error:"Parameter `data` must be a string"},400);
      return;
  }

  req.redisClient.hget(zKey,zId,function(err,data) {

    if (err) {
      res.json({error:"There was an unkown database error"},500);
      return;
    }

    if (!data) {
      res.json({error:"Unkown Zone"},404);
      return;
    }

    try {
      data = JSON.parse(data);
    } catch (err) {
      res.json({error:"There was an unrecoverable database error, zone "+i+" has been deleted"},500);
      req.redisClient.hdel(zKey,zId);
      return;
    }

    data.triggers[tData] = {
      type:req.body.type
    }

    var toSet = JSON.stringify(data);

    req.redisClient.hset(tKey,tData,zId,function(err) {

      if (err) {
        res.json({error:"There was an unkown database error"},500);
        return;
      }
      req.redisClient.hset(zKey,zId,toSet,function(err) {

        if (err) {
          res.json({error:"There was an unkown database error"},500);
          // Rollback the last change
          req.redisClient.hdel(tKey,tData)
          return;
        }
        res.send(200);
        helpers.logActivity(req.redisClient,
          req.session.ninja.id,
          'info',
          'Trigger created against zone '+data.name
        );
      });
    });
  });
};

exports.deleteTrigger = function(req,res) {

  var zKey = 'user:'+req.session.ninja.id+':zones'
    , zId = req.params.zoneId
    , tKey = 'user:'+req.session.ninja.id+':triggers'
    , tData = req.params.triggerData;

  if (typeof tData !== "string" || !tData) {
      res.json({error:"Parameter `data` must be a string"},400);
      return;
  }

  req.redisClient.hget(zKey,zId,function(err,data) {

    if (err) {
      res.json({error:"There was an unkown database error"},500);
      return;
    }

    if (!data) {
      res.json({error:"Unkown Zone"},404);
      return;
    }

    try {
      data = JSON.parse(data);
    } catch (err) {
      res.json({error:"There was an unrecoverable database error, zone "+i+" has been deleted"},500);
      req.redisClient.hdel(zKey,zId);
      return;
    }

    delete data.triggers[tData];

    var toSet = JSON.stringify(data);

    req.redisClient.hdel(tKey,tData,zId,function(err) {

      if (err) {
        res.json({error:"There was an unkown database error"},500);
        return;
      }
      req.redisClient.hset(zKey,zId,toSet,function(err) {

        if (err) {
          res.json({error:"There was an unkown database error"},500);
          // Try rollback the last change
          req.redisClient.hset(tKey,tData,zId);
          return;
        }

        helpers.logActivity(req.redisClient,
          req.session.ninja.id,
          'info',
          'A trigger in zone '+data.name+' was deleted'
        );

        res.send(200);
      });
    });
  });
};