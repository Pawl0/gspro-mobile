import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaMetComponent } from './nova-met.component';

describe('NovaMetComponent', () => {
  let component: NovaMetComponent;
  let fixture: ComponentFixture<NovaMetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovaMetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovaMetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
