'use strict';

describe('Controller: AlertsCtrl', function() {

  // load the controller's module
  beforeEach(module('yeomanApp'));

  var AlertsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    AlertsCtrl = $controller('AlertsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
