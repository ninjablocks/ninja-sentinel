'use strict';

describe('Service: EditTriggerService', function () {

  // load the service's module
  beforeEach(module('yeomanApp'));

  // instantiate service
  var EditTriggerService;
  beforeEach(inject(function(_EditTriggerService_) {
    EditTriggerService = _EditTriggerService_;
  }));

  it('should do something', function () {
    expect(!!EditTriggerService).toBe(true);
  });

});
