import { TestBed } from '@angular/core/testing';

import { SecretariesService } from './secretaries.service';

describe('SecretariesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SecretariesService = TestBed.get(SecretariesService);
    expect(service).toBeTruthy();
  });
});
