'use strict';

yeomanApp.factory('WebcamService'
  , ['$rootScope', 'DeviceService', 'UIEvents'
  , function($rootScope, DeviceService, UIEvents) {


    var webcamService = {

      /**
       * Webcam devices
       * @type {array}
       */
      Webcams: DeviceService.GetDeviceByType('webcam')

    };


    $rootScope.$on(UIEvents.DevicesLoaded, function(event) {
      webcamService.Webcams = DeviceService.GetDeviceByType('webcam');
      console.log("Webcams updated", webcamService.Webcams);
    });


    return webcamService;

}]);
