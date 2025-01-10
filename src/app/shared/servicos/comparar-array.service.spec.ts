import { TestBed } from '@angular/core/testing';

import { CompararArrayService } from './comparar-array.service';

describe('CompararArrayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompararArrayService = TestBed.get(CompararArrayService);
    expect(service).toBeTruthy();
  });
});
