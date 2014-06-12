var moment = require('moment');
var util = require('util');

exports.sendAlertEmail = function(req, to, zone) {

  var ago = moment(req.body.timestamp).fromNow();
  var at = moment(req.body.timestamp).toDate();

  var payload = {
    to: to,
    from: process.env.EMAIL_FROM,
    subject: "[SENTINEL] Alert in " + zone.name,
    text: [
      'Zone',
      zone.name,
      'was alerted',
      ago,
      'at',
      at
    ].join(' ')
  };

  req.sendGrid.send(payload, function(err, json) {
    if (err) {
      console.error(err);
    } else {
      exports.logActivity(req.redisClient, req.body.id, 'alert', 'Email to ' + to + ' was sent');
    }
  });

};

