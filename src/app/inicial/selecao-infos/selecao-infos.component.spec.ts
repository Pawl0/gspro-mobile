import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecaoInfosComponent } from './selecao-infos.component';

describe('SelecaoInfosComponent', () => {
  let component: SelecaoInfosComponent;
  let fixture: ComponentFixture<SelecaoInfosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelecaoInfosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecaoInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
