import { TestBed } from '@angular/core/testing';

import { RotasService } from './rotas.service';

describe('RotasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RotasService = TestBed.get(RotasService);
    expect(service).toBeTruthy();
  });
});
