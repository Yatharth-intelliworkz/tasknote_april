import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmsScreenTwoComponent } from './dms-screen-two.component';

describe('DmsScreenTwoComponent', () => {
  let component: DmsScreenTwoComponent;
  let fixture: ComponentFixture<DmsScreenTwoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DmsScreenTwoComponent]
    });
    fixture = TestBed.createComponent(DmsScreenTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
