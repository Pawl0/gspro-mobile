import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaNaoexecComponent } from './lista-naoexec.component';

describe('ListaNaoexecComponent', () => {
  let component: ListaNaoexecComponent;
  let fixture: ComponentFixture<ListaNaoexecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaNaoexecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaNaoexecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
