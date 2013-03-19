'use strict';

describe('Directive: webcamPlay', function() {
  beforeEach(module('yeomanApp'));

  var element;

  it('should make hidden element visible', inject(function($rootScope, $compile) {
    element = angular.element('<webcam-play></webcam-play>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the webcamPlay directive');
  }));
});
