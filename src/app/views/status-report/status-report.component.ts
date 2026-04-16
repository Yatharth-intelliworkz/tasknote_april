import { Component, TemplateRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonService } from '../service/common.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { BrowserModule } from '@angular/platform-browser';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { NotificationService } from '../service/notification.service';
import Pusher from 'pusher-js';
import { NgSelectModule } from '@ng-select/ng-select';
import { LOCALE_ID} from '@angular/core';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

interface Client {
  item_id: any;
  item_text: string;
}

interface CustomDataset {
  label: string;
  data: number[]; // Update this based on the type of your data
  backgroundColor: string;
  borderColor: string;
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];


export const DATE_FORMATS = {
  parse: {
      dateInput: 'DD/MM/YYYY',
  },
  display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-status-report',
  templateUrl: './status-report.component.html',
  styleUrls: ['./status-report.component.scss'],
  standalone: true,
  providers: [
    { provide: DateAdapter, useClass:MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
    { provide: LOCALE_ID, useValue: 'en-GB' }, 
],
  imports: [NgSelectModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, NgIf, NgFor, RouterModule, MatButtonModule, MatExpansionModule, MatIconModule,
    MatInputModule, MatDatepickerModule, MatNativeDateModule, MatTableModule, MatSortModule, MatPaginatorModule, CdkDropList, NgFor, CdkDrag, MatSlideToggleModule, MatTabsModule, NgMultiSelectDropDownModule, NgxPaginationModule],

})
export class StatusReportComponent {
  formGroup!: FormGroup; // Declare formGroup property
  submitForm!: FormGroup;
  commaSeparatedIDsusers!: string;
  commaSeparatedIDsstatus!: string;
  displayedColumns: string[] = ['priority', 'title', 'dueDate', 'completedDate', 'status', 'created_at', 'service', 'project', 'progress'];
  data = [];
  private pushID = environment.pushID;
  private apiUrl = environment.ApiUrl;
  memberlistData: any;
  memberlist: any;
  statuslistData: any;
  statuslist: any;
  chart: any = [];
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
  }
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatAccordion)
  accordion: MatAccordion = new MatAccordion;
  toppings = new FormControl('');

  toppingList: Array<Client> = [];
  toppingList1: Array<Client> = [];
  dropdownSettings2: any = {};
  statusname: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  comapnyId: any;
  formControlstatus!: FormControl;
  statusreportdata: any;
  statusreport: any;
  allNames: any;
  p: number = 1;
  public isPanelOpen: boolean = false;
  Isdisplay = 0;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    due_date: new FormControl<Date | null>(null),
  });

  constructor(private notificationService: NotificationService, private offcanvasService: NgbOffcanvas, private spinner: NgxSpinnerService, private commonService: CommonService, private http: HttpClient,
    private toastr: ToastrService, private fb: FormBuilder) {
    this.spinner.show();
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));
    this.dataSource = new MatTableDataSource(users);

    this.dropdownSettings2 = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 2,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };
    this.comapnyId = localStorage.getItem('usercompanyId');
  }
  ngOnInit() {
    
    this.commonService.checkLoggedIn();
    this.getmemberlist();
    this.submitForm = this.fb.group({
      userID: [''],
      statusID: [''],
    });
    this.loadStatusList();
    if(localStorage.getItem('userid') !== null){
    Pusher.logToConsole = false;    
    
    const pusher = new Pusher(`${this.pushID}`, {
      cluster: 'ap2'
    });

    const userId = parseInt(localStorage.getItem('userid') || '0', 10);
    let channel3 = pusher.subscribe(`pushnotification.${userId}`);

    channel3.bind('push-notification', (data: any) => {
      console.log('Push notification received:', data);
      if (userId === data.message?.userId || parseInt(data.message?.userId || '0' || '0', 10) === userId) {
        this.notificationService.pushNotify(data.message);
      }
    });
  }
  }


  // table pagination with search

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getmemberlist() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}clientList?companyID=` + this.comapnyId, {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.memberlistData = clientslistData;
            this.memberlist = this.memberlistData?.data;
            this.toppingList = this.memberlistData.data.map((item: { id: any; name: any; }) => ({
              item_id: item.id,
              item_text: item.name,
            }));
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
            if (error.status === 401) {
              this.commonService.logout();
            }
          }
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }

  exportexcel() {
    this.spinner.show();
    const workbook = XLSX.utils.book_new();

    // Format the data into a structure that can be easily processed
    const formattedData = this.formatData();

    // Add a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Convert buffer to blob
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a download link
    const url = window.URL.createObjectURL(blob);

    // Trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'status-report.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this.spinner.hide();
  }

  formatData(): any[] {
    const formattedData: any = [];
    this.statusreport.forEach((clientData: any) => {
      // Track whether we've added the client name
      let firstTask = true;
    
      // Loop through the taskList for each client
      clientData.taskList.forEach((task: any) => {
        // Add the task row
        formattedData.push({
          'Client Name': firstTask ? clientData.name : '',  // Show client name only once
          'Priority': task.priority || 'N/A',
          'Title': task.description || 'No Description',
          'Due date': task.due_date || 'No Due Date',
          'Completed Date': task.completedDate || 'Not Completed',
          'Status': task.status || 'No Status',
          'Service': task.service || 'No Service',
          'Project Name': task.projectName || 'No Project',
          'Total Track Time': task.totalTrackTime || '00:00',
          'Total Target Time': task.checkListTotalHours || '00:00',
          'Total Cost': task.userTotalHourCost || '0',
        });
    
        // Set the flag to false after adding the first task
        firstTask = false;
    
        // Loop through the checklist items for the task
        task.taskCheckListData.forEach((checklist: any) => {
          formattedData.push({
            'Client Name': '',  // No client name for checklist rows
            'Priority': '',     // No priority for checklist rows
            'Title': 'Checklist: ' + checklist.checklist_name,
            'Due date': '',     // No due date for checklist rows
            'Completed Date': '',  // No completed date for checklist rows
            'Status': '',       // No status for checklist rows
            'Service': checklist.checklist_document || 'No Document',
            'Project Name': task.projectName || 'No Project',
            'Checklist Time': checklist.checklistTime || '00:00',
            'Checklist Track Time': checklist.checklistTrackTime || '00:00',
            'Checklist Remark': checklist.checklist_remark || 'No Remark',
            'User Name': checklist.userName,  // No client name for checklist rows
            'Profit/Loss': this.calculateProfitOrLoss(checklist) || 'N/A',  // Assuming you calculate this
          });
        });
      });
    });

    return formattedData;
  }

   calculateProfitOrLoss(checklist: any): string {
    // Replace this with your actual calculation logic
    const timeInMinutes = this.convertTimeToMinutes(checklist.checklistTime);
    const trackTimeInMinutes = this.convertTimeToMinutes(checklist.checklistTrackTime);
  
    if (timeInMinutes > trackTimeInMinutes) {
      return 'Profit';
    } else if (timeInMinutes < trackTimeInMinutes) {
      return 'Loss';
    } else {
      return 'Break Even';
    }
  }
  
  // Helper Function to Convert Time (HH:mm) to Minutes
  convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  loadStatusList() {
      if(!localStorage.getItem('usercompanyId')) {
      console.log('Company ID is undefined.');
      return;
    }
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(`${this.apiUrl}statusList?companyID=` + this.comapnyId, { headers })
        .subscribe(
          (companylistData: any) => {
            this.statuslistData = companylistData;
            this.statuslist = companylistData?.data;
            this.toppingList1 = this.statuslistData.data.map((item: { id: any; status: any; }) => ({
              item_id: item.id,
              item_text: item.status,
            }));
          },
          (error) => {
            console.error('Error loading company list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }


  generatereport() {
    this.submitForm.value.start = this.range.value.start;
    this.submitForm.value.due_date = this.range.value.due_date;
     if(this.submitForm.value.userID == '' ||  this.submitForm.value.userID == null) {
      this.toastr.error('Please select partner');
      return
    }
    this.spinner.show();
    if (this.submitForm.value.userID) {
      const selectedUserIDs = this.submitForm.value.userID.join(',');
      this.commaSeparatedIDsusers = selectedUserIDs;
    }
    if (this.submitForm.value.statusID) {
      const selectedstatusIDIDs = this.submitForm.value.statusID;
      this.commaSeparatedIDsstatus = selectedstatusIDIDs.map((item: { item_id: number, item_text: string }) => item.item_id).join(',');
    }

    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      const formData = new FormData();
      // formData.append('statusID', this.commaSeparatedIDsstatus);
      formData.append('clientId', this.commaSeparatedIDsusers);
      formData.append('companyID', this.comapnyId);
      formData.append('start', this.submitForm.value.start);
      formData.append('due_date', this.submitForm.value.due_date);
      this.http
        .post(`${this.apiUrl}clientReport`, formData, { headers })
        .subscribe(
          (companylistData: any) => {
            this.statusreportdata = companylistData;
            this.statusreport = companylistData?.data;
            this.spinner.hide();
            this.Isdisplay = 1;
            this.isPanelOpen = true;
            // this.allNames = this.statusreport.userStatusReport.map((item: { name: any; }) => `${item.name}`);
            // this.statusname = this.statusreport.statusTsakReport.map((item: { status: any; }) => `${item.status}`);
            // this.generatechart();
            this.submitForm.reset();
            this.range.reset();
            this.spinner.hide();
           
            
          },
          (error) => {
            this.spinner.hide();
            console.error('Error loading company list:', error);
          }
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }




  // Assume you have a function to get background color based on status
  getBackgroundColorForStatus(status: string): string {
    // Implement your logic here
    // For example, assuming you have a predefined mapping
    const colorMapping: { [key: string]: string } = {
      'Closed': '#8BD878',
      'Pending': '#FF9292',
      'Rejected': '#F5A1F5',
      'Under Review': '#FFDB77',
    };

    return colorMapping[status] || '#000000'; // Default color or handle other cases
  }



  generatechart() {
    if (this.chart.length !== 0) {
      // If it exists, destroy the chart
      this.chart.destroy();
    }

    const originalData = this.statusreport.userStatusReport;
    const uniqueStatusTypes = [...new Set(originalData.flatMap((person: { allData: { status: string }[] }) => person.allData.map((status: { status: string }) => status.status)))];


    const transformedData: CustomDataset[] = uniqueStatusTypes.map(statusType => {
      return {
        label: statusType as string, // Cast statusType to string
        data: originalData.map((person: { allData: { status: string, totalTask: number }[] }) => {
          const statusData = person.allData.find((status: { status: string }) => status.status === statusType);
          return statusData ? statusData.totalTask : 0;
        }),
        backgroundColor: this.getBackgroundColorForStatus(statusType as string),
        borderColor: this.getBackgroundColorForStatus(statusType as string),
      };
    });

    this.chart = new Chart('status', {
      type: 'line',
      data: {
        labels: this.allNames,
        datasets: transformedData, // Pass the array of datasets
      },
      options: {
        aspectRatio: 3,
        responsive: true,
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              boxWidth: 7,
              boxHeight: 7,
            },
            onClick: () => { }, // Disable click on legend labels
          },
        },
        indexAxis: 'x',
        scales: {
          x: {
            stacked: true,
          },
          y: {
            beginAtZero: true,
            stacked: true,
          }
        },
      },
    });

  }

  openStaticBackdrop(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { backdrop: 'static', position: 'end' });
  }

}
/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
  };
}

