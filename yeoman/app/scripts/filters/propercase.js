'use strict';

yeomanApp.filter('propercase'
  , function() {

    return function(input) {

      var inputSplit = input.split(' ');
      var proper = new Array();

      for (var x in inputSplit) {
        var word = inputSplit[x].charAt(0).toUpperCase() + inputSplit[x].substr(1).toLowerCase();
        proper.push(word);
      }
      var propercase = proper.join(' ').trim();

      return propercase;
    };

});