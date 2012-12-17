var uuid = require('node-uuid')
  , helpers = require('../lib/helpers');

exports.fetchAllAlerts = function(req,res) {

  // We pull out all the alerts
  var aKey = 'user:'+req.session.ninja.id+':alerts';
  req.redisClient.hgetall(aKey,function(err,data) {

    if (err) {
      res.json({error:"There was an unkown database error"},500);
      return;
    }

    for (var i in data) {
      if (data.hasOwnProperty(i)) {
        try {
          data[i] = JSON.parse(data[i]);
        } catch (err) {
          res.json({error:"There was an unrecoverable database error, alert "+i+" has been deleted"},500);
          req.redisClient.hdel(aKey,i);
          return;
        }
      }
    }

    res.json(data||{} ,200);
  });
};

exports.createAlert = function(req,res) {

  var requiredParams = ['type','alertee']
    , optionalParams = ['active'];

  // Check they have only given us what we've asked for
  for (var i in req.body) {
    if (req.body.hasOwnProperty(i)) {
      if (requiredParams.indexOf(i) === -1 && optionalParams.indexOf(i) === -1) {
        res.json({error:"Parameter `"+i+"` is not recognised"},400);
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

  // Returns string if invalid
  var isAlerteeValid = helpers.validateAlert(req.body.type,req.body.alertee);
  if (typeof isAlerteeValid === "string") {
      res.json({error:"Value of parameter `alertee` and/or `type` is invalid, "+isAlerteeValid},400);
      return;
  }

  var aKey = 'user:'+req.session.ninja.id+':alerts';
  var aId = uuid.v4();
  var aData = JSON.stringify(req.body);
  aData.active = req.body.active || false;

  req.redisClient.hmset(aKey,aId,aData,function(err) {

    if (err) res.json({error:"There was an unkown database error"},500);
    else res.json({id:aId},200);
  });
};
exports.fetchAlert = function(req,res) {

  // We pull out all the alerts
  var aKey = 'user:'+req.session.ninja.id+':alerts';
  var aId = req.params.alertId;

  req.redisClient.hget(aKey,aId,function(err,data) {

    if (err) {
      res.json({error:"There was an unkown database error"},500);
      return;
    }

    if (!data) {
      res.json({error:"Unkown Alert"},404);
      return;
    }

    try {
      var data = JSON.parse(data);
    } catch (err) {
      res.json({error:"There was an unrecoverable database error, this alert has been deleted"},500);
      req.redisClient.hdel(aKey,aId);
      return;
    }

    res.json(data,200);
  });
};

exports.updateAlert = function(req,res) {

  var allowedParams = ['type','alertee','active'];

  // Check they have only given us what we've asked for
  for (var i in req.body) {
    if (req.body.hasOwnProperty(i)) {
      if (allowedParams.indexOf(i)===-1) {
        res.json({error:"Parameter `"+i+"` is not recognised"},400);
        return;
      }
    }
  }

  var aKey = 'user:'+req.session.ninja.id+':alerts';
  var aId = req.params.alertId;

  req.redisClient.hget(aKey,aId,function(err,data) {

    if (err) {
      res.json({error:"There was an unkown database error"},500);
      return;
    }

    if (!data) {
      res.json({error:"Unkown Alert"},404);
      return;
    }

    try {
      var alertData = JSON.parse(data);
    } catch (err) {
      res.json({error:"There was an unrecoverable database error, this alert has been deleted"},500);
      req.redisClient.hdel(aKey,aId);
      return;
    }

    for (var x in req.body)
      alertData[x] = req.body[x];

    // Validate the alertee
    var isAlerteeValid = helpers.validateAlert(alertData.type, alertData.alertee);
    if (typeof isAlerteeValid === "string") {
      res.json({error:"Value of parameter `alertee` and/or `type` is invalid, "+isAlerteeValid},400);
      return;
    }

    var toWrite = JSON.stringify(alertData);

    req.redisClient.hset(aKey,aId,toWrite,function(err) {

      if (err) res.json({error:"There was an unkown database error"},500);
      else res.send(200);
    });
  });

};

exports.deleteAlert = function(req,res) {

  // We pull out all the alerts
  var aKey = 'user:'+req.session.ninja.id+':alerts';
  var aId = req.params.alertId;

  req.redisClient.hdel(aKey,aId,function(err,data) {

    if (err) {
      res.json({error:"There was an unkown database error"},500);
      return;
    }

    res.send(200);
  });
};