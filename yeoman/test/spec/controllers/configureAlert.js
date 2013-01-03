'use strict';

describe('Controller: ConfigureAlertCtrl', function() {

  // load the controller's module
  beforeEach(module('yeomanApp'));

  var ConfigureAlertCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    ConfigureAlertCtrl = $controller('ConfigureAlertCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
