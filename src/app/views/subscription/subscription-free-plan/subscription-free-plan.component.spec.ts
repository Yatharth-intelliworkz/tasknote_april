import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionFreePlanComponent } from './subscription-free-plan.component';

describe('SubscriptionFreePlanComponent', () => {
  let component: SubscriptionFreePlanComponent;
  let fixture: ComponentFixture<SubscriptionFreePlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriptionFreePlanComponent]
    });
    fixture = TestBed.createComponent(SubscriptionFreePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
