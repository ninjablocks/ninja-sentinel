'use strict';

var DEBUG = true;

var yeomanApp = angular.module('yeomanApp', ['ngResource', 'ui'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/editZone', {
        templateUrl: 'views/editZone.html',
        controller: 'EditZoneCtrl'
      })
      .when('/configureTrigger', {
        templateUrl: 'views/configureTrigger.html',
        controller: 'ConfigureTriggerCtrl'
      })
      .when('/alerts', {
        templateUrl: 'views/alerts.html',
        controller: 'AlertsCtrl'
      })
      .when('/configureAlert', {
        templateUrl: 'views/configureAlert.html',
        controller: 'ConfigureAlertCtrl'
      })
      .when('/history', {
        templateUrl: 'views/history.html',
        controller: 'HistoryCtrl'
      })
      .when('/editZoneWebcams', {
        templateUrl: 'views/editZoneWebcams.html',
        controller: 'EditZoneWebcamsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(false);
  }]);


/**
 * Initialization
 */
yeomanApp.run([
  '$rootScope', '$http', '$location', 'UIEvents', 'NinjaService', 'UserService', 'PusherService', 'DeviceService', 'ZoneService', 'AlertService'
  ,function($rootScope, $http, $location, UIEvents, NinjaService, UserService, PusherService,  DeviceService, ZoneService, AlertService) {


    // iPhone 5 detection
    if (window.screen.height==568) { // iPhone 4"
    document.querySelector("meta[name=viewport]").content="width=320.1";
    }
    

    $rootScope.Override = null;
    $rootScope.Alerts = AlertService.Alerts;
    $rootScope.Zones = ZoneService.Zones;
    

    /**
     * Global Set Route routine. Used by nav.
     * Sets the location to the specified route
     * @param {string} route Location route as specified in $routeProvider
     */
    $rootScope.setRoute = function(route) {
      $location.path(route);
    };

    /**
     * Gets the override value from the system
     */
    $rootScope.GetOverride = function() {

      $http.get('/override').success(function(response) {
        if (DEBUG) console.log("GET /override", response);

        $rootScope.$broadcast(UIEvents.OverrideUpdate, response.override);
        $rootScope.Override = response.override;

      }).error(function(response) {
        if (DEBUG) console.log("GET /override", response);

      });
    };

    $rootScope.GetOverride();

    /**
     * Automatically get the user login status
     */
    UserService.GetLoginStatus();
    UserService.GetInfo();

    ZoneService.GetZones();
    AlertService.GetAlerts();

    DeviceService.LoadUserDevices(function() {

    });





}]);
