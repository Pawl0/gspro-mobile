import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMetComponent } from './lista-met.component';

describe('ListaMetComponent', () => {
  let component: ListaMetComponent;
  let fixture: ComponentFixture<ListaMetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaMetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaMetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
