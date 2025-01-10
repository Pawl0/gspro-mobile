import { TestBed } from '@angular/core/testing';

import { InicialService } from './inicial.service';

describe('InicialService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InicialService = TestBed.get(InicialService);
    expect(service).toBeTruthy();
  });
});
