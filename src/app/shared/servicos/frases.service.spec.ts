import { TestBed } from '@angular/core/testing';

import { FrasesService } from './frases.service';

describe('FrasesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FrasesService = TestBed.get(FrasesService);
    expect(service).toBeTruthy();
  });
});
