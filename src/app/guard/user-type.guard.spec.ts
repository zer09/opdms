import { TestBed, async, inject } from '@angular/core/testing';

import { UserTypeGuard } from './user-type.guard';

describe('UserTypeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserTypeGuard]
    });
  });

  it('should ...', inject([UserTypeGuard], (guard: UserTypeGuard) => {
    expect(guard).toBeTruthy();
  }));
});
