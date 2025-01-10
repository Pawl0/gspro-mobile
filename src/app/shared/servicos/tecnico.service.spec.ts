import { TestBed } from '@angular/core/testing';

import { TecnicoService } from './tecnico.service';

describe('TecnicoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TecnicoService = TestBed.get(TecnicoService);
    expect(service).toBeTruthy();
  });
});
