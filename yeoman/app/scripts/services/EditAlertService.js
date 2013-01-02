'use strict';

yeomanApp.factory('EditAlertService'
  , ['AlertFactory'
  , function(AlertFactory) {

    var editAlertService = {
      Alert: null,

      Reset: function() {
        this.Alert = new AlertFactory();
      }
    };

    editAlertService.Reset();

    return editAlertService;

}]);
