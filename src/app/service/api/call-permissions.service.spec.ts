import { TestBed } from '@angular/core/testing';

import { CallPermissionsService } from './call-permissions.service';

describe('CallPermissionsService', () => {
  let service: CallPermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallPermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
