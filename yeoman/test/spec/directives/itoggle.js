'use strict';

describe('Directive: itoggle', function() {
  beforeEach(module('yeomanApp'));

  var element;

  it('should make hidden element visible', inject(function($rootScope, $compile) {
    element = angular.element('<itoggle></itoggle>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the itoggle directive');
  }));
});
