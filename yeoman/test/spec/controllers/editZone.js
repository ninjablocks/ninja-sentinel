'use strict';

describe('Controller: EditZoneCtrl', function() {

  // load the controller's module
  beforeEach(module('yeomanApp'));

  var EditZoneCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    EditZoneCtrl = $controller('EditZoneCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
