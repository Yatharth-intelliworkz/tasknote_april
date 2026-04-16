import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMemeberComponent } from './manage-memeber.component';

describe('ManageMemeberComponent', () => {
  let component: ManageMemeberComponent;
  let fixture: ComponentFixture<ManageMemeberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageMemeberComponent]
    });
    fixture = TestBed.createComponent(ManageMemeberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
