import { TestBed } from '@angular/core/testing';

import { CurrentClinicalImpressionService } from './current-clinical-impression.service';

describe('CurrentClinicalImpressionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentClinicalImpressionService = TestBed.get(CurrentClinicalImpressionService);
    expect(service).toBeTruthy();
  });
});
