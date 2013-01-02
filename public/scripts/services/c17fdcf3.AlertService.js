'use strict';

yeomanApp.factory('AlertService'
  , ['$rootScope', '$http', 'UIEvents', 'NinjaUtilities', 'AlertFactory'
  , function($rootScope, $http, UIEvents, NinjaUtilities, AlertFactory) {

    var alertService = {

      Alerts: [],

      /**
       * Gets the alerts from the API
       * @param {Function} callback Optional callback function
       */
      GetAlerts: function(callback) {

        $http.get('/alert').success(function(response) {
          if (DEBUG) console.log('GetAlerts:', response);

          var alertOptionsArray = NinjaUtilities.ObjectArrayToArray(response);
          this.Alerts = this.InstantiateAlerts(alertOptionsArray);
          if (callback) {
            callback(response);
          }
        }.bind(this)).error(function(response) {
          if (DEBUG) console.log('GetAlerts (FAILED)', response);
          if (callback) {
            callback(response);
          }
        }.bind(this));

      },

      /**
       * Instantiates an array of alertOption objects
       * @param {object} alertOptionsArray Options object array
       */
      InstantiateAlerts: function(alertOptionsArray) {
        var alerts = [];

        for (var i=0; i<alertOptionsArray.length; i++) {
          var alertOptions = alertOptionsArray[i];
          var alert = this.InstantiateAlert(alertOptions);
          alerts.push(alert);
        }

        return alerts;
      },

      InstantiateAlert: function(alertOptions) {
        var alert = new AlertFactory(alertOptions);
        return alert;
      }
    };

    $rootScope.$on(UIEvents.AlertRemoved, function(event, alert) {
      if (DEBUG) console.log('AlertRemoved watch', alert);
      var removeIndex = alertService.Alerts.indexOf(alert);
      alertService.Alerts.splice(removeIndex, 1);
    });

    $rootScope.$on(UIEvents.AlertAdded, function(event, alert) {
      if (DEBUG) console.log('AlertAdded watch', alert);
      alertService.Alerts.push(alert);
    })

    return alertService;

}]);
