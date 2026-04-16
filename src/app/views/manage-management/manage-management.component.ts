import { Component,ViewChild  } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { ManageMemeberComponent } from '../manage-memeber/manage-memeber.component';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ThemePalette} from '@angular/material/core';
import {FormsModule} from '@angular/forms';
import {NgFor} from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import {FormControl} from "@angular/forms";
import { MatSelect } from '@angular/material/select';
import { ColorSketchModule } from 'ngx-color/sketch';
import { ColorEvent } from 'ngx-color';
import { RouterModule } from '@angular/router';
import { CommonService } from '../service/common.service';


export interface Car {
  id: string;
  name: string;
}
export const CARS: Car[] = [
  { name: 'Mercedes-Benz', id: 'A' },
  { name: 'Tesla', id: 'B' },
  { name: 'BMW', id: 'C' },
  { name: '	Volvo', id: 'D' },
];

@Component({
  selector: 'app-manage-management',
  templateUrl: './manage-management.component.html',
  styleUrls: ['./manage-management.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, ManageMemeberComponent, MatCheckboxModule, NgFor, FormsModule , NgIf ,ColorSketchModule,RouterModule ],
})
export class ManageManagementComponent {

  // popup checkbox toggle
  
  Mastersetuppermission: boolean = false;
  permissioncheckbox() {
    this.Mastersetuppermission = !this.Mastersetuppermission;
  }
  
  // popup checkbox toggle 

  public state: string = '';

  selectedColor: string = '';

  handleChange($event: ColorEvent) {
    this.state = 'Red'; 
    // this. = $event.color.hex;
    
  }


  protected cars: Car[] = CARS;

  /** control for the selected car */
  public carCtrl: UntypedFormControl = new UntypedFormControl();

  /** control for the MatSelect filter keyword */
  public carFilterCtrl: UntypedFormControl = new UntypedFormControl();

  /** list of cars filtered by search keyword */
  public filteredCars: ReplaySubject<Car[]> = new ReplaySubject<Car[]>(1);

  @ViewChild('singleSelect', { static: true })
  singleSelect!: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  /** flags to set the toggle all checkbox state */
  isIndeterminate = false;
  isChecked = false;

  constructor(private commonService: CommonService) {}

  ngOnInit() {
    this.commonService.checkLoggedIn();
    // set initial selection
    this.carCtrl.setValue([this.cars[1], this.cars[2]]);

    // load the initial car list
    this.filteredCars.next(this.cars.slice());

    // listen for search field value changes
    this.carFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCars();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredCars are loaded initially
   */
  protected setInitialValue() {
    this.filteredCars
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: Car, b: Car) =>
          a && b && a.id === b.id;
      });
  }

  protected filterCars() {
    if (!this.cars) {
      return;
    }
    // get the search keyword
    let search = this.carFilterCtrl.value;
    if (!search) {
      this.filteredCars.next(this.cars.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the cars
    this.filteredCars.next(
      this.cars.filter((car) => car.name.toLowerCase().indexOf(search) > -1)
    );
  }

  toggleSelectAll(selectAllValue: boolean) {
    this.filteredCars
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        if (selectAllValue) {
          this.carCtrl.patchValue(val);
        } else {
          this.carCtrl.patchValue([]);
        }
      });
  }


task: Task = {
  name: 'Select All',
  completed: false,
  subtasks: [
    { name: 'Projects', completed: false },
    { name: 'Tasks', completed: false },
    { name: 'Discussion', completed: false },
    { name: 'DMS', completed: false },
  ],
};

allComplete: boolean = false;

updateAllComplete() {
  this.allComplete = this.task.subtasks && this.task.subtasks.every(subtask => subtask.completed);
}

someComplete(): boolean {
  return this.task.subtasks && this.task.subtasks.some(subtask => subtask.completed);
}

setAll(completed: boolean) {
  this.allComplete = completed;
  if (this.task.subtasks == null) {
    return;
  }
  this.task.subtasks.forEach((t) => (t.completed = completed));
}
}

interface Task {
name: string;
completed: boolean;
subtasks: { name: string; completed: boolean }[];
}
