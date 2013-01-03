var moment = require('moment')
  , util = require('util')

exports.withinActiveTime = function(payload,zoneData) {

  if (!zoneData.activeTimes)
    return false;

  var startOfWeek = moment().day(0).hours(0).minutes(0).seconds(0).milliseconds(0).valueOf();
  var now = moment(payload.timestamp).valueOf()-startOfWeek;
  var times = zoneData.activeTimes;

  for (var i=0;i<times.length;i++) {

    var from = times[i];
    var to = times[++i];

    if (now > from && now < to) return true;
  }

  return false;
}
exports.validateAlert = function(type,alertee) {

  switch (type) {

    case 'email':
      if (alertee.indexOf('@')===-1) return 'invalid email address';
    break;

    case 'call':
    case 'sms':
      var numberTest = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/
      if (!numberTest.test(alertee)) return 'invalid phone number, must be of the form +xxxxxxxxxxxx';
    break;

    default: return 'unkown `type`'; break;
  }
  return true;
};

exports.validateActiveTimes = function(times) {

  if (!util.isArray(times) || times.length % 2 !== 0) {
    return 'it must be an array of integer timestamp couplets, ie [from,to,from,to]';
  }
  for (var i=0;i<times.length;i++) {
    if (typeof times[i] !== "number") return 'each element of the array must be a number';
  }
  return true;
}

exports.intruderAlert = function(req,zoneData,alertData) {

  for (var a in alertData) {
    if (alertData.hasOwnProperty(a) && alertData[a].active===true) {
      switch(alertData[a].type) {

        case 'email':
          sendAlertEmail(req,alertData[a].alertee,zoneData);
        break;

        case 'call' :
          makeAlertCall(req,alertData[a].alertee,zoneData);
        break;

        case 'sms':
          sendAlertSms(req,alertData[a].alertee,zoneData);
        break;

      }
    }
  }
};

function sendAlertSms(req,to,zone) {

  req.phone.sendSms(to,'This is Ninja Sentinel. You have an alert in zone... '+zone.name,{},function(sms) {

    exports.logActivity(req.redisClient,req.body.id,'alert','SMS to '+to+' was sent');
  });

}

function makeAlertCall(req,to,zone) {

  req.phone.makeCall(to, null, function(call) {

    var Twiml = require('twilio').Twiml;

    call.on('answered', function(reqParams, res) {

        exports.logActivity(req.redisClient,req.body.id,'alert','Call to '+to+' was answered');
        res.append(new Twiml.Say('This is Ninja Sentinel. You have an alert in zone... '+zone.name));
        res.send();
    });

    call.on('ended', function(reqParams) {
      console.logconsole.log("User "+req.body.id+' Zone '+zone.id+' call ended');
    });
  });

}

function sendAlertEmail(req,to,zone) {

  var ago = moment(req.body.timestamp).fromNow()
  var at = moment(req.body.tinmestamp).toDate()

  var body = [
    'Zone ',
    zone.name,
    ' was alerted ',
    ago,
    ' at ',
    at
  ].join('');

  req.mailer.sendMail({
      to : to,
      from : process.env.EMAIL_FROM,
      subject : "[SENTINEL] Alert in "+zone.name,
      text: body
    },
    function(err, result) {
      if (err) console.log(err);
      else exports.logActivity(req.redisClient,req.body.id,'alert','Email to '+to+' was sent');
  });

}

exports.logActivity = function(redisClient,id,type,message) {
  var msg = {
    type:type,
    message:message,
    timestamp:new Date().getTime()
  };
  var key = 'user:'+id+':history';

  redisClient.lpush(key,JSON.stringify(msg),function(err) {
    if (err) console.log(err);
  });
  redisClient.ltrim(key,'0','1000')
};