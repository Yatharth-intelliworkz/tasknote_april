import { Component, ElementRef, Renderer2 } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { environment } from '../../../../src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../service/common.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from '../service/excel.service';
import {
  Module,
  ModuleRegistry,
  RowGroupingDisplayType,
} from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
ModuleRegistry.registerModules([ClientSideRowModelModule, RowGroupingModule]);
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx'; // Import xlsx library
import { DateAdapter } from '@angular/material/core';

interface Checklist {
  checkId: any;
  checklistName: string;
  completed: number;
}

interface Task {
  taskId: any;
  description: string;
  completed: number;
  CheckList: Checklist[];
  isExpanded: boolean; // Add isExpanded to each task
}

interface Client {
  clientId: any;
  clientName: string;
  taskList: Task[];
  isExpanded: boolean; // Add isExpanded to each client
}
@Component({
  selector: 'app-partner-report',
  templateUrl: './partner-report.component.html',
  styleUrls: ['./partner-report.component.scss'],
  standalone: true,
  imports: [
    AgGridAngular,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    RouterModule,
    CommonModule,
  ],
})
export class PartnerReportComponent {
  private apiUrl = environment.ApiUrl;
  clientslistData: any;
  companyId: any;
  public groupDisplayType: RowGroupingDisplayType = 'singleColumn';
  isExpanded: false = false;
  flattenedRowData: any;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private commonService: CommonService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService,
    private dateAdapter: DateAdapter<Date>
  ) {}

  Isdisplay = 0;
  currentSort: string = '';
  isDescending: boolean = false;
  formGroup!: FormGroup;
  clients: any[] = [];
  submitForm!: FormGroup;
  projectsreportData: any;
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    due_date: new FormControl<Date | null>(null),
  });
  ngOnInit(): void {
    this.companyId = localStorage.getItem('usercompanyId');
    this.clientPartnerList();
    this.submitForm = this.fb.group({
      userID: [''],
      start: [''],
      due_date: [''],
    });
  }
  toggleClient(client: any) {
    client.isExpanded = !client.isExpanded;
  }

  // Toggle the task expansion
  toggleTask(task: any) {
    task.isExpanded = !task.isExpanded;
  }

  clientPartnerList() {
    this.spinner.show();
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}clientPartnerList?companyID=` + this.companyId, {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.clientslistData = clientslistData.data;

            this.spinner.hide();
          },
          (error) => {}
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }
  generatereport() {
    const information = { ...this.submitForm.value };
    const partnerID = this.submitForm?.value?.userID[0] || null;
    console.log('this.submitForm.value.userID',partnerID);
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

    if (partnerID =='' || partnerID === null ) {
      this.toastr.error('Please select partner');
      return;
    }

    console.log('first', this.submitForm);

    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      // this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const payload = {
        companyID: this.companyId,
        partnerID,
        information: information,
      };

      this.http
        .post(`${this.apiUrl}partnerByReport`, payload, { headers })
        .subscribe(
          (projectsreportData: any) => {
            projectsreportData.data.forEach((client: any) => {
              client.isExpanded = false; // Initialize isExpanded for each client

              client.taskList.forEach((task: any) => {
                task.isExpanded = false; // Initialize isExpanded for each task

                task.CheckList.forEach((check: any) => {
                  // No need to add isExpanded to checklist, it's handled in task expansion
                });
              });
            });
            // Set the clients data
            this.clients = projectsreportData.data;
            this.Isdisplay = 1;
            this.submitForm.reset();
            this.range.reset();
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

  sortData(column: string): void {
    if (this.currentSort === column) {
      this.isDescending = !this.isDescending;
    } else {
      this.currentSort = column;
      this.isDescending = false;
    }

    this.clients.sort((a: any, b: any) => {
      const valueA = this.getValue(a, column);
      const valueB = this.getValue(b, column);

      if (valueA < valueB) return this.isDescending ? 1 : -1;
      if (valueA > valueB) return this.isDescending ? -1 : 1;
      return 0;
    });
  }

  getValue(item: any, column: string): any {
    switch (column) {
      case 'clientName':
        return item.clientName;
      case 'description':
        return item.taskList?.[0]?.description || '';
      case 'checklistName':
        return item.taskList?.[0]?.CheckList?.[0]?.checklistName || '';
      case 'taskCompleted':
        return item.taskList?.[0]?.completed ? 1 : 0;
      case 'checklistCompleted':
        return item.taskList?.[0]?.CheckList?.[0]?.completed ? 1 : 0;
      default:
        return '';
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
    a.download = 'Partner-report.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  formatData(): any[] {
    const formattedData: any = [];
    this.clients.forEach((clientData: any) => {
      // Track whether we've added the client name
      let firstTask = true;

      // Loop through the taskList for each client
      clientData.taskList.forEach((task: any) => {
        // Add the task row
        formattedData.push({
          'Client Name': firstTask ? clientData.clientName : '', // Show client name only once
          Title: task.description || 'No Description',
        });

        // Set the flag to false after adding the first task
        firstTask = false;

        // Loop through the checklist items for the task
        task.CheckList.forEach((checklist: any) => {
          formattedData.push({
            'Client Name': '', // No client name for checklist rows
            Title: 'Checklist: ' + checklist.checklistName,
            'Checklist Completed': checklist.completed == 1 ? 'Yes' : 'No', // No client name for checklist rows
            'Task Completed': task.completed == 1 ? 'Yes' : 'No', // No client name for checklist rows
          });
        });
      });
    });

    return formattedData;
  }
}
