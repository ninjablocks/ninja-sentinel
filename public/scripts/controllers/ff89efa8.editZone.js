'use strict';

yeomanApp.controller('EditZoneCtrl'
  , ['$scope', '$rootScope', 'UIEvents', 'ZoneFactory', 'ZoneService', 'EditZoneService', 'EditTriggerService', 'TriggerFactory'
  , function($scope, $rootScope, UIEvents, ZoneFactory, ZoneService, EditZoneService, EditTriggerService, TriggerFactory) {


    $scope.Zone = EditZoneService.Zone;

    /**
     * Saves the zone to the backend
     */
    $scope.Save = function() {
      $scope.Zone.Save();
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
        zone: $scope.Zone
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
