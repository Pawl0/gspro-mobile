import { TestBed } from '@angular/core/testing';

import { AreasPreService } from './areas-pre.service';

describe('AreasPreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AreasPreService = TestBed.get(AreasPreService);
    expect(service).toBeTruthy();
  });
});
