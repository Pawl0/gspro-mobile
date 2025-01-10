import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaInfoTecnicasPage } from './tela-info-tecnicas.page';

describe('TelaInfoTecnicasPage', () => {
  let component: TelaInfoTecnicasPage;
  let fixture: ComponentFixture<TelaInfoTecnicasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelaInfoTecnicasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelaInfoTecnicasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
