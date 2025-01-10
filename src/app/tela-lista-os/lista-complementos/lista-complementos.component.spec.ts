import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaComplementosComponent } from './lista-complementos.component';

describe('ListaComplementosComponent', () => {
  let component: ListaComplementosComponent;
  let fixture: ComponentFixture<ListaComplementosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaComplementosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaComplementosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
