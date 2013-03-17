'use strict';

yeomanApp.directive('toggle', function() {
  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {
      element.css({ cursor: 'pointer' });
      var tapping = false;

      var targetElement = attrs['toggle'];

      if (Modernizr.touch) {

        element.bind('touchstart', function(event) {
          tapping = true;
        });

        element.bind('touchmove', function(event) {
          tapping = false;
        });

        element.bind('touchend', function(event) {
          if (tapping) {
            scope.$apply(toggleElement);
          }
        });


      } else {
        element.bind('click', function(event) {
          scope.$apply(toggleElement);
        });
      }


      function toggleElement() {
        jQuery(targetElement).toggle();
      }



    }
  };
});
