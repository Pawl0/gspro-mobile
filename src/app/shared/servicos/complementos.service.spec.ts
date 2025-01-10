import { TestBed } from '@angular/core/testing';

import { ComplementosService } from './complementos.service';

describe('ComplementosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComplementosService = TestBed.get(ComplementosService);
    expect(service).toBeTruthy();
  });
});
