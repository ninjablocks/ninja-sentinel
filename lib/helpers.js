var moment = require('moment');

exports.withinActiveTime = function(user, times) {
    return false;
}

exports.intruderAlert = function(user, times) {
    console.log('Intruder Alert')
}
