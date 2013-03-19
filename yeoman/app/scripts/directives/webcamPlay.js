'use strict';

yeomanApp.directive('webcamPlay', function() {
  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {
      
        var tapping = false;

        var playing = false;

        var webcamGuid = scope.Webcam.GUID();
        
        if (Modernizr.touch) {

          element.bind('touchstart', function(event) {
            tapping = true;
          });

          element.bind('touchmove', function(event) {
            tapping = false;
          });

          element.bind('touchend', function(event) {
            if (tapping) {
              if (playing) {
                playing = true;
              } else {
                playing = false;
              }
            }
          });


        } else {
          element.bind('click', function(event) {
            // scope.$apply(attrs['ngTap']);
          });
        }



        element.onLoad = function() {
        };




    }
  };
});
