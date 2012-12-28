'use strict';

describe('Service: EditZoneService', function () {

  // load the service's module
  beforeEach(module('yeomanApp'));

  // instantiate service
  var EditZoneService;
  beforeEach(inject(function(_EditZoneService_) {
    EditZoneService = _EditZoneService_;
  }));

  it('should do something', function () {
    expect(!!EditZoneService).toBe(true);
  });

});
