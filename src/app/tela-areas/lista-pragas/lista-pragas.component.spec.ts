import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPragasComponent } from './lista-pragas.component';

describe('ListaPragasComponent', () => {
  let component: ListaPragasComponent;
  let fixture: ComponentFixture<ListaPragasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaPragasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPragasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
