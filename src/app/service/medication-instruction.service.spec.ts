import { TestBed } from '@angular/core/testing';

import { MedicationInstructionService } from './medication-instruction.service';

describe('MedicationInstructionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MedicationInstructionService = TestBed.get(MedicationInstructionService);
    expect(service).toBeTruthy();
  });
});
