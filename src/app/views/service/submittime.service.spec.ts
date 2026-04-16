import { TestBed } from '@angular/core/testing';

import { SubmittimeService } from './submittime.service';

describe('SubmittimeService', () => {
  let service: SubmittimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmittimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
