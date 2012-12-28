'use strict';

yeomanApp.factory('ZoneFactory'
  , [ '$rootScope', '$http', 'UIEvents', 'NinjaUtilities', 'TriggerFactory'
  , function( $rootScope, $http, UIEvents, NinjaUtilities, TriggerFactory) {

    /**
     * Zone object. Instantiate with new Zone()
     */
    return function(options) {

      this.id = null;

      this.Triggers = [];

      this.Options = {
        name: '',
        triggers: {}
        // activeTimes: [],
        // overrideActive: null
      };

      this.Options = NinjaUtilities.ObjectMerge(this.Options, options);

      var normalize = function() {
        if (this.Options.id) {
          this.id = this.Options.id;
          delete this.Options.id;
        }

        if (this.Options.triggers) {
          var triggers = NinjaUtilities.ObjectArrayToArray(this.Options.triggers, 'data');

          for(var i=0; i<triggers.length; i++) {
            var triggerOptions = triggers[i];
            var trigger = new TriggerFactory(triggerOptions);
            this.Triggers.push(trigger);
          }

          delete this.Options.triggers;

        }
      }.bind(this);
      normalize();
      console.log(this);

      /**
       * Save/Update this zone
       */
      this.Save = function(callback) {
        console.log("Zone.Save()");
        if (this.id) {
          // Exists. Update only
          $http.put('/zone/' + this.id, this.Options, { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'} }).success(function(response) {
            if (DEBUG) console.log('SaveZone Existing:', response);

            $rootScope.$broadcast(UIEvents.ZoneUpdated, this);

            if (callback) {
              callback(response);
            }
          });
        } else {
          // Create new
          $http.post('/zone', this.Options, { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'} }).success(function(response) {
            if (DEBUG) console.log('SaveZone New:', response);

            //Set the id
            this.id = response.id;

            $rootScope.$broadcast(UIEvents.ZoneAdded, this);

            if (callback) {
              callback(response);
            }
          }.bind(this));
        }
      };

      /**
       * Delete this zone
       */
      this.Delete = function(callback) {
        if (this.id) {
          $http.delete('/zone/' + this.id).success(function(response) {
            if (DEBUG) console.log("DeleteZone:", response, this);
            // Broadcast event that zone was removed
            $rootScope.$broadcast(UIEvents.ZoneRemoved, this);

            if (callback) {
              callback(response);
            }
          }.bind(this));
        }
      };

      /**
       * Refresh the data for this zone from the API
       */
      this.Refresh = function(callback) {
        if (this.id) {
          $http.get('/zone/' + this.id).success(function(response) {
            if (DEBUG) console.log('GetZone:', response);
            if (callback) {
              callback(response);
            }
          });
        }
      };

      return this;
    };

}]);