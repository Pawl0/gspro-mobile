import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugPage } from './debug.page';

describe('DebugPage', () => {
  let component: DebugPage;
  let fixture: ComponentFixture<DebugPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebugPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
