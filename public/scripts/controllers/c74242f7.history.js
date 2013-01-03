'use strict';

yeomanApp.controller('HistoryCtrl'
  , ['$scope', '$http'
  , function($scope, $http) {

    $scope.History = [];

    $http.get('/history').success(function(response) {
      $scope.History = response;
    });

}]);
