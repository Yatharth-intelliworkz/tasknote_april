import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { CommonService } from '../service/common.service';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss'],
  standalone: true,
  imports: [
    HttpClientModule,
    AgGridAngular,
    NgSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgIf
  ],
})
export class LeavesComponent {
  team2: any;
  companyId: any;
  leave_id: any;
  approve_id: any;
  leaveForm: FormGroup;
  requestForm: any;
  public userName: any;
  private apiUrl = environment.ApiUrl;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    due_date: new FormControl<Date | null>(null),
  });
  myLeaveRowData = [];

  // Column Definitions: Defines the columns to be displayed.
  myLeavecolDefs: ColDef[] = [
    { field: 'leave_type', headerName: 'Leave Type' },
    { field: 'leave_mode', headerName: 'Leave Mode' },
    { field: 'start_date', headerName: 'Start Date' },
    { field: 'end_date', headerName: 'End Date' },
    { field: 'total_day', headerName: 'Total Days' },
    { field: 'reason_for_leave', headerName: 'Reason' },
    {
      field: 'status',
      headerName: 'Status',
      cellClassRules: {
        leave_panding: (params) => params.value === 'Pending',
        leave_approve: (params) => params.value === 'Approve',
        leave_reject: (params) => params.value === 'Rejected',
      },
    },
    { field: 'approval_by', headerName: 'Approval By' },
    { field: 'approval_date', headerName: 'Approval Date' },
  ];

  // request table

  requestRowData = [];

  requestcolDefs: ColDef[] = [
    { field: 'leave_type', headerName: 'Leave Type' },
    { field: 'leave_mode', headerName: 'Leave Mode' },
    { field: 'start_date', headerName: 'Start Date' },
    { field: 'end_date', headerName: 'End Date' },
    { field: 'total_day', headerName: 'Total Days' },
    { field: 'reason_for_leave', headerName: 'Reason' },
    // { field: 'id', headerName: 'Leave ID' },
    {
      field: 'status',
      headerName: 'Status',
      cellRenderer: (params: any) => {
        const leaveId = params.data.id;
        this.leave_id = leaveId;

        const editPermission = params.data.userpermission?.edit !== 0;
        const deletePermission = params.data.userpermission?.delete !== 0;

        // Create a container div to hold the icons
        const container = document.createElement('div');
        container.className = 'd-flex align-items-center pt-2'; // Add some alignment styles if needed

        // Check and create the edit icon element if permission is allowed
        if (editPermission) {
          const editIcon = document.createElement('img');
          editIcon.src = '../../../assets/img/dashboard/Approved-img.png';
          editIcon.alt = 'Edit';
          editIcon.className = 'me-3'; // Bootstrap margin class
          editIcon.style.cursor = 'pointer'; // Add cursor pointer style
          editIcon.setAttribute('data-bs-toggle', 'modal');
          editIcon.setAttribute('data-bs-target', '#requestLeaveModal');

          // Add click event listener for edit action
          editIcon.addEventListener('click', () => {
            this.ngZone.run(() => {
              this.userLeaveData(leaveId);
              this.cdr.detectChanges();
            });
          });

          container.appendChild(editIcon); // Append to container
        }

        // Check and create the delete icon element if permission is allowed
        if (deletePermission) {
          const deleteIcon = document.createElement('img');
          deleteIcon.src = '../../../assets/img/dashboard/Reject-img.png';
          deleteIcon.alt = 'Delete';
          deleteIcon.style.cursor = 'pointer'; // Add cursor pointer style
          deleteIcon.setAttribute('data-bs-toggle', 'modal');
          deleteIcon.setAttribute('data-bs-target', '#requestLeaveModal');

          // Add click event listener for delete action
          deleteIcon.addEventListener('click', () => {
            this.userLeaveData(leaveId);
          });

          container.appendChild(deleteIcon); // Append to container
        }

        // Check if the container is empty, if so, add a placeholder or return null
        if (container.childElementCount === 0) {
          container.innerHTML = '<span>No Actions Available</span>';
        }

        return container; // Return the container with icons
      },
    },
    { field: 'approval_by', headerName: 'Approval By' },
    { field: 'approval_date', headerName: 'Approval Date' },
  ];

  public themeClass: string = 'ag-theme-quartz';
  pagination = true;
  paginationPageSize = 20;
  paginationPageSizeSelector = [20, 50, 100];
  defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };
  leaveApproval: any;
  isowner: any

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private elementRef: ElementRef,

  ) {
    this.companyId = localStorage.getItem('usercompanyId');
    this.isowner = localStorage.getItem('ownerChceck');
    this.leaveForm = this.fb.group({
      companyId: this.companyId,
      leave_type: ['', Validators.required],
      leave_mode: [false, Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      total_day: ['', Validators.required],
      reason_for_leave: ['', Validators.required],
      work_from_home: [''],
      file: [null],
    });
    this.requestForm = this.fb.group({
      companyId: this.companyId,
      leave_type: [''],
      leave_mode: [false],
      start_date: [''],
      end_date: [''],
      total_day: [''],
      reason_for_leave: [''],
      work_from_home: [false],
      file: [null],
    });
  }

  ngOnInit(): void {
    this.myLeaveData();
    this.requestDataList();
  }

  myLeaveData() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(
          `${this.apiUrl}leaveList?companyID=` +
            localStorage.getItem('usercompanyId'),
          { headers }
        )
        .subscribe(
          (leaveData: any) => {
            const myLeaveData = leaveData;
            const myLeaveDataList = leaveData?.data;
            this.myLeaveRowData = leaveData?.data;
          },
          (error) => {
            if (error.status === 401) {
              this.commonService.logout();
            }
            console.error('Error loading company list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  requestDataList() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(
          `${this.apiUrl}leaveList?companyID=` +
            localStorage.getItem('usercompanyId'),
          { headers }
        )
        .subscribe(
          (requestData: any) => {
            const myLeaveData = requestData;
            const myLeaveDataList = requestData?.data;
            this.requestRowData = requestData?.data;
          },
          (error) => {
            if (error.status === 401) {
              this.commonService.logout();
            }
            console.error('Error loading company list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  submitForm() {
    const formData = new FormData();
    formData.append('companyId', this.companyId || '');
    formData.append('leave_type', this.leaveForm.value.leave_type);
    formData.append('leave_mode', this.leaveForm.value.leave_mode);
    formData.append('start_date', this.leaveForm.value.start_date);
    formData.append('end_date', this.leaveForm.value.end_date);
    formData.append('total_day', this.leaveForm.value.total_day);
    formData.append('reason_for_leave', this.leaveForm.value.reason_for_leave);
    formData.append('work_from_home', this.leaveForm.value.work_from_home);

    if (this.leaveForm.invalid) {
      this.toastr.error('Please fill all required fields!', 'Validation Error');
      return;
    }
    const token = localStorage.getItem('tasklogintoken');
    const payload = this.leaveForm.value;
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .post(
          `${this.apiUrl}leaveAdd?companyID=` +
            localStorage.getItem('usercompanyId'),
          payload,
          { headers }
        )
        .subscribe(
          (leaveListData: any) => {
            const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_delete_project');
            if (elementToClick) {
              elementToClick.click();
            }
            this.leaveForm.reset();
            this.toastr.success('Task Added Successfully.');
            this.myLeaveData();
          },
          (error: any) => {
            if (error.status === 401) {
              // this.commonService.logout();
            }
            console.error('Error loading company list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  // request modal approve & panding
  userLeaveData(leaveId: any) {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      let get_id: any = this.requestRowData.find((item: any) => {
        return item.id == leaveId;
      });
      this.approve_id = get_id.id;

      this.http
        .get(`${this.apiUrl}leaveGet?leaveID=${this.approve_id}`, { headers })
        .subscribe(
          (userRequestData: any) => {
            const userLeaveDataList = userRequestData?.data;
            this.userName = userRequestData?.data?.userName;
            this.requestForm.patchValue({
              leave_type: userLeaveDataList.leave_type || '',
              leave_mode: userLeaveDataList.leave_mode || '',
              start_date: userLeaveDataList.start_date || '',
              end_date: userLeaveDataList.end_date || '',
              total_day: userLeaveDataList.total_day || '',
              reason_for_leave: userLeaveDataList.reason_for_leave || '',
              work_from_home: userLeaveDataList.work_from_home || '',
            });
          },
          (error) => {
            if (error.status === 401) {
              this.commonService.logout();
            }
            console.error('Error loading company list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  approveLeave() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      const payload = {
        leaveID: this.approve_id,
        status: 1,
      };
      this.http
        .post(`${this.apiUrl}leaveApproval`, payload, { headers })
        .subscribe(
          (responce: any) => {
            this.leaveApproval = responce?.data;
            this.toastr.success('Leave Approved');
            this.myLeaveData();
            this.requestDataList();
            console.log('leaveApprove', this.leaveApproval);
          },
          (error) => {
            if (error.status === 401) {
              this.commonService.logout();
            }
            console.error('Error loading company list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }
  rejectLeave() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      const payload = {
        leaveID: this.approve_id,
        status: 2,
      };
      this.http
        .post(`${this.apiUrl}leaveApproval`, payload, { headers })
        .subscribe(
          (responce: any) => {
            this.leaveApproval = responce?.data;
            this.toastr.error('Leave Rejected');
            this.myLeaveData();
            this.requestDataList();
            console.log('leaveApprove', this.leaveApproval.message);
          },
          (error) => {
            if (error.status === 401) {
              this.commonService.logout();
            }
            console.error('Error loading company list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }
}
