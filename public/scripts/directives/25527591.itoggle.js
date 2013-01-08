'use strict';

yeomanApp.directive('itoggle', function() {
  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {
      
      element.iToggle({
        easing: "swing"
      });


      var setOn = function() {

      };

    }
  };
});
