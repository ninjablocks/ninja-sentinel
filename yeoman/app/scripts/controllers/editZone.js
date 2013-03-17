'use strict';

yeomanApp.controller('EditZoneCtrl'
  , ['$scope', '$rootScope', 'UIEvents', 'ZoneFactory', 'ZoneService', 'EditZoneService', 'EditTriggerService', 'TriggerFactory'
  , function($scope, $rootScope, UIEvents, ZoneFactory, ZoneService, EditZoneService, EditTriggerService, TriggerFactory) {


    $scope.Zone = EditZoneService.Zone;
    $scope.Submitted = false;

    /**
     * Saves the zone to the backend
     */
    $scope.Save = function() {
      $scope.Submitted = true;
      if ($scope.editZone.$valid) {

        // Detect if this is a new Zone
        if ($scope.Zone.id) {
          // Existing Zone;
          $scope.Zone.Save();
          $scope.setRoute('/');
        } else {
          $scope.Zone.Save(function() {
            EditZoneService.Zone = $scope.Zone;
            $scope.AddNewTrigger();
          });
          
        }
      }
      
    };


    /**
     * Sets an external trigger to activate/deactivate this zone
     * @param {bool} mode     True = activate, False = deactivate
     * @param {string} rfString Binary string to respond to
     */
    $scope.SetExternalTrigger = function(mode, rfString) {
      if (mode) { // Activate
        $scope.Zone.Options.externalActivate = rfString;
        console.log("Activate", $scope.ActivateTrigger);
      } else { // Deactivate
        $scope.Zone.Options.externalDeactivate = rfString;
        console.log("Deactivate", $scope.DeactivateTrigger);
      }
    };


    $scope.SetActivateTrigger = function(rfString) {
      $scope.SetExternalTrigger(true, rfString);
    };

    $scope.SetDeactivateTrigger = function(rfString) {
      $scope.SetExternalTrigger(false, rfString);
    };

    /**
     * Deletes this zone
     */
    $scope.Delete = function() {
      $scope.Zone.Delete();
      $scope.setRoute('/');
    };

    /**
     * Add a new trigger to the zone
     */
    $scope.AddNewTrigger = function() {
      var newTrigger = new TriggerFactory({
        zone: $scope.Zone,
        name: 'My Trigger',
        type: 'PIR'
      });
      EditTriggerService.Trigger = newTrigger;
      $scope.setRoute('/configureTrigger');
    };


    /**
     * Edits the specified trigger
     * Redirect user to /configureTrigger
     * @param {Trigger} trigger Trigger to edit
     */
    $scope.EditTrigger = function(trigger) {
      EditTriggerService.Trigger = trigger;
      $scope.setRoute('/configureTrigger');
    };



    /**
     * Determine if this zone has triggers
     */
    $scope.HasTriggers = function() {
      return $scope.Zone.Triggers.length > 0;
    };


    /**
     * Toggling Extra panel
     */
    $scope.ToggleExtra = function() {

    }

}]);
