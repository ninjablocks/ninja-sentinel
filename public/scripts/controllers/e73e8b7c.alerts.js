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

    /**
     * Edit this alert
     * @param {[type]} alert [description]
     */
    $scope.EditAlert = function(alert) {
      EditAlertService.Alert = alert;
      $scope.setRoute('/configureAlert');
    };


    /**
     * Deletes an alert
     * @param {Alert} alert Alert object to delete
     */
    $scope.Delete = function(alert) {
      if (DEBUG) console.log("Deleting Alert", alert);
      alert.Delete();
    };

    /**
     * Activate an alert
     * @param {Alert} alert Alert to Activate
     */
    $scope.Activate = function(alert) {
      alert.Activate();
    };


    /**
     * Deactivate an alert
     * @param {Alert} alert Alert to deactivate
     */
    $scope.Deactivate = function(alert) {
      alert.Deactivate();
    };

}]);
