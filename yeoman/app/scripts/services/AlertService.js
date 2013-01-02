'use strict';

yeomanApp.factory('AlertService'
  , ['$rootScope', '$http', 'UIEvents'
  , function($rootScope, $http, UIEvents) {

    var alertService = {

      Alerts: [],

      /**
       * Gets the alerts from the API
       * @param {Function} callback Optional callback function
       */
      GetAlerts: function(callback) {

        $http.get('/alert').success(function(response) {
          if (DEBUG) console.log('GetAlerts:', response);

          this.Alerts = response;

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

      },

      InstantiateAlert: function(alertOptions) {

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
