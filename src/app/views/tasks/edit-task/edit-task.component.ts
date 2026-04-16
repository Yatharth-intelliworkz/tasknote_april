
import { CUSTOM_ELEMENTS_SCHEMA, Component, NgModule, NgModuleRef, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { UntypedFormControl, FormControl, ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, NgModel } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormModule } from '@coreui/angular';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from '../../service/common.service';
import { MatMenuModule } from '@angular/material/menu';

interface ICountry {
  item_id: any;
  item_text: string;
  image: string;
  isDisabled?: boolean;
}


@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatIconModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, NgIf, FormModule, MatSlideToggleModule, ReactiveFormsModule, MatCheckboxModule, NgForOf, NgMultiSelectDropDownModule, NgStyle, MatDividerModule, MatChipsModule, FormsModule, MatMenuModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EditTaskComponent {
  // priority dropdown

  selectedPriority: { image: string } = { image: '' }; // initialize with the default status

  selectPriority(image: string): void {
    this.selectedPriority = { image };
  }

  // priority dropdown


  private apiUrl = environment.ApiUrl;
  email = new FormControl();


  fileForm!: FormGroup;
  servicelistData: any;
  servicelist: any;
  noteslistData: any;
  ClientlistData: any;
  Clientlist: any;
  role: any;

  ngOnInit(): void {
    this.serviceList();
    this.commonService.checkLoggedIn();
    this.selectPriority('../../../assets/img/dashboard/flag-R.svg');
  }

  selectedItems2: ICountry[] = [];
  form: FormGroup;
  countries: Array<ICountry> = [];

  dropdownSettings2: any = {};

  constructor(private fb: FormBuilder, private formBuilder: FormBuilder, private http: HttpClient,
    private route: Router, private commonService: CommonService) {

    this.serviceList();
    this.ClientList();
    this.role = localStorage.getItem('roleName');
    this.fileForm = this.formBuilder.group({
      multiplefile: ['initialValue'],
    });


    this.form = this.fb.group({
      selectedItems2: [[]], // Initialize as an empty array
      // attech file
      yourFormControlName: ['initialValue'],
      // attech file
    });

    this.dropdownSettings2 = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 2,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };


    this.countries = [
      {
        item_id: 1,
        item_text: 'Arvind Rajput',
        image: 'url_to_image1.jpg',
      },
      {
        item_id: 2,
        item_text: 'Nikunj Sojitra',
        image: 'url_to_image2.jpg',
      },
      {
        item_id: 3,
        item_text: 'Mital Gandhi',
        image: 'url_to_image3.jpg',
      },
      {
        item_id: 3,
        item_text: 'Yamini Patel',
        image: 'url_to_image3.jpg',
      },
    ];


  }

  isDivVisible = false;


  // angular  bootstap date
  selected!: Date | null;
  subTaskselected!: Date | null;
  editsubTaskselected!: Date | null;
  checkListselected!: Date | null;
  // angular  bootstap date

  opened!: boolean;
  reminderOpen!: boolean;
  checklistOpened: boolean | undefined;
  clickOutside() {
    this.opened = !this.opened;
  }
  reminder() {
    this.opened = !this.opened;
  }
  checklist() {
    this.checklistOpened = !this.checklistOpened;
  }

  get getItems() {
    return this.countries.reduce((acc, curr) => {
      // acc[curr.item_id] = curr;
      return acc;
    }, {});
  }

  onItemSelect(item: any) {
    console.log('onItemSelect', item);
  }

  insertservice(information: any): void {

    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .post(`${this.apiUrl}serviceAdd`,
          information,
          { headers }
        )
        .subscribe(
          (response: any) => {
            if (response) {
              this.serviceList();
            }
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        );
    }

  }

  serviceList() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}serviceList`, {
          headers,
        })
        .subscribe(
          (noteslistData: any) => {
            this.servicelistData = noteslistData;
            this.servicelist = this.servicelistData?.data;

          },
          (error) => { }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  ClientList() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}clientGet`, {
          headers,
        })
        .subscribe(
          (noteslistData: any) => {
            this.ClientlistData = noteslistData;
            this.Clientlist = this.ClientlistData?.data;

          },
          (error) => { }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

}
