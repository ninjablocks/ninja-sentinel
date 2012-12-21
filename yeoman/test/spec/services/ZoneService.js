'use strict';

describe('Service: ZoneService', function () {

  // load the service's module
  beforeEach(module('yeomanApp'));

  // instantiate service
  var ZoneService;
  beforeEach(inject(function(_ZoneService_) {
    ZoneService = _ZoneService_;
  }));

  it('should do something', function () {
    expect(!!ZoneService).toBe(true);
  });

});
