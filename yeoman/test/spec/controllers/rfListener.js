'use strict';

describe('Controller: RfListenerCtrl', function() {

  // load the controller's module
  beforeEach(module('yeomanApp'));

  var RfListenerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    RfListenerCtrl = $controller('RfListenerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
