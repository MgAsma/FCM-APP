import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { activateChildGuard } from './activate-child.guard';

describe('activateChildGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => activateChildGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
