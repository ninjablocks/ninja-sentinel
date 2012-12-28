'use strict';

yeomanApp.controller('EditZoneCtrl'
  , ['$scope', '$rootScope', 'UIEvents', 'ZoneFactory', 'ZoneService', 'EditZoneService'
  , function($scope, $rootScope, UIEvents, ZoneFactory, ZoneService, EditZoneService) {


    $scope.Zone = EditZoneService.Zone;

    /**
     * Saves the zone to the backend
     */
    $scope.Save = function() {
      $scope.Zone.Save();
    };

    /**
     * Listen for new zones being added
     */
    // $rootScope.$on(UIEvents.ZoneAdding, function(event, zone) {
    //   console.log("ZoneAdding:", zone);
    //   $scope.Zone = zone;
    // });

    /**
     * Listen for editing events
     */
    // $rootScope.$on(UIEvents.ZoneEditing, function(event, zone) {
    //   console.log("ZoneEditing:", zone);
    //   $scope.Zone = zone;
    // });

}]);
