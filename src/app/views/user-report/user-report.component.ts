import { Component, TemplateRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import Chart from 'chart.js/auto';
import { CommonService } from '../service/common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UntypedFormControl, FormBuilder, FormGroup, NgModel, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import * as XLSX from 'xlsx'; // Import xlsx library
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../service/notification.service';
import Pusher from 'pusher-js';

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



@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, NgIf, NgFor, RouterModule, MatButtonModule, MatExpansionModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatDatepickerModule, MatNativeDateModule, MatTableModule, MatSortModule, MatPaginatorModule, CdkDropList, NgFor, CdkDrag, MatSlideToggleModule, MatTabsModule, NgMultiSelectDropDownModule, NgxPaginationModule],
})
export class UserReportComponent {
  private pushID = environment.pushID;
  private apiUrl = environment.ApiUrl;
  title = 'ng-chart';
  chart: any = [];
  projectslist: any;
  projectslistData: any;
  memberlistData: any;
  team1: any;
  statuslistData: any;
  statuslist: any;
  comapnyId: any;
  taskForm!: FormGroup;
  commaSeparatedIDsusers!: string;
  commaSeparatedIDsstatus!: string;
  reportchart: any;
  public reportchartd: any = '';
  toppingList1: Array<Client> = [];
  allNames: any;
  statusname: any;
  displayedColumns: string[] = ['priority', 'title', 'dueDate', 'completedDate', 'status', 'creator', 'created_at', 'service', 'client', 'project', 'progress'];
  p: number = 1;
  public isPanelOpen: boolean = false;
  Isdisplay = 0;



  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    due_date: new FormControl<Date | null>(null),
  });

  dropdownSettings2: any;

  constructor(private offcanvasService: NgbOffcanvas,
    private commonService: CommonService,
    private http: HttpClient,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private notificationService: NotificationService
  ) {
    this.spinner.show();
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));
    this.dataSource = new MatTableDataSource(users);
    this.comapnyId = localStorage.getItem('usercompanyId');

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
    this.loadProjectsList();
    this.getmemberlist();
    this.statusList();
    this.dataSource = new MatTableDataSource<any>(this.reportchart); // Replace 'any' with your data type

    // Set up paginator
    this.dataSource.paginator = this.paginator;

    this.taskForm = this.fb.group({
      usertype: ['', Validators.required],
      userID: ['', Validators.required],
      statusID: ['', Validators.required],
    });

    if (localStorage.getItem('userid') !== null) {
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

  loadProjectsList() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(`${this.apiUrl}taskProjectList?companyID=` + this.comapnyId, { headers })
        .subscribe(
          (projectslistData: any) => {
            this.spinner.hide();
            // Handle the response data appropriately
            this.projectslistData = projectslistData;
            this.projectslist = projectslistData?.data;
          },
          (error) => {
            if (error.status === 401) {
              this.commonService.logout();
            }
            // Handle errors appropriately
            console.error('Error loading projects list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
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

  statusList() {
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

  onSubmit() {
    const information = this.taskForm.value;
    if (information.userID == '' || information.statusID == '') {
      this.toastr.error('please select user and status');
      return
    }
    information.start = this.range.value.start;
    information.due_date = this.range.value.due_date;
    information.companyID = this.comapnyId;

    const selectedUserIDs = information.userID;
    this.commaSeparatedIDsusers = selectedUserIDs.map((item: { item_id: number, item_text: string }) => item.item_id).join(',');
    information.userID = this.commaSeparatedIDsusers;


    const selectedstatusIDIDs = information.statusID;
    this.commaSeparatedIDsstatus = selectedstatusIDIDs.map((item: { item_id: number, item_text: string }) => item.item_id).join(',');
    information.statusID = this.commaSeparatedIDsstatus;

    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .post(`${this.apiUrl}userReport`,
          information,
          { headers }
        )
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              this.reportchart = response.data;
              this.reportchartd = 'data_loaded';
              this.allNames = this.reportchart.userStatusReport.map((item: { name: any; }) => `${item.name}`);
              this.statusname = this.reportchart.userStatusReport.map((item: { status: any; }) => `${item.status}`);
              this.chartreport();
              // this.taskForm.reset();
              this.isPanelOpen = true;
              this.Isdisplay = 1;
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

  exportexcel() {
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
    a.download = 'user-report.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  formatData(): any[] {
    const formattedData: any = [];
    this.reportchart.userTsakReport.forEach((user: { name: any; totalUserTask: any; totalLowPriorityTask: any; totalHighPriorityTask: any; totalMediumPriorityTask: any; taskList: any[]; }) => {
      formattedData.push({
        Name: user.name,
        TotalUserTask: user.totalUserTask,
        TotalLowPriorityTask: user.totalLowPriorityTask,
        TotalHighPriorityTask: user.totalHighPriorityTask,
        TotalMediumPriorityTask: user.totalMediumPriorityTask
      });
      user.taskList.forEach(task => {
        let priority: string;
        if (task.priority === 1) {
          priority = 'High';
        } else if (task.priority === 2) {
          priority = 'Medium';
        } else {
          priority = 'Low';
        }

        formattedData.push({
          Priority: priority,
          Title: task.title,
          DueDate: task.dueDate,
          CompletedTaskDate: task.completedDate,
          Status: task.status,
          TaskCreator: task.creator,
          CreatedAt: task.created_at,
          Service: task.service,
          Client: task.client,
          Project: task.project,
          Performance: task.progress,
        });
      });

    });
    return formattedData;
  }
  getBackgroundColorForStatus(status: string): string {
    // Implement your logic here
    // For example, assuming you have a predefined mapping
    const colorMapping: { [key: string]: string } = {
      'Closed': '#8BD878',
      'Pending': '#FF9292',
      'Rejected': '#F5A1F5',
      'Under Review': '#FFDB77',
      'process': '#2e9f12',
      'New Task': '#f00'
    };

    return colorMapping[status] || '#000000'; // Default color or handle other cases
  }

  chartreport() {

    // Check if the chart instance already exists
    if (this.chart.length !== 0) {
      // If it exists, destroy the chart
      this.chart.destroy();
    }


    const originalData = this.reportchart.userStatusReport;
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

    this.chart = new Chart('performance', {
      type: 'line',
      data: {
        labels: this.allNames,
        datasets: transformedData
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




  // chart end


  data = [];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
  }


  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatAccordion)
  accordion: MatAccordion = new MatAccordion;

  toppings = new FormControl('');

  toppingList: string[] = ['user', 'admin', 'manager', 'main manager',];
  userTypeList: string[] = ['Owner', 'Assignee'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;


  openStaticBackdrop(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { backdrop: 'static', position: 'end' });
  }

  // table pagination with search

  ngAfterViewInit() {
    this.reportchart.userTsakReport.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
