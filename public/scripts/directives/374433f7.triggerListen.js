'use strict';

yeomanApp.directive('triggerListen'
  , ['$rootScope', 'UIEvents'
  , function($rootScope, UIEvents) {

    var highlightColor = "hsl(195,46%,70%)"; //blue
    highlightColor = "hsl(48,83%,76%)"; // yellow
    var highlightDuration = 6000;

  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {
      
      $rootScope.$on(UIEvents.PusherData, function(event, data) {
        
        if (scope.trigger.Options.data === data.DA) {
          // This trigger is being actuated
          // element.stop(true, true).effect("highlight", { color: highlightColor}, highlightDuration);
          element.stop(true, false);
          element.animate({backgroundColor: 'hsl(353,77%,57%)'}, 100).spectrum(["#e59191", "#edecb2", "#daeaba", "transparent"], [100, 60000, 60000, 60000]);
          
          var lastActuated = new moment(data.timestamp);
          // lastActuated = lastActuated.format("YYYY-MM-DD h:mm:ssa");

          element.find(".lastActuated").html(lastActuated.format("YYYY-MM-DD h:mm:ssa"));
        }
      });

    }
  };
}]);
