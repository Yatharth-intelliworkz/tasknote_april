import { Component, TemplateRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgCircleProgressModule } from 'ng-circle-progress';
import * as XLSX from 'xlsx';
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
  selector: 'app-project-report',
  templateUrl: './project-report.component.html',
  styleUrls: ['./project-report.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, NgIf, NgFor, RouterModule, MatButtonModule, MatExpansionModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatDatepickerModule, MatNativeDateModule, MatTableModule, MatSortModule, MatPaginatorModule, CdkDropList, NgFor, CdkDrag, MatSlideToggleModule, MatTabsModule, NgCircleProgressModule],
})
export class ProjectReportComponent {
  private pushID = environment.pushID;
  private apiUrl = environment.ApiUrl;

  title = 'ng-chart';
  chart: any = [];
  projectsreport: any;
  projectsreportData: any;
  projectsreporttask: any;
  projectsreportDatatask: any;
  comapnyId: any;
  companyID: any;
  public isPanelOpen: boolean = false;
  Isdisplay = 0;

  ngOnInit() {
    this.commonService.checkLoggedIn();
    this.loadProjectsReport();

    this.chart = new Chart('performance', {
      type: 'pie',
      data: {
        labels: ['Mital Gandhi'],
        datasets: [
          {
            label: 'Close Task',
            data: [12],
            backgroundColor: "#8BD878",
            borderRadius: 5,
          },
        ],
      },
      options: {
        aspectRatio: 2,
      },
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
  displayedColumns: string[] = ['projectName', 'clientName', 'startDate', 'endDate'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatAccordion)
  accordion: MatAccordion = new MatAccordion;
  toppings = new FormControl('');
  toppingList: string[] = ['user', 'admin', 'manager', 'main manager',];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;


  constructor(private notificationService: NotificationService, private offcanvasService: NgbOffcanvas, private spinner: NgxSpinnerService, private commonService: CommonService, private http: HttpClient, private fb: FormBuilder,) {
    this.spinner.show();
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));
    this.comapnyId = localStorage.getItem('usercompanyId');
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }

  openStaticBackdrop(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { backdrop: 'static', position: 'end' });
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

  generatereport(id: any) {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(`${this.apiUrl}projectByTaskList?projectID=${id}`, { headers })
        .subscribe(
          (projectsreportData: any) => {
            // Handle the response data appropriately
            this.projectsreportDatatask = projectsreportData;
            this.projectsreporttask = this.projectsreportDatatask?.data;
            // console.log(this.projectsreporttask);
            
            this.isPanelOpen = true;
            this.exportexcel();
            this.Isdisplay = 1;
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
            if (error.status === 401) {
              this.commonService.logout();
            }
            // Handle errors appropriately
            console.error('Error loading projects list:', error);
          }
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }
  loadProjectsReport() {
    const token = localStorage.getItem('tasklogintoken');

    const information: any = {};
    information.companyID = this.comapnyId;


    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .post(`${this.apiUrl}projectReport`, information, { headers })
        .subscribe(
          (projectsreportData: any) => {
            // Handle the response data appropriately
            this.projectsreportData = projectsreportData;
            this.projectsreport = projectsreportData?.data;
            this.isPanelOpen = true;

            this.Isdisplay = 1;
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
            if (error.status === 401) {
              this.commonService.logout();
            }
            // Handle errors appropriately
            console.error('Error loading projects list:', error);
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
    a.download = 'project-report.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this.spinner.hide();
  }

  formatData(): any[] {
    const formattedData: any[] = [];
  
    this.projectsreporttask.forEach((clientData: any) => {
      // Track whether we've added the client name
      let firstTask = true; 
    
      // Loop through the tasks for each client
      clientData.tasks.forEach((task: any) => {
        // Add the task row
        formattedData.push({
          'Client Name': firstTask ? clientData.client_name : '',  // Show client name only once
          'Priority': task.priority || 'N/A',
          'Title': task.description || 'No Description',
          'Due date': task.due_date || 'No Due Date',
          'Completed Date': task.completedDate || 'Not Completed',
          'Status': task.status || 'No Status',
          'Service': task.service || 'No Service',
          'Project Name': task.projectName || 'No Project',
          'Total Track Time': task.totalTrackTime,
          'Total Target Time': task.checkListTotalHours,
          'Total Cost': task.userTotalHourCost,
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
            'Profit/Loss': checklist.profitOrLoss || 'N/A',
          });
        });
      });
    });
    
    
    

    return formattedData;
  }


}


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
