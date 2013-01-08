'use strict';

yeomanApp.controller('ZoneCtrl'
  , ['$scope', '$rootScope', 'UIEvents', 'EditZoneService', 'TriggerFactory', 'EditTriggerService'
  , function($scope, $rootScope, UIEvents, EditZoneService, TriggerFactory, EditTriggerService) {


    /**
     * Edit this zone
     */
    $scope.EditZone = function() {
        $rootScope.$broadcast(UIEvents.ZoneEditing, $scope.zone);
        EditZoneService.Zone = $scope.zone;
        $scope.setRoute('/editZone');
    };


    /**
     * Sets the override value for the Zone
     * @param {bool|null} value Override value
     */
    $scope.SetOverride = function(value) {
        $scope.zone.SetOverride(value);
    };

    /**
     * Delete Zone button
     */
    $scope.Delete = function() {
      $scope.zone.Delete();
    };


    /**
     * Determines if the zone is armed (either manually or by override)
     */
    $scope.IsArmed = function() {
        if ($rootScope.Override === null) {
            return $scope.zone.Options.overrideActive;
        } else{
            return $rootScope.Override;
        }
    };


    /**
     * Determines if the Zone is overridden
     */
    $scope.IsOverridden = function() {
        return ($rootScope.Override !== null);
    };


    /**
     * Determine if the zone has any triggers assigned
     */
    $scope.HasTriggers = function() {
        return ($scope.zone.Triggers.length > 0);
    };


    /**
     * Add a new trigger to the zone
     */
    $scope.AddNewTrigger = function() {
      EditZoneService.Zone = $scope.zone;
      var newTrigger = new TriggerFactory({
        zone: $scope.zone,
        name: 'My Trigger',
        type: 'PIR'
      });
      EditTriggerService.Trigger = newTrigger;
      $scope.setRoute('/configureTrigger');
    };


}]);
