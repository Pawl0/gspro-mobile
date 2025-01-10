import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaPragaComponent } from './nova-praga.component';

describe('NovaPragaComponent', () => {
  let component: NovaPragaComponent;
  let fixture: ComponentFixture<NovaPragaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovaPragaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovaPragaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
