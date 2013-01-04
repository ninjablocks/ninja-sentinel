'use strict';

yeomanApp.directive('nbClick', function() {
  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {

      var tapping = false;

      element.bind('touchstart', function() {
        tapping = true;
      });

      element.bind('touchmove', function() {
        tapping = false;
      });

      element.bind('touchend', function() {
        scope.$apply(attrs['nbClick']);
      });

    }
  };
});
