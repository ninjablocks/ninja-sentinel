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
      // Detect if this is a new Zone
      if ($scope.editZone.$valid) {

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


}]);
