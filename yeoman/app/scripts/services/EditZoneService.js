'use strict';

yeomanApp.factory('EditZoneService'
  , ['ZoneFactory'
  , function(ZoneFactory) {

    var editZoneService = {
      Zone: null,

      Reset: function() {
        this.Zone = new ZoneFactory();
      }
    };

    editZoneService.Reset();

    return editZoneService;

}]);
