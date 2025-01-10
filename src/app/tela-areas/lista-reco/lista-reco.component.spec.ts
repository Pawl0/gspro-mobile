import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaRecoComponent } from './lista-reco.component';

describe('ListaRecoComponent', () => {
  let component: ListaRecoComponent;
  let fixture: ComponentFixture<ListaRecoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaRecoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaRecoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
