import { TestBed } from '@angular/core/testing';

import { PragasService } from './pragas.service';

describe('PragasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PragasService = TestBed.get(PragasService);
    expect(service).toBeTruthy();
  });
});
