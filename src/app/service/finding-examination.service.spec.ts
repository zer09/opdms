import { TestBed } from '@angular/core/testing';

import { FindingExaminationService } from './finding-examination.service';

describe('FindingExaminationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FindingExaminationService = TestBed.get(FindingExaminationService);
    expect(service).toBeTruthy();
  });
});
