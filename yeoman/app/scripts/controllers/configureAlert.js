'use strict';

yeomanApp.controller('ConfigureAlertCtrl'
  , ['$scope', 'EditAlertService'
  , function($scope, EditAlertService) {

  $scope.Alert = EditAlertService.Alert;


  $scope.Save = function() {
    if ($scope.configureAlert.$valid) {
      $scope.Alert.Save(function() {
        $scope.setRoute('/alerts'); 
      });
      
    }
  };

}]);
