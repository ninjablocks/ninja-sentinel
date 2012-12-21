'use strict';

yeomanApp.factory('ZoneService'
  , ['$rootScope', '$http', 'UIEvents', 'NinjaUtilities', 'ZoneFactory'
  , function($rootScope, $http, UIEvents, NinjaUtilities, ZoneFactory) {
  var zoneService = {


    Zones: [],

    /**
     * Get all the zones
     */
    GetZones: function(callback) {

      $http.get('/zone').success(function(response) {
        if (DEBUG) console.log('GetZones:', response);
        var zoneOptionArray = NinjaUtilities.ObjectArrayToArray(response);
        this.Zones = this.InstantiateZones(zoneOptionArray);
        if (callback) {
          callback(response);
        }
      }.bind(this)).error(function(response) {
        if (DEBUG) console.log('GetZones (FAILED):', response);
        if (callback) {
          callback(response);
        }
      }.bind(this));
    },


    /**
     * Instantiate an array of Zones
     * @param {[type]} zoneOptionArray [description]
     */
    InstantiateZones: function(zoneOptionArray) {
      var zones = [];

      for (var i=0; i<zoneOptionArray.length; i++) {
        var zoneOptions = zoneOptionArray[i];
        var zone = this.InstantiateZone(zoneOptions);
        zones.push(zone);
      }

      return zones;
    },

    /**
     * @param {[type]} zoneOptions [description]
     */
    InstantiateZone: function(zoneOptions) {
      var zone = new ZoneFactory(zoneOptions);
      return zone;
    },

    /**
     * Gets a specific zone from the API
     * @param {string}   zoneId   ZoneId to GET
     * @param {Function} callback Optional callback function
     */
    GetZone: function(zoneId, callback) {
      $http.get('/zone/' + zoneId).success(function(response) {
        if (DEBUG) console.log('GetZone:', response);
        if (callback) {
          callback(response);
        }
      });
    },

    /**
     * Saves a Zone
     * @param {Zone} zone Zone to save
     */
    SaveZone: function(zone, callback) {
      if (zone.id) {
        // Exists. Update only
        $http.put('/zone/' + zone.id, zone.Options, { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'} }).success(function(response) {
          if (DEBUG) console.log('SaveZone Existing:', response);
          if (callback) {
            callback(response);
          }
        });
      } else {
        // Create new
        $http.post('/zone', zone.Options, { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'} }).success(function(response) {
          if (DEBUG) console.log('SaveZone New:', response);
          if (callback) {
            callback(response);
          }
        });
      }
    },

    /**
     * Delete a zone
     * @param {Zone}   zone     Zone object to delete
     * @param {Function} callback Callback function
     */
    DeleteZone: function(zone, callback) {
      if (zone.id) {
        $http.delete('/zone/' + zone.id).success(function(response) {
          if (DEBUG) console.log("DeleteZone:", response, zone);
        });
      }
    }

  };

  /**
   * Zone Removals
   */
  $rootScope.$on(UIEvents.ZoneRemoved, function(event, zone) {
    if (DEBUG) console.log("ZoneRemoved watch", zone);
    var removeIndex = zoneService.Zones.indexOf(zone);
    zoneService.Zones.splice(removeIndex, 1);
  });


  $rootScope.$on(UIEvents.ZoneAdded, function(event, zone) {
    if (DEBUG) console.log("ZoneAdded watch", zone);
    zoneService.Zones.push(zone);
  });



  return zoneService;
}]);
