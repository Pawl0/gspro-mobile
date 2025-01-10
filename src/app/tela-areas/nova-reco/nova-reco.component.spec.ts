import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaRecoComponent } from './nova-reco.component';

describe('NovaRecoComponent', () => {
  let component: NovaRecoComponent;
  let fixture: ComponentFixture<NovaRecoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovaRecoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovaRecoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
