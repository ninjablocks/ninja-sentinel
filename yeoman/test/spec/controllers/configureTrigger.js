'use strict';

describe('Controller: ConfigureTriggerCtrl', function() {

  // load the controller's module
  beforeEach(module('yeomanApp'));

  var ConfigureTriggerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    ConfigureTriggerCtrl = $controller('ConfigureTriggerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
