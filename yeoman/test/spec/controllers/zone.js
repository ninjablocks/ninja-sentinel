'use strict';

describe('Controller: ZoneCtrl', function() {

  // load the controller's module
  beforeEach(module('yeomanApp'));

  var ZoneCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    ZoneCtrl = $controller('ZoneCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
