'use strict';

describe('Directive: foundationHeader', function() {
  beforeEach(module('yeomanApp'));

  var element;

  it('should make hidden element visible', inject(function($rootScope, $compile) {
    element = angular.element('<foundation-header></foundation-header>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the foundationHeader directive');
  }));
});
