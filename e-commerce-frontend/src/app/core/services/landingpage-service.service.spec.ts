import { TestBed } from '@angular/core/testing';

import { LandingpageServiceService } from './landingpage-service.service';

describe('LandingpageServiceService', () => {
  let service: LandingpageServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandingpageServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
