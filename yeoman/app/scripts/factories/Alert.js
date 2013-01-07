'use strict';

yeomanApp.factory('AlertFactory'
  , ['$rootScope', '$http', 'UIEvents', 'NinjaUtilities'
  , function($rootScope, $http, UIEvents, NinjaUtilities) {

    return function(options) {

      this.id = null;

      this.Options = {
        type: '',
        alertee: '',
        active: true
      };

      this.Options = NinjaUtilities.ObjectMerge(this.Options, options);


      var normalize = function() {
        if (this.Options.id) {
          this.id = this.Options.id;
          delete this.Options.id;
        }

      }.bind(this);
      normalize();

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

      /**
       * Activate this alert
       * @param {Function} callback Optional callback function
       */
      this.Activate = function(callback) {
        var payload = {
          active: true
        };
        $http.put('/alert/' + this.id, payload).success(function(response) {
          if (DEBUG) console.log("Alert.Activate", response);
          $rootScope.$broadcast(UIEvents.AlertActivated);
          this.Options.active = true;

          if (callback) { callback(response); }
        }.bind(this));
      };


      /**
       * Deactivate this alert
       * @param {Function} callback Optional callback function
       */
      this.Deactivate = function(callback) {
        var payload = {
          active: false
        }
        $http.put('/alert/' + this.id, payload).success(function(response) {
          if (DEBUG) console.log("Alert.Activate", response);
          $rootScope.$broadcast(UIEvents.AlertActivated);
          this.Options.active = false;

          if (callback) { callback(response); }
        }.bind(this));
      };
    };

  }]);