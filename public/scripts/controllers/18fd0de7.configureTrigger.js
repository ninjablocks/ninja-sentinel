'use strict';

yeomanApp.controller('ConfigureTriggerCtrl'
  , ['$scope', '$rootScope', 'UIEvents', 'EditTriggerService', 'EditZoneService', 'AlertFactory', 'EditAlertService'
  , function($scope, $rootScope, UIEvents, EditTriggerService, EditZoneService, AlertFactory, EditAlertService) {

    $scope.Zone = EditZoneService.Zone;
    $scope.Trigger = EditTriggerService.Trigger;

    /**
     * Saves the Trigger
     */
    $scope.Save = function() {
      if ($scope.configureTrigger.$valid) {
        $scope.Trigger.Save(function() {
          if ($rootScope.Alerts.length === 0) {
            var newAlert = new AlertFactory({
              type: 'sms'
            });
            EditAlertService.Alert = newAlert;
            $scope.setRoute('/configureAlert');
          } else {
            $scope.setRoute('/editZone');
          }
        });
      } else {
        
      }
    };

    /**
     * Deletes the current Trigger
     */
    $scope.Delete = function() {
      $scope.Trigger.Delete(function() {
        $scope.setRoute('/editZone');
      });
    };



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
      $scope.Trigger.Options.data = entry.DA;
      $scope.Stop();
    };

    /**
     * Removes an entry by dataString from the ListenEntries
     * @param {string} dataString DataString to search for
     */
    $scope.RemoveEntryByDataString = function(dataString) {

      for (var i=0; i<$scope.ListenEntries.length; i++) {
        var entry = $scope.ListenEntries[i];
        if (entry.DA === dataString) {
          $scope.RemoveEntry(entry);
          break;
        }
      }
    };

    /**
     * Determines if there is a selected value within the ListenEntries
     */
    $scope.GetDetectedValueFromEntries = function() {

      for (var i=0; i<$scope.ListenEntries.length; i++) {
        var entry = $scope.ListenEntries[i];
        if (entry.Count >= 3 ) {
          return entry;
        }
      }
    };



}]);
