'use strict';

yeomanApp.factory('AlertFactory'
  , ['$rootScope', '$http', 'UIEvents'
  , function($rootScope, $http, UIEvents) {

    return function(options) {

      this.id = null;

      this.Options = {
        type: '',
        alertee: ''
      };

      /**
       * Saves the alert
       * @param {Function} callback Optional callback function
       */
      this.Save = function(callback) {
        console.log("Alert.Save()");

        if (this.id) {

          $http.put('/alert/' + this.id, this.Options).success(function(response) {
            console.log("AlertFactory.Put", response);
            if (callback) {
              callback(response);
            }
          });

        } else {
          $http.post('/alert', this.Options).success(function(response) {
            console.log("AlertFactory.Post", response);
            if (callback) {
              callback(response);
            }
          });
        }
      };
    };

  }]);