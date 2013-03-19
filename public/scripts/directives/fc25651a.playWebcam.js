'use strict';

yeomanApp.directive('playWebcam',
[ '$timeout'
, function($timeout) {
  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {
        
        $timeout(function() {

          var targetWebcam = jQuery(attrs["playWebcam"]);
          var webcamSrc = attrs["playWebcamSrc"];

          if (DEBUG) console.log("Play for", targetWebcam, webcamSrc);

          targetWebcam.attr("src", scope[webcamSrc]());

          var updateWebcam = function() {
            targetWebcam.attr("src", scope[webcamSrc]());
            targetWebcam.imagesLoaded(updateWebcam);
          };

          var stopWebcam = function() {
            $.removeData(targetWebcam, 'imagesLoaded');
          };


          var playing = false;

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
                scope.$apply(function() {
                  playing = !playing;

                  if (playing) {
                    element.addClass("pause").removeClass("foundicon-youtube");
                    updateWebcam();
                  } else {
                    element.removeClass("pause").addClass("foundicon-youtube");
                    stopWebcam();
                  }
                });
              }
            });


          } else {
            element.bind('click', function(event) {
              scope.$apply(function() {
                playing = !playing;

                if (playing) {
                  targetWebcam.imagesLoaded(function() {
                    targetWebcam.attr("src", webcamSrc);
                  });
                }
              });
            });
          }

      });

    }
  };
}]);
