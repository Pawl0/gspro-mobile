import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecaoTecnicosComponent } from './selecao-tecnicos.component';

describe('SelecaoTecnicosComponent', () => {
  let component: SelecaoTecnicosComponent;
  let fixture: ComponentFixture<SelecaoTecnicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelecaoTecnicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecaoTecnicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
