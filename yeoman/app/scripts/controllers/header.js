'use strict';

yeomanApp.controller('HeaderCtrl'
  , ['$scope', '$rootScope', '$location'
  , function($scope, $rootScope, $location) {

  $scope.ConfigureMode = false;


  $scope.LocationIsHome = function() {
    return ($location.$$path === '/');
  };

  

}]);
