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


    $scope.Delete = function() {
      $scope.Zone.Delete();
      $scope.setRoute('/');
    };


}]);
