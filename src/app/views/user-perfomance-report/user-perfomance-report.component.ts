import {
  Component,
  TemplateRef,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonService } from '../service/common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx'; // Import xlsx library
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { NotificationService } from '../service/notification.service';
import Pusher from 'pusher-js';
import { NgSelectModule } from '@ng-select/ng-select';
import { LOCALE_ID } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ToastrService } from 'ngx-toastr';

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
  selector: 'app-user-perfomance-report',
  templateUrl: './user-perfomance-report.component.html',
  styleUrls: ['./user-perfomance-report.component.scss'],
  standalone: true,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
    { provide: LOCALE_ID, useValue: 'en-GB' },
  ],
  imports: [
    NgSelectModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    RouterModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CdkDropList,
    NgFor,
    CdkDrag,
    MatSlideToggleModule,
    MatTabsModule,
    NgMultiSelectDropDownModule,
    NgxPaginationModule,
  ],
})
export class UserPerfomanceReportComponent {
  private pushID = environment.pushID;
  private apiUrl = environment.ApiUrl;
  title = 'ng-chart';
  chart: any = [];

  data = [];
  projectslist: any;
  projectslistData: any;
  memberlistData: any;
  team1: any;
  team2: any;
  statuslistData: any;
  statuslist: any;
  comapnyId: any;
  userperformanceForm!: FormGroup;
  commaSeparatedIDsusers!: string;
  commaSeparatedIDsstatus!: string;
  commaSeparatedIDsproject!: string;
  reportchart: any;
  public reportchartd: any = '';
  toppingList1: Array<Client> = [];
  allNames: any;
  performanceOnTrack: any;
  performanceBeforeTime: any;
  performanceDelayed: any;
  p: number = 1;
  public isPanelOpen: boolean = false;
  Isdisplay = 0;
  reportchartmemberdata: any;
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    due_date: new FormControl<Date | null>(null),
  });

  dropdownSettings1: any;
  dropdownSettings2: any;

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
  }

  displayedColumns: string[] = [
    'name',
    'totalUserTask',
    'incompletUserTask',
    'completUserTask',
    'taskCompletionRatio',
    'performanceOnTrack',
    'performanceBeforeTime',
    'performanceDelayed',
  ];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatAccordion)
  accordion: MatAccordion = new MatAccordion();

  toppings = new FormControl('');

  toppingList: string[] = ['user', 'admin', 'manager', 'main manager'];
  userTypeList: string[] = ['Owner', 'Assignee'];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private notificationService: NotificationService,
    private offcanvasService: NgbOffcanvas,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private http: HttpClient,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.spinner.show();
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));
    this.comapnyId = localStorage.getItem('usercompanyId');

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
    this.dropdownSettings1 = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.dropdownSettings2 = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 2,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };
  }

  ngOnInit() {
    this.commonService.checkLoggedIn();
    this.getmemberlist();

    this.userperformanceForm = this.fb.group({
      // Define your form controls here
      usertype: ['', Validators.required],
      userID: ['', Validators.required],
      projectID: ['', Validators.required],
      start: [null, Validators.required],
      due_date: [null, Validators.required],
      // Add other form controls as needed
    });
    if (localStorage.getItem('userid') !== null) {
      Pusher.logToConsole = false;

      const pusher = new Pusher(`${this.pushID}`, {
        cluster: 'ap2',
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
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Convert buffer to blob
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Create a download link
    const url = window.URL.createObjectURL(blob);

    // Trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user-perfomance-report.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this.spinner.hide();
  }
  formatData(): any[] {
    const formattedData: any[] = [];

    this.reportchartmemberdata.forEach((clientData: any) => {
      let firstTask = true;

      // Loop through taskList for each client
      clientData.taskListData.forEach((task: any) => {
        // Add the task row
        formattedData.push({
          'Task Completion Ratio': firstTask
            ? clientData.taskCompletionRatio || '0%'
            : '', // Show only once
          'Performance On Track': firstTask
            ? clientData.performanceOnTrack || '0%'
            : '',
          'Performance Before Time': firstTask
            ? clientData.performanceBeforeTime || '0%'
            : '',
          'Performance Delayed': firstTask
            ? clientData.performanceDelayed || '0%'
            : '',
          'Complete User Task': firstTask
            ? clientData.completUserTask || 0
            : '',
          'Incomplete User Task': firstTask
            ? clientData.incompletUserTask || 0
            : '',
          'Total User Task': firstTask ? clientData.totalUserTask || 0 : '',
          'Client Name': firstTask ? task.clientName : '', // Show client name only once
          Priority: task.priority || 'N/A',
          Title: task.description || 'No Description',
          'Due date': task.due_date || 'No Due Date',
          'Completed Date': task.completedDate || 'Not Completed',
          Status: task.status || 'No Status',
          Service: task.service || 'No Service',
          'Project Name': task.projectName || 'No Project',
          'Total Track Time': task.totalTrackTime || '00:00',
          'Total Target Time': task.checkListTotalHours || '00:00',
          'Total Cost': task.userTotalHourCost || '0',
        });

        firstTask = false; // Client name should only appear on the first row

        // Loop through taskCheckListData for each task
        task.taskCheckListData.forEach((checklist: any) => {
          formattedData.push({
            'Task Completion Ratio': '', // Leave blank for checklist rows
            'Performance On Track': '',
            'Performance Before Time': '',
            'Performance Delayed': '',
            'Complete User Task': '',
            'Incomplete User Task': '',
            'Total User Task': '',
            'Client Name': '', // No client name for checklist rows
            Priority: '', // No priority for checklist rows
            Title:
              'Checklist: ' + checklist.checklist_name || 'Unnamed Checklist',
            'Due date': '', // No due date for checklist rows
            'Completed Date': '', // No completed date for checklist rows
            Status: '', // No status for checklist rows
            Service: checklist.checklist_document || 'No Document',
            'Project Name': task.projectName || 'No Project',
            'Checklist Time': checklist.checklistTime || '00:00',
            'Checklist Track Time': checklist.checklistTrackTime || '00:00',
            'Checklist Remark': checklist.checklist_remark || 'No Remark',
            'User Name': checklist.userName || 'Unknown User',
            'Profit/Loss': this.calculateProfitOrLoss(checklist) || 'N/A', // Custom calculation
          });
        });
      });
    });

    return formattedData;
  }

  // Example Profit/Loss Calculation
  calculateProfitOrLoss(checklist: any): string {
    // Replace this with your actual calculation logic
    const timeInMinutes = this.convertTimeToMinutes(checklist.checklistTime);
    const trackTimeInMinutes = this.convertTimeToMinutes(
      checklist.checklistTrackTime
    );

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
  openStaticBackdrop(content: TemplateRef<any>) {
    this.offcanvasService.open(content, {
      backdrop: 'static',
      position: 'end',
    });
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
        .get(`${this.apiUrl}comapnyMemberList?companyID=` + this.comapnyId, {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.spinner.hide();
            this.memberlistData = clientslistData;
            this.team1 = this.memberlistData.data.map(
              (item: { id: any; name: any }) => ({
                item_id: item.id,
                item_text: item.name,
              })
            );
          },
          (error) => {}
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  onSubmit() {
    const information = { ...this.userperformanceForm.value };

    information.start = this.range.get('start')?.value
      ? this.dateAdapter.format(
          this.range.get('start')?.value as Date,
          'YYYY-MM-DD'
        )
      : information.start;
    information.due_date = this.range.get('due_date')?.value
      ? this.dateAdapter.format(
          this.range.get('due_date')?.value as Date,
          'YYYY-MM-DD'
        )
      : information.due_date;
    information.companyID = this.comapnyId;
    if (!Array.isArray(information.userID)) {
      information.userID = [information.userID]; // Wrap in array if it's a single value
    }
    const selectedUserIDs = information.userID.join(',');
    this.commaSeparatedIDsusers = selectedUserIDs;
    information.userID = this.commaSeparatedIDsusers;
    const token = localStorage.getItem('tasklogintoken');

    if (information.userID === '') {
      this.toastr.error('Please select user');
      this.spinner.hide();
      return;
    }

    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .post(`${this.apiUrl}userPerformanceReport`, information, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              this.reportchart = response.data;
              this.reportchartmemberdata = response.data;
              this.reportchartd = 'data_loaded';
              this.isPanelOpen = true;
              this.Isdisplay = 1;
              this.userperformanceForm.reset();
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

  chartreport() {
    if (this.chart.length !== 0) {
      // If it exists, destroy the chart
      this.chart.destroy();
    }
    // Use the collected data
    const originalData = this.reportchart.userStatusReport;

    this.chart = new Chart('performance', {
      type: 'line',
      data: {
        labels: this.allNames,
        datasets: [
          {
            label: 'On Track',
            data: this.performanceOnTrack,
            borderWidth: 1,
            backgroundColor: 'rgb(22, 185, 117)', // Fill color under the line
            pointBackgroundColor: 'rgb(22, 185, 117)', // Point color
            pointBorderColor: 'rgb(22, 185, 117)', // Point border color
            pointRadius: 4, // Size of the point
            pointHoverRadius: 6, // Size of the point on hover
            pointHitRadius: 10, // Sensitivity to mouse events on the point
            pointStyle: 'circle', // Shape of the point
          },
          {
            label: 'Before Time',
            data: this.performanceBeforeTime,
            pointBackgroundColor: 'rgb(250, 178, 34)',
            pointBorderColor: 'rgb(250, 178, 34)',
            pointRadius: 4,
            pointHoverRadius: 6,
            pointHitRadius: 10,
            pointStyle: 'circle',
            backgroundColor: 'rgb(250, 178, 34)',
          },
          {
            label: 'Delayed',
            data: this.performanceDelayed,
            pointBackgroundColor: 'rgb(220, 53, 53)',
            pointBorderColor: 'rgb(220, 53, 53)',
            pointRadius: 4,
            pointHoverRadius: 6,
            pointHitRadius: 10,
            pointStyle: 'circle',
            backgroundColor: 'rgb(220, 53, 53)',
          },
        ],
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
            onClick: () => {}, // Disable click on legend labels
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
          },
        },
      },
    });
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
