import { TestBed } from '@angular/core/testing';

import { FirstEntryService } from './FirstEntry.service';

describe('FirstEntryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirstEntryService = TestBed.get(FirstEntryService);
    expect(service).toBeTruthy();
  });
});
