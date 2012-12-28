'use strict';

yeomanApp.controller('MainCtrl'
  , ['$scope', '$rootScope', 'UIEvents', 'ZoneFactory', 'ZoneService', 'EditZoneService'
  , function($scope, $rootScope, UIEvents, ZoneFactory, ZoneService, EditZoneService) {

    $scope.ConfigureMode = false;

    $scope.Zones = ZoneService.Zones;

    /**
     * Handler for Add New Zone button
     */
    $scope.AddZone = function() {
      var newZone = new ZoneFactory({});
      EditZoneService.Zone = newZone;
      $rootScope.$broadcast(UIEvents.ZoneAdding, newZone);
      $scope.setRoute('/editZone');
    };


    
    /**
     * Watch for ConfigureMode switches
     */
    $scope.$on(UIEvents.SetConfigureMode, function(event, modeSwitch) {
      $scope.ConfigureMode = modeSwitch;
    });


    /** Turn off Configure Mode on first load **/
    $rootScope.$broadcast(UIEvents.SetConfigureMode, $scope.ConfigureMode);


}]);
