'use strict';

describe('Directive: toggle', function() {
  beforeEach(module('yeomanApp'));

  var element;

  it('should make hidden element visible', inject(function($rootScope, $compile) {
    element = angular.element('<toggle></toggle>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the toggle directive');
  }));
});
