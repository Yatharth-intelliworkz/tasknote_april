import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmsDetailsComponent } from './dms-details.component';

describe('DmsDetailsComponent', () => {
  let component: DmsDetailsComponent;
  let fixture: ComponentFixture<DmsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DmsDetailsComponent]
    });
    fixture = TestBed.createComponent(DmsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
