'use strict';

yeomanApp.controller('UtilitybarCtrl'
  , ['$scope', '$rootScope', '$http', '$location', 'UIEvents'
  , function($scope, $rootScope, $http, $location, UIEvents) {
  

    $scope.IsOnHomepage = function() {
      return $location.$$path == "/";
    };

    /**
     * Checks the see if the override is null
     */
    $scope.IsOverrideNull = function() {
      return ($rootScope.Override === null);
    };

    /**
     * Checks to see if the override is false
     */
    $scope.IsOverrideFalse = function() {
      return ($rootScope.Override === false);
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
          $rootScope.Override = value;
          $rootScope.$broadcast(UIEvents.OverrideUpdate, $scope.Override);

        }).error(function(response) {
          if (DEBUG) console.log("PUT /override", response);
        });
      } else {
        $http.delete('/override').success(function(response) {
          $rootScope.Override = null;
          $rootScope.$broadcast(UIEvents.OverrideUpdate, $scope.Override);
        });
      }
    };


}]);
