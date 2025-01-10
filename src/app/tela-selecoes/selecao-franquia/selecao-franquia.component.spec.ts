import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecaoFranquiaComponent } from './selecao-franquia.component';

describe('SelecaoFranquiaComponent', () => {
  let component: SelecaoFranquiaComponent;
  let fixture: ComponentFixture<SelecaoFranquiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelecaoFranquiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecaoFranquiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
