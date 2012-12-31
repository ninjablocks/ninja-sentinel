'use strict';

describe('Controller: UtilitybarCtrl', function() {

  // load the controller's module
  beforeEach(module('yeomanApp'));

  var UtilitybarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    UtilitybarCtrl = $controller('UtilitybarCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
