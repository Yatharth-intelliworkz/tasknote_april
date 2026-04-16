import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTypeComponent } from './task-type.component';

describe('TaskTypeComponent', () => {
  let component: TaskTypeComponent;
  let fixture: ComponentFixture<TaskTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskTypeComponent]
    });
    fixture = TestBed.createComponent(TaskTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
