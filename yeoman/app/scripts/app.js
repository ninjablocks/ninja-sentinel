'use strict';

var DEBUG = true;

var yeomanApp = angular.module('yeomanApp', ['ngResource'])
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
  '$rootScope', '$location', 'UIEvents', 'NinjaService', 'UserService', 'PusherService', 'DeviceService', 'ZoneService', 'AlertService'
  ,function($rootScope, $location, UIEvents, NinjaService, UserService, PusherService,  DeviceService, ZoneService, AlertService) {


  /**
   * Global Set Route routine. Used by nav.
   * Sets the location to the specified route
   * @param {string} route Location route as specified in $routeProvider
   */
  $rootScope.setRoute = function(route) {
    $location.path(route);
  };

  /**
   * Automatically get the user login status
   */
  UserService.GetLoginStatus();
  UserService.GetInfo();

  ZoneService.GetZones();
  AlertService.GetAlerts();

  DeviceService.LoadUserDevices(function() {

  });



  

  // UserStore.SetData({ buttons: [ {name: 'button1'}, {name: 'button2'}] });


  $rootScope.$on(UIEvents.SetDeviceType, function(event, deviceType) {
    
  });




}]);
