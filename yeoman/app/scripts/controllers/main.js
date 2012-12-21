'use strict';

yeomanApp.controller('MainCtrl'
  , ['$scope', '$rootScope', 'UIEvents', 'ZoneFactory', 'ZoneService'
  , function($scope, $rootScope, UIEvents, ZoneFactory, ZoneService) {

    $scope.ConfigureMode = false;


    /**
     * Handler for Add New Zone button
     */
    $scope.AddZone = function() {
      var zone1 = new ZoneFactory({
        name: 'Zone1'
      });
      zone1.Save();

      var zone2 = new ZoneFactory({
        name: 'Zone2'
      });
      zone2.Save();
      
    };


    /**
     * Watch for ConfigureMode switches
     */
    $scope.$on(UIEvents.SetConfigureMode, function(event, modeSwitch) {
      $scope.ConfigureMode = modeSwitch;
    });

}]);
