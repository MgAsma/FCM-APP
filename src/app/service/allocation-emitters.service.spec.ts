import { TestBed } from '@angular/core/testing';

import { AllocationEmittersService } from './allocation-emitters.service';

describe('AllocationEmittersService', () => {
  let service: AllocationEmittersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllocationEmittersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
