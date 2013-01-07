'use strict';

yeomanApp.controller('MainCtrl'
  , ['$scope', '$rootScope', 'UIEvents', 'ZoneFactory', 'ZoneService', 'EditZoneService', 'AlertService', 'AlertFactory', 'EditAlertService'
  , function($scope, $rootScope, UIEvents, ZoneFactory, ZoneService, EditZoneService, AlertService, AlertFactory, EditAlertService) {

    $scope.ConfigureMode = false;
    $scope.Override = null;
    $scope.Zones = ZoneService.Zones;
    $scope.Alerts = AlertService.Alerts;

    /**
     * Handler for Add New Zone button
     */
    $scope.AddZone = function() {
      var newZone = new ZoneFactory({
        name: 'My Zone'
      });
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
     * Create a new alert
     */
    $scope.CreateAlert = function() {
      var newAlert = new AlertFactory({
        type: 'sms'
      });
      EditAlertService.Alert = newAlert;
      $scope.setRoute('/configureAlert');
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
