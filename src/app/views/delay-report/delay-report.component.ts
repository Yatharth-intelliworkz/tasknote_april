import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule,FormBuilder, FormGroup, Validators,  } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { NgIf, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../service/common.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-delay-report',
  templateUrl: './delay-report.component.html',
  styleUrls: ['./delay-report.component.scss'],
  standalone:true,
  imports:[RouterModule,NgIf,MatInputModule,MatDatepickerModule,AgGridAngular,NgSelectModule,FormsModule, ReactiveFormsModule]
})
export class DelayReportComponent {
  taskForm!: FormGroup;
  team1: any = [];
  private pushID = environment.pushID;
  private apiUrl = environment.ApiUrl;
  public columnDefs: ColDef[] = [
    {
      headerName: 'Task Title',
      field: 'title',
    },
    {
      headerName: 'Reason',
      field: 'reason',
    },
    {
      headerName: 'Updated Due Date',
      field: 'reason_date',
    },
    {
      headerName: 'Reason Date',
      field: 'dueDate',
    },
    
  ];
  public rowData: any[] = [];  

  public defaultColDef: ColDef = {
    editable: true,
    filter: true,
  };

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    due_date: new FormControl<Date | null>(null),
  });
  dropdownSettings2: { singleSelection: boolean; idField: string; textField: string; itemsShowLimit: number; selectAllText: string; unSelectAllText: string; allowSearchFilter: boolean; };
  comapnyId: string | null;
  memberlistData: any;
  rportdata: any;
  constructor(private offcanvasService: NgbOffcanvas,
    private commonService: CommonService,
    private http: HttpClient,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private notificationService: NotificationService
  ) {
    this.spinner.show();
    this.comapnyId = localStorage.getItem('usercompanyId');
    this.getmemberlist();
    this.dropdownSettings2 = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };
  }

  ngOnInit() {
    this.commonService.checkLoggedIn();
    this.taskForm = this.fb.group({
      userID: [null, Validators.required],
    
    });
  }

  onSubmit() {
    const information = this.taskForm.value;
    information.start = this.range.value.start;
    information.due_date = this.range.value.due_date;
    information.companyID = this.comapnyId;
    const token = localStorage.getItem('tasklogintoken');

    if (information.userID == '' || information.userID == null) {
      this.toastr.error('please select user');
      console.log('information', information, information.start, information.due_date);
      return
    }

    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .post(`${this.apiUrl}delayTaskReport`,
          information,
          { headers }
        )
        .subscribe(
          (response: any) => {
            this.rowData = response.data;
            if (response.status === true) {
              this.rowData = response.data;
              this.taskForm.reset();
              this.range.reset();
              this.spinner.hide();
            }
          },
          (error: any) => {
            this.spinner.hide();
            console.error('Error sending data', error);
          }
        );
    }
  }

  getmemberlist() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}comapnyMemberList?companyID=` + this.comapnyId, {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.spinner.hide();
            this.memberlistData = clientslistData;
            this.team1 = this.memberlistData.data.map((item: { id: any; name: any; }) => ({
              item_id: item.id,
              item_text: item.name,
            }));
          },
          (error) => {
            if (error.status === 401) {
              this.commonService.logout();
            }
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }
}
