'use strict';

yeomanApp.directive('nbClick', function() {
  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {
      element.bind('touchstart', function() {
        scope.$apply(attrs['nbClick']);
      });
    }
  };
});
