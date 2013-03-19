'use strict';

describe('Service: WebcamService', function () {

  // load the service's module
  beforeEach(module('yeomanApp'));

  // instantiate service
  var WebcamService;
  beforeEach(inject(function(_WebcamService_) {
    WebcamService = _WebcamService_;
  }));

  it('should do something', function () {
    expect(!!WebcamService).toBe(true);
  });

});
