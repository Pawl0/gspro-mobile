import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumidasComponent } from './consumidas.component';

describe('ConsumidasComponent', () => {
  let component: ConsumidasComponent;
  let fixture: ComponentFixture<ConsumidasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumidasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
