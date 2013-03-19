'use strict';

yeomanApp.controller('EditZoneWebcamsCtrl',
  ['$scope', '$rootScope', 'EditZoneService', 'WebcamService', 'UIEvents', 'DeviceService'
  , function($scope, $rootScope, EditZoneService, WebcamService, UIEvents, DeviceService) {


    $scope.Zone = EditZoneService.Zone;
    $scope.Webcams = WebcamService.Webcams;


    /**
     * Toggles a webcam into/from the zone configuration
     * @param {Device} webcam Webcam device
     */
    $scope.ToggleWebcam = function(webcam) {

      var webcamGuid = webcam.GUID();

      if ($scope.Zone.HasWebcam(webcam)) {
        $scope.Zone.RemoveWebcam(webcam)
      } else {
        $scope.Zone.Options.webcams.push(webcamGuid);
      }
    };

    /**
     * Plays the webcam video image
     * @param {Device} webcam Webcam device
     */
    $scope.PlayWebcam = function(webcam) {

    };

    /**
     * Watch for changes to webcams
     */
    $rootScope.$on(UIEvents.DevicesLoaded, function(event) {
      $scope.$apply(function() {
        $scope.Webcams = DeviceService.GetDeviceByType('webcam');
      });
    });

}]);
