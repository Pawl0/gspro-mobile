import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecaoEquipeComponent } from './selecao-equipe.component';

describe('SelecaoEquipeComponent', () => {
  let component: SelecaoEquipeComponent;
  let fixture: ComponentFixture<SelecaoEquipeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelecaoEquipeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecaoEquipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
