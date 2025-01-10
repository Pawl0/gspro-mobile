import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormdebugComponent } from 'src/app/shared/formdebug/formdebug.component';

describe('FormdebugComponent', () => {
  let component: FormdebugComponent;
  let fixture: ComponentFixture<FormdebugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormdebugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormdebugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
