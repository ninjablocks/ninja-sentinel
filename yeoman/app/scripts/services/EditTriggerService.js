'use strict';

yeomanApp.factory('EditTriggerService'
  , [ 'TriggerFactory'
  , function(TriggerFactory) {

    var editTriggerService = {
      Trigger: null,

      Reset: function() {
        this.Trigger = new TriggerFactory();
      }
    };

    editTriggerService.Reset();

    return editTriggerService;

}]);
