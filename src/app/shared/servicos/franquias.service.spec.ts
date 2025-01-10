import { TestBed } from '@angular/core/testing';

import { FranquiasService } from './franquias.service';

describe('FranquiasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FranquiasService = TestBed.get(FranquiasService);
    expect(service).toBeTruthy();
  });
});
