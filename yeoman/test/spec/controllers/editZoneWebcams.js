'use strict';

describe('Controller: EditZoneWebcamsCtrl', function() {

  // load the controller's module
  beforeEach(module('yeomanApp'));

  var EditZoneWebcamsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    EditZoneWebcamsCtrl = $controller('EditZoneWebcamsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
