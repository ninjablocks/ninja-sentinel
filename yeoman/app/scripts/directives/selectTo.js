'use strict';

yeomanApp.directive('selectTo', function() {
  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {
      
      var tapping = false;
      var targetFn = attrs['selectTo'];

      var selectFn = function() {
              scope[targetFn](scope.entry.DA);
            };



      if (Modernizr.touch) {

        element.bind('touchstart', function(event) {
          tapping = true;
        });

        element.bind('touchmove', function(event) {
          tapping = false;
        });

        element.bind('touchend', function(event) {
          if (tapping) {
            scope.$apply(selectFn);
          }
        });


      } else {
        element.bind('click', function(event) {
          scope.$apply(selectFn);
        });
      }

    }
  };
});
