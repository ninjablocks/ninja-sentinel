'use strict';

yeomanApp.filter('rfHex'
  , [ '$filter'
  , function($filter) {
  return function(input) {

    if (input) {
      var number = parseInt(input, 2);
      return number.toString(16);
    } else {
      return '';
    }

  };
}]);
