import { TestBed } from '@angular/core/testing';

import { ProjectlistService } from './projectlist.service';

describe('ProjectlistService', () => {
  let service: ProjectlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
