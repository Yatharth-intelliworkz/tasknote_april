import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreteNewTaskComponent } from './crete-new-task.component';

describe('CreteNewTaskComponent', () => {
  let component: CreteNewTaskComponent;
  let fixture: ComponentFixture<CreteNewTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreteNewTaskComponent]
    });
    fixture = TestBed.createComponent(CreteNewTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
