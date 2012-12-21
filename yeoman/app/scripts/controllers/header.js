'use strict';

yeomanApp.controller('HeaderCtrl'
  , ['$scope', '$rootScope', '$location', 'UIEvents'
  , function($scope, $rootScope, $location, UIEvents) {


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
    };

    $rootScope.$on(UIEvents.SetConfigureMode, function(event, configureMode) {
      $scope.ConfigureMode = configureMode;
    });

}]);
