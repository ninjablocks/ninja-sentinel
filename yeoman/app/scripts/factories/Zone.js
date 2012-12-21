'use strict';

yeomanApp.factory('ZoneFactory'
  , ['NinjaUtilities', 'ZoneService'
  , function(NinjaUtilities, ZoneService) {

    /**
     * Zone object. Instantiate with new Zone()
     */
    return function(options) {

      this.id = null;

      this.Options = {
        name: ''
        // activeTimes: [],
        // overrideActive: null
      };

      this.Options = NinjaUtilities.ObjectMerge(this.Options, options);


      this.Save = function() {
        ZoneService.SaveZone(this);
      };

      this.Refresh = function() {
        if (this.id) {
          ZoneService.GetZone(this.id);
        }
      };

      return this;
    };

}]);