'use strict';

describe('Controller: TriggerCtrl', function() {

  // load the controller's module
  beforeEach(module('yeomanApp'));

  var TriggerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    TriggerCtrl = $controller('TriggerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
