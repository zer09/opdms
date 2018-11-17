import { TestBed, async, inject } from '@angular/core/testing';

import { InitDrGuard } from './init-dr.guard';

describe('InitDrGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitDrGuard]
    });
  });

  it('should ...', inject([InitDrGuard], (guard: InitDrGuard) => {
    expect(guard).toBeTruthy();
  }));
});
