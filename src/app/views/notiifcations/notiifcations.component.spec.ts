import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotiifcationsComponent } from './notiifcations.component';

describe('NotiifcationsComponent', () => {
  let component: NotiifcationsComponent;
  let fixture: ComponentFixture<NotiifcationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotiifcationsComponent]
    });
    fixture = TestBed.createComponent(NotiifcationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
