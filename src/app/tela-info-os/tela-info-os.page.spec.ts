import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaInfoOsPage } from './tela-info-os.page';

describe('TelaInfoOsPage', () => {
  let component: TelaInfoOsPage;
  let fixture: ComponentFixture<TelaInfoOsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelaInfoOsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelaInfoOsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
