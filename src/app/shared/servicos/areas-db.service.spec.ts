import { TestBed } from '@angular/core/testing';

import { AreasDbService } from './areas-db.service';

describe('AreasDbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AreasDbService = TestBed.get(AreasDbService);
    expect(service).toBeTruthy();
  });
});
