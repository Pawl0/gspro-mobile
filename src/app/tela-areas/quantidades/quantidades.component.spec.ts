import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantidadesComponent } from './quantidades.component';

describe('QuantidadesComponent', () => {
  let component: QuantidadesComponent;
  let fixture: ComponentFixture<QuantidadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantidadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
