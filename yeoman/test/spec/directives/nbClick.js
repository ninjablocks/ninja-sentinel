'use strict';

describe('Directive: nbClick', function() {
  beforeEach(module('yeomanApp'));

  var element;

  it('should make hidden element visible', inject(function($rootScope, $compile) {
    element = angular.element('<nb-click></nb-click>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the nbClick directive');
  }));
});
