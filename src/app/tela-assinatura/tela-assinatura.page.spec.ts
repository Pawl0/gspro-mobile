import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaAssinaturaPage } from './tela-assinatura.page';

describe('TelaAssinaturaPage', () => {
  let component: TelaAssinaturaPage;
  let fixture: ComponentFixture<TelaAssinaturaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelaAssinaturaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelaAssinaturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
