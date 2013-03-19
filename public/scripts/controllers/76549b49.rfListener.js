'use strict';

yeomanApp.controller('RfListenerCtrl',
  ['$scope', '$rootScope', 'UIEvents'
  , function($scope, $rootScope, UIEvents) {


    $scope.IsListening = false;
    $scope.ListenEntries = [];


    /**
     * Activates RF433 Listening Mode
     */
    $scope.Listen = function(targetValue) {
      $scope.IsListening = true;
    };


    /**
     * Stops RF433 Listening Mode
     */
    $scope.Stop = function() {
      $scope.IsListening = false;
      $scope.ListenEntries = [];
    };


    /**
     * Clears the specified $scope variable
     */
    $scope.Clear = function() {
      $scope.Trigger.Options.data = null;
    };

    /**
     * Finds a listened dataString within the ListenEntries
     * @param {string} dataString DataString to search for
     */
    $scope.FindEntry = function(dataString) {
      for (var i=0; i<$scope.ListenEntries.length; i++) {
        var entry = $scope.ListenEntries[i];
        if (entry.DA === dataString) {
          return entry;
        }
      }
    };

    /**
     * Removes a complete entry object from the ListenEntries
     * @param {object} entry Entry object to remove
     */
    $scope.RemoveEntry = function(entry) {
      var index = $scope.ListenEntries.indexOf(entry);
      $scope.ListenEntries.splice(index, 1);
    };

    /**
     * Selects the entry specified
     * @param {Entry Object} entry The Entry to select
     */
    $scope.SelectEntry = function(entry) {
      // $scope.Trigger.Options.data = entry.DA;
      $scope.Stop();
    };

    /**
     * Handle Listening events
     */
    $rootScope.$on(UIEvents.PusherData, function(event, data) {
      $scope.$apply(function() {
        if ($scope.IsListening) {
          if (parseInt(data.D, 10) === 11) { // Check for any Wifi device

            var existingEntry = $scope.FindEntry(data.DA);
            if (existingEntry) {
              // Existing
              var updateIndex = $scope.ListenEntries.indexOf(existingEntry);
              $scope.ListenEntries[updateIndex].Count ++;

            } else {
              // New
              var entry = {
                DA: data.DA,
                Count: 1
              };

              $scope.ListenEntries.push(entry);
            }
          }
        }
      });
    });


}]);
