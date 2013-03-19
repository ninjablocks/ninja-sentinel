'use strict';

yeomanApp.directive('playWebcam', function() {
  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {
      
      var targetWebcam = jQuery(attrs["playWebcam"]);
      var webcamSrc = targetWebcam.attr("src");

      console.log("Play for", targetWebcam, webcamSrc);

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
                targetWebcam.imagesLoaded(function() {
                  targetWebcam.attr("src", webcamSrc);
                });
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

    }
  };
});
