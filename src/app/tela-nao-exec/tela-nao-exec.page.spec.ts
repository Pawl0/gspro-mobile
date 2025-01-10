import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaNaoExecPage } from './tela-nao-exec.page';

describe('TelaNaoExecPage', () => {
  let component: TelaNaoExecPage;
  let fixture: ComponentFixture<TelaNaoExecPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelaNaoExecPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelaNaoExecPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
