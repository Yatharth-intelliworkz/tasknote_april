import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPerfomanceReportComponent } from './user-perfomance-report.component';

describe('UserPerfomanceReportComponent', () => {
  let component: UserPerfomanceReportComponent;
  let fixture: ComponentFixture<UserPerfomanceReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserPerfomanceReportComponent]
    });
    fixture = TestBed.createComponent(UserPerfomanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
