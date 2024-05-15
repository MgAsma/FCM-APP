import { TestBed } from '@angular/core/testing';

import { IdleDetectionService } from './idle-detection.service';

describe('IdleDetectionService', () => {
  let service: IdleDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdleDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
