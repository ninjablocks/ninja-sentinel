'use strict';

yeomanApp.controller('ZoneCtrl'
  , ['$scope', '$rootScope', 'UIEvents', 'EditZoneService'
  , function($scope, $rootScope, UIEvents, EditZoneService) {


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



}]);
