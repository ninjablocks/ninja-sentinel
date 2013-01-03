'use strict';

yeomanApp.directive('foundationHeader'
  , ['UIEvents'
  , function(UIEvents) {

  var expandedClass = "expanded";

  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {
      
      scope.$on(UIEvents.TopBarOpen, function(event) {
        element.addClass(expandedClass);
      });

      scope.$on(UIEvents.TopBarClose, function(event) {
        element.removeClass(expandedClass);
        element.removeAttr("style");
        element.foundationTopBar("reset");
        // element.find(".moved").removeClass("moved");
        // element.find("section").removeAttr("style");
        // debugger;
      });
    }
  };
}]);
