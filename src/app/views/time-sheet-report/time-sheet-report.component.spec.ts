import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetReportComponent } from './time-sheet-report.component';

describe('TimeSheetReportComponent', () => {
  let component: TimeSheetReportComponent;
  let fixture: ComponentFixture<TimeSheetReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeSheetReportComponent]
    });
    fixture = TestBed.createComponent(TimeSheetReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
