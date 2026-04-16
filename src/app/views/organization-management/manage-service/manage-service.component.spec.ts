import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageServiceComponent } from './manage-service.component';

describe('ManageServiceComponent', () => {
  let component: ManageServiceComponent;
  let fixture: ComponentFixture<ManageServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageServiceComponent]
    });
    fixture = TestBed.createComponent(ManageServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
