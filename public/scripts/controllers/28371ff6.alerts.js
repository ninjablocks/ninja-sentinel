'use strict';

yeomanApp.controller('AlertsCtrl'
  , ['$scope', 'AlertService', 'AlertFactory', 'EditAlertService'
  , function($scope, AlertService, AlertFactory, EditAlertService) {

    $scope.Alerts = AlertService.Alerts;

    /**
     * Creates a new alert
     */
    $scope.AddAlert = function() {
      var newAlert = new AlertFactory();
      EditAlertService.Alert = newAlert;
      $scope.setRoute('/configureAlert');
    };

    $scope.EditAlert = function(alert) {
      EditAlertService.Alert = alert;
      $scope.setRoute('/configureAlert');
    };


    /**
     * Deletes an alert
     * @param {Alert} alert Alert object to delete
     */
    $scope.Delete = function(alert) {
      console.log("Deleting Alert", alert);
      alert.Delete();
    };

}]);
