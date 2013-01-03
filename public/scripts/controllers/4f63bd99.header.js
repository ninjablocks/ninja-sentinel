'use strict';

yeomanApp.controller('HeaderCtrl'
  , ['$scope', '$rootScope', '$location', 'UIEvents', 'ZoneFactory', 'EditZoneService'
  , function($scope, $rootScope, $location, UIEvents, ZoneFactory, EditZoneService) {


    $scope.ConfigureMode = false;


    /**
     * Determines if the current location is the main homepage
     */
    $scope.LocationIsHome = function() {
      return ($location.$$path === '/');
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

    $rootScope.$on(UIEvents.SetConfigureMode, function(event, configureMode) {
      $scope.ConfigureMode = configureMode;
    });

    /**
     * Navigate to the alers
     */
    $scope.ConfigureAlerts = function() {
      $rootScope.$broadcast(UIEvents.TopBarClose);
      $scope.setRoute('/alerts');
    };

    /**
     * Navigate Home
     */
    $scope.GoHome = function() {
      $rootScope.$broadcast(UIEvents.TopBarClose);
      $rootScope.setRoute('/');
    };

    $scope.GoHistory = function() {
      $rootScope.$broadcast(UIEvents.TopBarClose);
      $rootScope.setRoute('/history');
    };

    /**
     * Adds a new Zone, forwarding  user to editZone
     */
    $scope.AddZone = function() {
      var newZone = new ZoneFactory({});
      EditZoneService.Zone = newZone;
      $rootScope.$broadcast(UIEvents.ZoneAdding, newZone);
      $rootScope.$broadcast(UIEvents.TopBarClose);
      $rootScope.setRoute('/editZone');
    };

}]);
