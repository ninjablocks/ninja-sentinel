'use strict';

yeomanApp.directive('nbClick', function() {
  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {

      var tapping = false;
      var flag = false;

      element.bind('touchstart click', function() {
        if (!flag) {
          flag = true;
          setTimeout(function() { flag=false; scope.$apply(attrs['nbClick']); }, 100);
        }
        
        tapping = true;
      });

      // element.bind('touchmove', function() {
      //   tapping = false;
      // });

      // element.bind('touchend', function() {
      //   scope.$apply(attrs['nbClick']);
      // });

    }
  };
});
