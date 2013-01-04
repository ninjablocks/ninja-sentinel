'use strict';

yeomanApp.directive('stopPropagation', function() {
  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {
      element.click(function(event) {
        event.stopPropagation();
        return false;
      });
    }
  };
});
