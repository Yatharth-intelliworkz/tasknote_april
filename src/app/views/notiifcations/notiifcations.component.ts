import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UntypedFormControl, FormControl, ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, NgModel } from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Router } from '@angular/router';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import * as $ from 'jquery';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../views/service/common.service';
import { Location, NgFor, NgIf } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

interface users {
  item_id: any;
  item_text: string;
  image: string;
  isDisabled?: boolean;
}
interface Module {
  item_id: any;
  item_text: string;
  isDisabled?: boolean;
}

@Component({
  selector: 'app-notiifcations',
  templateUrl: './notiifcations.component.html',
  styleUrls: ['./notiifcations.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, NgMultiSelectDropDownModule, ReactiveFormsModule, FormsModule,MatFormFieldModule, MatDatepickerModule, MatNativeDateModule,NgFor,NgIf],
})
export class NotiifcationsComponent {

  // multiselect dd.
  fileForm!: FormGroup;
  private apiUrl = environment.ApiUrl;
  notificationlistData:any;
  notificationlist:any;
  notificationlistRead:any[] = [];
  notificationlistUnRead:any[] = [];
  selectedItems2: users[] = [];
  selectModule: Module[] = [];
  form: FormGroup;
  user: Array<users> = [];
  task: Array<Module> = [];
  sessioncompany = localStorage.getItem('usercompanyId');
  dropdownSettings2: any = {};

  activeTab: string = 'General'; // Default active tab is General

  constructor(private fb: FormBuilder, private formBuilder: FormBuilder,private route: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService) {


    this.fileForm = this.formBuilder.group({
      multiplefile: ['initialValue'],
    });


    this.form = this.fb.group({
      selectModule: [[]], // Initialize as an empty array
      // attech file
      yourFormControlName: ['initialValue'],
      // attech file
    });

    this.dropdownSettings2 = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 5,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };


    this.user = [
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
        item_id: 4,
        item_text: 'Yamini Patel',
        image: 'url_to_image3.jpg',
      },
    ];

    this.task = [
      {
        item_id: 1,
        item_text: 'Task',
      },
      {
        item_id: 2,
        item_text: 'Project',
      },
      {
        item_id: 3,
        item_text: 'Discussion',
      },
      {
        item_id: 4,
        item_text: 'DMS',
      },
      {
        item_id: 5,
        item_text: 'Note',
      },
    ];

    this.getNotifications();   // Fixed call
  }

  ngOnInit(): void {
    // Removed old readallnotification() call
  }

  // ==================== FIXED & IMPROVED NOTIFICATION LOADING ====================
  getNotifications() {
    const token = localStorage.getItem('tasklogintoken');
    const companyID = this.sessioncompany;

    if (!token || !companyID) {
      console.log('Token or Company ID is missing');
      return;
    }

    this.spinner.show();

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    this.http
      .get(`${this.apiUrl}notificationAllList?companyID=${companyID}`, { headers })
      .subscribe({
        next: (response: any) => {
          this.notificationlistData = response;

          // Safely assign read and unread lists
          this.notificationlistUnRead = response?.data?.unRead || [];
          this.notificationlistRead   = response?.data?.read   || [];

          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          console.error('Error loading Notification list:', error);
          if (error.status === 401) {
            this.commonService.logout();
          }
        }
      });
  }
  // ===================================================================

  notificationMarkAll(){
    const token = localStorage.getItem('tasklogintoken');
    const companyID = this.sessioncompany;

    if (!token || !companyID) return;

    this.spinner.show();

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    this.http
      .get(`${this.apiUrl}notificationViewAll?companyID=${companyID}`, { headers })
      .subscribe({
        next: (response: any) => {
          if(response.status == true){
            setTimeout(() => {
              this.toastr.success('Notification Mark All Successfully.')
            },10);
          }
          this.getNotifications();   // Refresh after action
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          if (error.status === 401) {
            this.commonService.logout();
          }
          console.error('Error loading Notification list:', error);
        }
      });
  }

  notificationclearAll(){
    const token = localStorage.getItem('tasklogintoken');
    const companyID = this.sessioncompany;

    if (!token || !companyID) return;

    this.spinner.show();

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    this.http
      .get(`${this.apiUrl}notificationDeleteAll?companyID=${companyID}`, { headers })
      .subscribe({
        next: (response: any) => {
          if(response.status == true){
            setTimeout(() => {
              this.toastr.success('Notification Clear All Successfully.')
            },10);
          }
          this.getNotifications();   // Refresh after action
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          if (error.status === 401) {
            this.commonService.logout();
          }
          console.error('Error loading Notification list:', error);
        }
      });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}