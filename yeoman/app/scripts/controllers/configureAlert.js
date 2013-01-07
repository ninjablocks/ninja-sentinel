'use strict';

yeomanApp.controller('ConfigureAlertCtrl'
  , ['$scope', 'EditAlertService', 'UIEvents'
  , function($scope, EditAlertService, UIEvents) {

  $scope.Alert = EditAlertService.Alert;
  $scope.ErrorMessage = "";


  $scope.Save = function() {
    if ($scope.configureAlert.$valid) {
      $scope.Alert.Save(function() {
        $scope.setRoute('/alerts');
      });
      
    }
  };

  $scope.$on(UIEvents.AlertUpdateFailed, function(event, errorMessage) {
    if (DEBUG) console.log("AlertUpdateFailed", errorMessage);
    $scope.ErrorMessage = errorMessage;
  });

}]);
