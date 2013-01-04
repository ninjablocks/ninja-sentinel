'use strict';

describe('Directive: triggerListen', function() {
  beforeEach(module('yeomanApp'));

  var element;

  it('should make hidden element visible', inject(function($rootScope, $compile) {
    element = angular.element('<trigger-listen></trigger-listen>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the triggerListen directive');
  }));
});
