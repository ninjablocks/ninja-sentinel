'use strict';

yeomanApp.controller('ConfigureAlertCtrl'
  , ['$scope', 'EditAlertService', 'UIEvents'
  , function($scope, EditAlertService, UIEvents) {

  $scope.Alert = EditAlertService.Alert;
  $scope.ErrorMessage = "";
  $scope.Submitted = false;

  /**
   * Saves this alert
   */
  $scope.Save = function() {
    $scope.Submitted = true;
    if ($scope.configureAlert.$valid) {
      $scope.Alert.Save(function() {
        $scope.setRoute('/alerts');
      });
      
    }
  };


  $scope.IsPhoneNumber = function() {
    return ($scope.Alert.Options.type === "sms" || $scope.Alert.Options.type === "call");
  };

  $scope.$on(UIEvents.AlertUpdateFailed, function(event, errorMessage) {
    if (DEBUG) console.log("AlertUpdateFailed", errorMessage);
    $scope.ErrorMessage = errorMessage;
  });

}]);
