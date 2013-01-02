'use strict';

yeomanApp.controller('AlertsCtrl'
  , ['$scope', 'AlertService', 'AlertFactory', 'EditAlertService'
  , function($scope, AlertService, AlertFactory, EditAlertService) {

    $scope.Alerts = AlertService.Alerts;

    $scope.AddAlert = function() {
      var newAlert = new AlertFactory();
      EditAlertService.Alert = newAlert;
      newAlert.Save();
    }

}]);
