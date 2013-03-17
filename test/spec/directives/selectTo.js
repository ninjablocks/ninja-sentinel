'use strict';

describe('Directive: selectTo', function() {
  beforeEach(module('ninjaSentinelApp'));

  var element;

  it('should make hidden element visible', inject(function($rootScope, $compile) {
    element = angular.element('<select-to></select-to>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the selectTo directive');
  }));
});
