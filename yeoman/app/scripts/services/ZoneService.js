'use strict';

yeomanApp.factory('ZoneService'
  , ['$rootScope', '$http', 'NinjaUtilities'
  , function($rootScope, $http, NinjaUtilities) {
  var zoneService = {


    Zones: null,

    /**
     * Get all the zones
     */
    GetZones: function(callback) {

      $http.get('/zone').success(function(response) {
        console.log('GetZones:', response);
        this.Zones = NinjaUtilities.ObjectArrayToArray(response);
        if (callback) {
          callback(response);
        }
      }.bind(this)).error(function(response) {
        console.log('GetZones (FAILED):', response);
        if (callback) {
          callback(response);
        }
      }.bind(this));
    },


    /**
     * Gets a specific zone from the API
     * @param {string}   zoneId   ZoneId to GET
     * @param {Function} callback Optional callback function
     */
    GetZone: function(zoneId, callback) {
      $http.get('/zone/' + zoneId).success(function(response) {
        console.log('GetZone:', response);
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
          console.log('SaveZone Existing:', response);
          if (callback) {
            callback(response);
          }
        });
      } else {
        // Create new
        $http.post('/zone', zone.Options, { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'} }).success(function(response) {
          console.log('SaveZone New:', response);
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
          console.log("DeleteZone:", response, zone);
        });
      }
    }

  };

  return zoneService;
}]);
