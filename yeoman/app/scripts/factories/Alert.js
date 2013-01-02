'use strict';

yeomanApp.factory('AlertFactory'
  , ['$rootScope', '$http', 'UIEvents', 'NinjaUtilities'
  , function($rootScope, $http, UIEvents, NinjaUtilities) {

    return function(options) {

      this.id = null;

      this.Options = {
        type: '',
        alertee: ''
      };

      this.Options = NinjaUtilities.ObjectMerge(this.Options, options);

      /**
       * Saves the alert
       * @param {Function} callback Optional callback function
       */
      this.Save = function(callback) {
        if (DEBUG) console.log("Alert.Save()");

        if (this.id) { // EDIT EXISTING

          $http.put('/alert/' + this.id, this.Options).success(function(response) {
            if (DEBUG) console.log("AlertFactory.Put", response);

            $rootScope.$broadcast(UIEvents.AlertUpdated, this);
            if (callback) {
              callback(response);
            }
          }.bind(this));

        } else { // CREATE NEW
          $http.post('/alert', this.Options).success(function(response) {
            if (response.id && response.id.length > 30) {
              this.id = response.id;
              if (DEBUG) console.log("AlertFactory.Post", response);

              $rootScope.$broadcast(UIEvents.AlertAdded, this);
              if (callback) {
                callback(response);
              }
            }
          }.bind(this));
        }
      };


      /**
       * Deletes this alert 
       */
      this.Delete = function() {

        $http.delete('/alert/' + this.id).success(function(response) {
          if (DEBUG) console.log("Alert.Delete()", response);
          $rootScope.$broadcast(UIEvents.AlertRemoved, this);
        }.bind(this));
      };
    };

  }]);