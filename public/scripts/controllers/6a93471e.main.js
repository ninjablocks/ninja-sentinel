'use strict';

yeomanApp.controller('MainCtrl'
  , ['$scope', '$rootScope', 'UIEvents', 'ZoneFactory', 'ZoneService', 'EditZoneService'
  , function($scope, $rootScope, UIEvents, ZoneFactory, ZoneService, EditZoneService) {

    $scope.ConfigureMode = false;
    $scope.Override = null;
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
     * Sets the configuration mode button. Broadcasting a system wide event
     * @param {bool} modeSwitch true|false
     */
    $scope.SetConfigureMode = function(modeSwitch) {
      $scope.ConfigureMode = modeSwitch;
      $rootScope.$broadcast(UIEvents.SetConfigureMode, $scope.ConfigureMode);
      $rootScope.$broadcast(UIEvents.TopBarClose);
      if (!modeSwitch) {
        $rootScope.setRoute('/');
      }
    };

    
    /**
     * Watch for ConfigureMode switches
     */
    $scope.$on(UIEvents.SetConfigureMode, function(event, modeSwitch) {
      $scope.ConfigureMode = modeSwitch;
    });

    /**
     * Listen for Override
     */
    $scope.$on(UIEvents.OverrideUpdate, function(event, override) {
      $scope.Override = override;
    });


    /** Turn off Configure Mode on first load **/
    $rootScope.$broadcast(UIEvents.SetConfigureMode, $scope.ConfigureMode);


}]);
