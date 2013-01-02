'use strict';

yeomanApp.controller('AlertsCtrl'
  , ['$scope', 'AlertService', 'AlertFactory', 'EditAlertService'
  , function($scope, AlertService, AlertFactory, EditAlertService) {

    $scope.Alerts = AlertService.Alerts;

    /**
     * Creates a new alert
     */
    $scope.AddAlert = function() {
      var newAlert = new AlertFactory({
        type: 'sms',
        alertee: '+61405058148'
      });
      EditAlertService.Alert = newAlert;
      newAlert.Save();
    };


    /**
     * Deletes an alert
     * @param {Alert} alert Alert object to delete
     */
    $scope.Delete = function(alert) {
      alert.Delete();
    }

}]);
