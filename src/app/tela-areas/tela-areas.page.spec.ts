import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaAreasPage } from './tela-areas.page';

describe('TelaAreasPage', () => {
  let component: TelaAreasPage;
  let fixture: ComponentFixture<TelaAreasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelaAreasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelaAreasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
