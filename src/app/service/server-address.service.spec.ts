import { TestBed } from '@angular/core/testing';

import { ServerAddressService } from './server-address.service';

describe('ServerAddressService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerAddressService = TestBed.get(ServerAddressService);
    expect(service).toBeTruthy();
  });
});
