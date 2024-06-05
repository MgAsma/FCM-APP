import { TestBed } from '@angular/core/testing';

import { TlsIntervalService } from './service/tls-interval.service';

describe('TlsIntervalService', () => {
  let service: TlsIntervalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TlsIntervalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
