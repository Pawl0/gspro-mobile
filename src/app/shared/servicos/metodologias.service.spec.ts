import { TestBed } from '@angular/core/testing';

import { MetodologiasService } from './metodologias.service';

describe('MetodologiasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MetodologiasService = TestBed.get(MetodologiasService);
    expect(service).toBeTruthy();
  });
});
