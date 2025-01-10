import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaListaOsPage } from './tela-lista-os.page';

describe('TelaListaOsPage', () => {
  let component: TelaListaOsPage;
  let fixture: ComponentFixture<TelaListaOsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelaListaOsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelaListaOsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
