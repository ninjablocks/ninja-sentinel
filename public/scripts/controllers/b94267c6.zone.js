'use strict';

yeomanApp.controller('ZoneCtrl'
  , ['$scope', '$rootScope', 'UIEvents'
  , function($scope, $rootScope, UIEvents) {


    /**
     * Delete Zone button
     */
    $scope.Delete = function() {
      $scope.zone.Delete();
    };

}]);
