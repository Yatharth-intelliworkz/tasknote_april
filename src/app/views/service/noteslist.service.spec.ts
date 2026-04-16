import { TestBed } from '@angular/core/testing';

import { NoteslistService } from './noteslist.service';

describe('NoteslistService', () => {
  let service: NoteslistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoteslistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
