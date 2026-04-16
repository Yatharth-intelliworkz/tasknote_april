import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageManagementComponent } from './manage-management.component';

describe('ManageManagementComponent', () => {
  let component: ManageManagementComponent;
  let fixture: ComponentFixture<ManageManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageManagementComponent]
    });
    fixture = TestBed.createComponent(ManageManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
