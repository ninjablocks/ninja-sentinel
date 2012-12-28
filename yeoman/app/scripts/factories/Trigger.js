'use strict';

yeomanApp.factory('TriggerFactory'
  , [ '$rootScope', '$http', 'UIEvents', 'NinjaUtilities'
  , function($rootScope, $http, UIEvents, NinjaUtilities) {

    return function(options) {

      this.Zone = null; // Reference back to the associated Zone
 
      this.Options = {
        name: '',
        data: '',
        type: ''
      };

      this.Options = NinjaUtilities.ObjectMerge(this.Options, options);

      var normalize = function() {
        if (this.Options.id) {
          this.id = this.Options.id;
          delete this.Options.id;
        }

        if (this.Options.zone) {
          this.Zone = this.Options.zone;
          delete this.Options.zone;
        }

        if (this.Options.Zone) {
          this.Zone = this.Options.Zone;
          delete this.Options.Zone;
        }
      }.bind(this);
      normalize();


      /**
       * Checks if this trigger is a valid FQ trigger
       * ie: All options have been set and a Zone has been applied
       */
      this.IsValid = function() {
        var valid = true;
        if (!this.Options.type) { valid = false; }
        if (!this.Options.name) { valid = false; }
        if (!this.Options.data) { valid = false; }
        if (!this.Zone.id) { valid = false; }

        return valid;
      };

      /**
       * Saves this trigger to the database
       * @param {Function} callback Optional callback function
       */
      this.Save = function(callback) {
        console.log("Trigger.Save()", this);
        if (this.IsValid()) {
          var payload = this.Options;
          $http.put('/zone/' + this.Zone.id + '/trigger', payload).success(function(response) {
            console.log(response);
            if (callback) {
              callback(response);
            }
          }).error(function(response) {
            console.log("Error:", response);
            if (callback) {
              callback(response);
            }
          });
          return true;
        } else {
          console.log('Trigger not valid for saving')
          return false;
        }
      };


      /**
       * Delete a trigger
       * @param {Function} callback [description]
       */
      this.Delete = function(callback) {
        console.log("Trigger.Delete()", this);


        $http.delete('/zone/' + this.Zone.id + '/trigger/' + this.Options.data).succes(function(response) {
          console.log(response);
          if (callback) {
            callback(response);
          }
        }).error(function(response) {
          console.log('Error:', response);
          if (callback) {
            callback(response);
          }
        });
      };

    };




    }
  ]);