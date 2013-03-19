'use strict';

describe('Directive: playWebcam', function() {
  beforeEach(module('yeomanApp'));

  var element;

  it('should make hidden element visible', inject(function($rootScope, $compile) {
    element = angular.element('<play-webcam></play-webcam>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the playWebcam directive');
  }));
});
