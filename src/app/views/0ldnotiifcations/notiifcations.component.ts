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
  imports: [CommonModule, MatIconModule, NgMultiSelectDropDownModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, NgFor, NgIf, NgxSpinnerModule],
})
export class NotiifcationsComponent {

  fileForm!: FormGroup;
  private apiUrl = environment.ApiUrl;
  notificationlistData: any;
  notificationlist: any;
  notificationlistRead: any;
  notificationlistUnRead: any;
  selectedItems2: users[] = [];
  selectModule: Module[] = [];
  form: FormGroup;
  user: Array<users> = [];
  task: Array<Module> = [];
  sessioncompany = localStorage.getItem('usercompanyId');
  dropdownSettings2: any = {};

  activeTab: string = 'General';

  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private route: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService
  ) {

    this.fileForm = this.formBuilder.group({
      multiplefile: ['initialValue'],
    });

    this.form = this.fb.group({
      selectModule: [[]],
      yourFormControlName: ['initialValue'],
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
      { item_id: 1, item_text: 'Arvind Rajput', image: 'url_to_image1.jpg' },
      { item_id: 2, item_text: 'Nikunj Sojitra', image: 'url_to_image2.jpg' },
      { item_id: 3, item_text: 'Mital Gandhi', image: 'url_to_image3.jpg' },
      { item_id: 4, item_text: 'Yamini Patel', image: 'url_to_image3.jpg' },
    ];

    this.task = [
      { item_id: 1, item_text: 'Task' },
      { item_id: 2, item_text: 'Project' },
      { item_id: 3, item_text: 'Discussion' },
      { item_id: 4, item_text: 'DMS' },
      { item_id: 5, item_text: 'Note' },
    ];

    // ✅ getnotification() removed — readallnotification() in ngOnInit handles everything
  }

  ngOnInit(): void {
    this.readallnotification();
  }

  notificationMarkAll() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(`${this.apiUrl}notificationViewAll?companyID=` + this.sessioncompany, { headers })
        .subscribe(
          (response: any) => {
            if (response.status == true) {
              setTimeout(() => {
                this.toastr.success('Notification Mark All Successfully.')
              }, 10);
            }
            this.spinner.hide();
            this.readallnotification();
          },
          (error) => {
            this.spinner.hide();
            if (error.status === 401) {
              this.commonService.logout();
            }
            console.error('Error loading Notification list:', error);
          }
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }

  notificationclearAll() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(`${this.apiUrl}notificationDeleteAll?companyID=` + this.sessioncompany, { headers })
        .subscribe(
          (response: any) => {
            if (response.status == true) {
              setTimeout(() => {
                this.toastr.success('Notification Clear All Successfully.')
              }, 10);
            }
            this.spinner.hide();
            this.readallnotification();
          },
          (error) => {
            this.spinner.hide();
            if (error.status === 401) {
              this.commonService.logout();
            }
            console.error('Error loading Notification list:', error);
          }
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }

  readallnotification() {
  const token = localStorage.getItem('tasklogintoken');
  this.sessioncompany = localStorage.getItem('usercompanyId');

  // ✅ If no token or companyID, just return silently — no spinner
  if (!token || !this.sessioncompany) {
    console.log('Missing token or companyID — skipping API call.');
    return; // ✅ NO spinner.show() before this, so nothing gets stuck
  }

  this.spinner.show();
  const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('Accept', 'application/json');

  this.http
    .get(`${this.apiUrl}notificationAllList?companyID=` + this.sessioncompany, { headers })
    .subscribe(
      (companylistData: any) => {
        this.notificationlistData = companylistData;
        this.notificationlistRead = this.notificationlistData?.data?.read;
        this.notificationlistUnRead = this.notificationlistData?.data?.unRead;
        console.log('Read:', this.notificationlistRead);
        console.log('Unread:', this.notificationlistUnRead);
        this.spinner.hide();
      },
      (error) => {
          this.spinner.hide();
          console.error('Error loading Notification list:', error);
        }
      );
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}