'use strict';

yeomanApp.controller('UtilitybarCtrl'
  , ['$scope', '$http'
  , function($scope, $http) {
  

    /**
     * Sets the system override
     * @param {bool|null} value true|false|null
     */ 
    $scope.Override = function(value) {

      var data = {
        override: value.toString()
      };

      $http.put('/override', data).success(function(response) {
        console.log("PUT /override", response);
      }).error(function(response) {
        console.log("PUT /override", response);
      });
    };

    /**
     * Gets the override value from the system
     */
    $scope.GetOverride = function() {

      $http.get('/override').success(function(response) {
        console.log("GET /override", response);
      }).error(function(response) {
        console.log("GET /override", response);
      });
    };

    $scope.GetOverride();
}]);
