'use strict';

describe('Service: EditAlertService', function () {

  // load the service's module
  beforeEach(module('yeomanApp'));

  // instantiate service
  var EditAlertService;
  beforeEach(inject(function(_EditAlertService_) {
    EditAlertService = _EditAlertService_;
  }));

  it('should do something', function () {
    expect(!!EditAlertService).toBe(true);
  });

});
