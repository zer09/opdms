import { TestBed } from '@angular/core/testing';

import { PresentComplaintService } from './present-complaint.service';

describe('PresentComplaintService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PresentComplaintService = TestBed.get(PresentComplaintService);
    expect(service).toBeTruthy();
  });
});
