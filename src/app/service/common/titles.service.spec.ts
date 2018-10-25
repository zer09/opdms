import { TestBed } from '@angular/core/testing';

import { TitlesService } from './titles.service';

describe('TitlesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TitlesService = TestBed.get(TitlesService);
    expect(service).toBeTruthy();
  });
});
