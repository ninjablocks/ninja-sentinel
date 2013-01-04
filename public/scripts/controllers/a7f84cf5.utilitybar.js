'use strict';

yeomanApp.controller('UtilitybarCtrl'
  , ['$scope', '$http', 'UIEvents'
  , function($scope, $http, UIEvents) {
  

    $scope.Override = false;

    /**
     * Checks the see if the override is null
     */
    $scope.IsOverrideNull = function() {
      return ($scope.Override === null);
    };

    /**
     * Checks to see if the override is false
     */
    $scope.IsOverrideFalse = function() {
      return ($scope.Override === false);
    };

    /**
     * Sets the system override
     * @param {bool|null} value true|false|null
     */
    $scope.SetOverride = function(value) {

      if (value !== null) {
        var data = {
          override: value
        };


        $http.put('/override', data).success(function(response) {
          if (DEBUG) console.log("PUT /override", response);
          $scope.Override = value;

        }).error(function(response) {
          if (DEBUG) console.log("PUT /override", response);
        });
      } else {
        $http.delete('/override').success(function(response) {
          $scope.Override = null;
        });
      }
    };

    /**
     * Gets the override value from the system
     */
    $scope.GetOverride = function() {

      $http.get('/override').success(function(response) {
        if (DEBUG) console.log("GET /override", response);

        $scope.$broadcast(UIEvents.OverrideUpdate, response.override);
        $scope.Override = response.override;

      }).error(function(response) {
        if (DEBUG) console.log("GET /override", response);

      });
    };

    $scope.GetOverride();


    $scope.$on(UIEvents.OverrideUpdate, function(event, override) {
      $scope.Override = override;
    });
}]);
