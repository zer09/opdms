import { TestBed, async, inject } from '@angular/core/testing';

import { InitSecGuard } from './init-sec.guard';

describe('InitSecGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitSecGuard]
    });
  });

  it('should ...', inject([InitSecGuard], (guard: InitSecGuard) => {
    expect(guard).toBeTruthy();
  }));
});
