import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaExecComponent } from './lista-exec.component';

describe('ListaExecComponent', () => {
  let component: ListaExecComponent;
  let fixture: ComponentFixture<ListaExecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaExecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaExecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
