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
     * Delete Zone button
     */
    $scope.Delete = function() {
      $scope.zone.Delete();
    };


    

}]);
