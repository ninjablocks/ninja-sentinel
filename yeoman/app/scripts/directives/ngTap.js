'use strict';

yeomanApp.directive('ngTap', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        
        var tapping = false;

        if (Modernizr.touch) {

          element.bind('touchstart', function(event) {
            tapping = true;
          });

          element.bind('touchmove', function(event) {
            tapping = false;
          });

          element.bind('touchend', function(event) {
            if (tapping) {
              scope.$apply(attrs['ngTap']);
            }
          });


        } else {
          element.bind('click', function(event) {
            scope.$apply(attrs['ngTap']);
          })
        }



      }
    };
  });
