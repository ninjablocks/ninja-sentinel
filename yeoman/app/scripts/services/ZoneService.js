'use strict';

yeomanApp.factory('ZoneService'
  , ['$rootScope', '$http', 'NinjaUtilities'
  , function($rootScope, $http, NinjaUtilities) {
  var zoneService = {

    /**
     * Get all the zones
     */
    GetZones: function(callback) {

      $http.get("/zone").success(function(response) {
        console.log("GetZones:", response);
        if (callback) {
          callback(response);
        }
      }).error(function(response) {
        console.log("GetZones (FAILED):", response);
        if (callback) {
          callback(response);
        }
      });
    },


    /**
     * Gets a specific zone from the API
     * @param {string}   zoneId   ZoneId to GET
     * @param {Function} callback Optional callback function
     */
    GetZone: function(zoneId, callback) {
      $http.get("/zone/" + zoneId).success(function(response) {
        console.log("GetZone:", response);
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
      if (zone.Options.id) {
        // Exists. Update only
        $http.put("/zone/" + zone.Options.id, zone.Options, { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'} }).success(function(response) {
          console.log("SaveZone Existing:", response);
          if (callback) {
            callback(response);
          }
        });
      } else {
        // Create new
        $http.post("/zone", zone.Options, { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'} }).success(function(response) {
          console.log("SaveZone New:", response);
          if (callback) {
            callback(response);
          }
        });
      }
    }

  };

  return zoneService;
}]);
