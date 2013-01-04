'use strict';

yeomanApp.filter('momentTime', function() {
  return function(timeValue) {
    return moment(timeValue);
  };
});

yeomanApp.filter('fromNow', function() {
    return function(timeValue) {
        return moment(timeValue).fromNow();
    };
});
