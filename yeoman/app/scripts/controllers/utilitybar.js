'use strict';

yeomanApp.controller('UtilitybarCtrl'
  , ['$scope', '$http', 'UIEvents'
  , function($scope, $http, UIEvents) {
  

    $scope.Override = false;

    /**
     * Sets the system override
     * @param {bool|null} value true|false|null
     */
    $scope.SetOverride = function(value) {

      var data = {
        override: (value === null) ? "null" : value.toString()
      };



      $http.put('/override', data).success(function(response) {
        // console.log("PUT /override", response);
        $scope.Override = value;
      }).error(function(response) {
        // console.log("PUT /override", response);
      });
    };

    /**
     * Gets the override value from the system
     */
    $scope.GetOverride = function() {

      $http.get('/override').success(function(response) {
        // console.log("GET /override", response);

        $scope.$broadcast(UIEvents.OverrideUpdate, response.override);
        $scope.Override = response.override;

      }).error(function(response) {
        // console.log("GET /override", response);

      });
    };

    $scope.GetOverride();


    $scope.$on(UIEvents.OverrideUpdate, function(event, override) {
      $scope.Override = override;
    });
}]);
