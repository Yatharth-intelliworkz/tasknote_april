import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  ElementRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {
  UntypedFormControl,
  FormControl,
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  NgModel,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonService } from '../service/common.service';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { MatListModule } from '@angular/material/list';

import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

interface ICountry {
  item_id: any;
  item_text: string;
  image: string;
  isDisabled?: boolean;
}

interface  IOlympicData {
  athlete: string,
  age: number,
  country: string,
  year: number,
  date: string,
  sport: string,
  gold: number,
  silver: number,
  bronze: number,
  total: number
}

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  standalone: true,
  imports: [
    NgbRatingModule,
    CalendarModule,
    MatIconModule,
    MatFormFieldModule,
    NgSwitch,
    NgSwitchCase,
    FormsModule,
    CdkDropList,
    CdkDrag,
    MatSlideToggleModule,
    RouterModule,
    ProjectOverviewComponent,
    NgFor,
    ReactiveFormsModule,
    MatSelectModule,
    NgMultiSelectDropDownModule,
    MatMenuModule,
    NgIf,
    MatListModule,
    AgGridAngular
  ],
})
export class ProjectListComponent {



// ag grid new table

public pincolumnDefs: ColDef[] = [
  { field: "description",
    cellRenderer: (params: any) => {
      return `<a class="table_link" href="/view-task/${params.data.task_id}">${params.value}</a>`;
    },
    headerName: "Task Name", },
  { valueGetter: (params) => {
    return params.data.memberData.map((member:any) => member.name).join(', ');
  },
  headerName: "Assignees" },
  { field: "created_at", headerName: "Created Date" },
  { field: "due_date", headerName: "Due Date" },
  { field: "status", headerName: "Status" },
  { field: "clientName", headerName: "Client Name" },
  { field: "projectName", headerName: "Project Name" },
];

public todaycolumnDefs: ColDef[] = [
  { field: "description",
    cellRenderer: (params: any) => {
      return `<a class="table_link" href="/view-task/${params.data.task_id}">${params.value}</a>`;
    },
    headerName: "Task Name", },
  { valueGetter: (params) => {
    return params.data.memberData.map((member:any) => member.name).join(', ');
  },
  headerName: "Assignees" },
  { field: "created_at", headerName: "Created Date" },
  { field: "due_date", headerName: "Due Date" },
  { field: "status", headerName: "Status" },
  { field: "clientName", headerName: "Client Name" },
  { field: "projectName", headerName: "Project Name" },
];

public overduecolumnDefs: ColDef[] = [
  { field: "description",
    cellRenderer: (params: any) => {
      return `<a class="table_link" href="/view-task/${params.data.task_id}">${params.value}</a>`;
    },
    headerName: "Task Name", },
  { valueGetter: (params) => {
    return params.data.memberData.map((member:any) => member.name).join(', ');
  },
  headerName: "Assignees" },
  { field: "created_at", headerName: "Created Date" },
  { field: "due_date", headerName: "Due Date" },
  { field: "status", headerName: "Status" },
  { field: "clientName", headerName: "Client Name" },
  { field: "projectName", headerName: "Project Name" },
];

public upComingcolumnDefs: ColDef[] = [
  { field: "description",
    cellRenderer: (params: any) => {
      return `<a class="table_link" href="/view-task/${params.data.task_id}">${params.value}</a>`;
    },
    headerName: "Task Name", },
  { valueGetter: (params) => {
    return params.data.memberData.map((member:any) => member.name).join(', ');
  },
  headerName: "Assignees" },
  { field: "created_at", headerName: "Created Date" },
  { field: "due_date", headerName: "Due Date" },
  { field: "status", headerName: "Status" },
  { field: "clientName", headerName: "Client Name" },
  { field: "projectName", headerName: "Project Name" },
];
public columnDefs: ColDef[] = [
  { field: "description",
    cellRenderer: (params: any) => {
      return `<a class="table_link" href="/view-task/${params.data.task_id}">${params.value}</a>`;
    },
    headerName: "Task Name", },
  { valueGetter: (params) => {
    return params.data.memberData.map((member:any) => member.name).join(', ');
  },
  headerName: "Assignees" },
  { field: "created_at", headerName: "Created Date" },
  { field: "due_date", headerName: "Due Date" },
  { field: "status", headerName: "Status" },
  { field: "clientName", headerName: "Client Name" },
  { field: "projectName", headerName: "Project Name" },
];

public pinRowData: any[] = [];
public todayRowData: any[] = [];
public overdueRowData: any[] = [];
public upComingRowData: any[] = [];
public completedRowData: any[] = [];

public defaultColDef: ColDef = {
  editable: true,
  filter: true,
};
public themeClass: string =
  "ag-theme-quartz";

  pagination = true;
 paginationPageSize = 20;
 paginationPageSizeSelector = [20, 50,100];

// ag grid new table





  currentRate = 0;
  // single date and multiple date  select

  displayMonths = 2;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';

  // single date and multiple date  select

  checkbox: boolean = false;

  bulkUpload() {
    this.checkbox = true;
  }
  hideBottomaction() {
    this.checkbox = !this.checkbox;
  }

  // priority dropdown

  selectedPriority: { image: string } = { image: '' };
  selectPriority(image: string): void {
    this.selectedPriority = { image };
  }

  // priority dropdown

  // status dropdown
  selectedStatus: string = '';

  selectStatus(status: string): void {
    this.selectedStatus = status;
  }

  // status dropdown

  selectOption(option: string, event: Event) {
    event.preventDefault(); // Prevent the default behavior of the dropdown toggle

    // Add your custom logic for handling the selected option here
    console.log(`Selected option: ${option}`);
  }

  taskListData: any;
  taskListAll: any;
  eventscal: any;
  data = [];
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
  }

  openStaticBackdrop(content: TemplateRef<any>) {
    this.offcanvasService.open(content, {
      backdrop: 'static',
      position: 'end',
    });
  }

  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: { ...colors['red'] },
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: { ...colors['yellow'] },
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: { ...colors['blue'] },
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: { ...colors['yellow'] },
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

  activeDayIsOpen: boolean = true;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors['red'],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  private apiUrl = environment.ApiUrl;
  public domainName = environment.domainName;
  // multiselect dd.\
  fileForm!: FormGroup;
  selectedTaskId: any;
  selectedItems2: ICountry[] = [];
  form: FormGroup;
  countries: Array<ICountry> = [];
  projectId: any;
  dropdownSettings2: any = {};
  projecttasklistData: any;

  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private offcanvasService: NgbOffcanvas,
    private commonService: CommonService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private elementRef: ElementRef
  ) {
    this.route.paramMap.subscribe((params) => {
      this.projectId = params.get('id');
      this.commonService.checkLoggedIn();
    });
    this.projectTaskList();
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
        item_id: 4,
        item_text: 'Yamini Patel',
        image: 'url_to_image3.jpg',
      },
    ];
  }

  ngOnInit() {
    this.commonService.checkLoggedIn();
    this.selectPriority('../../../assets/img/dashboard/flag-R.svg');
    this.getcalendertask();
  }

  projectTaskList() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}projectTaskList?projectID=` + this.projectId, {
          headers,
        })
        .subscribe(
          (noteslistData: any) => {
            this.projecttasklistData = noteslistData;
            this.taskListData = this.projecttasklistData?.data;
            this.pinRowData = this.taskListData.pinTaskData;
            this.todayRowData = this.taskListData.todayTaskData;
            this.overdueRowData = this.taskListData.overDueTaskData;
            this.upComingRowData = this.taskListData.upcomingTaskData;
            this.completedRowData = this.taskListData.completedTaskData;

            console.log('completedTaskData', this.taskListData.completedTaskData)
          },
          (error) => {}
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  gettaskList() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      const body = { companyID: localStorage.getItem('usercompanyId') };

      this.http.post(`${this.apiUrl}taskList`, body, { headers }).subscribe(
        (response: any) => {
          this.taskListData = response?.data;
        },
        (error) => {
          // Handle errors, for example, display an error message
          console.error('Error fetching task list:', error);
        }
      );
    } else {
      console.error('No token found in localStorage.');
    }
  }
  updatepinstatus(taskid: any, updatestatus: any) {
    const clickedValue = updatestatus;
    const taskId = taskid;
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const formData = new FormData();
      formData.append('taskID', taskId);
      formData.append('pin', clickedValue);

      this.http
        .post(`${this.apiUrl}taskPinUpdate`, formData, { headers })
        .subscribe(
          (response: any) => {
            setTimeout(() => {
              this.toastr.success('Task Pin Status Updated Successfully.');
            }, 10);
            this.gettaskList();
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        );
    }
  }
  getInitials(name: string): string {
    return name
      .split(' ')
      .map((name) => name.charAt(0))
      .join('');
  }

  taskPriorityUpdate(priority: any, taskid: any) {
    const clickedValue = priority;
    const taskId = taskid;
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const formData = new FormData();
      formData.append('taskID', taskId);
      formData.append('priority', clickedValue);

      this.http
        .post(`${this.apiUrl}taskPriorityUpdate`, formData, { headers })
        .subscribe(
          (response: any) => {
            setTimeout(() => {
              this.toastr.success('Task Priority Updated Successfully.');
            }, 10);
            this.gettaskList();
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        );
    }
  }

  deleteprojectsopendialogue(id: any) {
    this.selectedTaskId = id;
    const modal = document.getElementById('deleteprojectModal');
  }

  confirmDelete(): void {
    if (this.selectedTaskId) {
      this.deleteprojects(this.selectedTaskId);
    }
  }

  deleteprojects(id: any) {
    // this.loading = true; // Start loader
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const projectID = { taskID: id, completed: 1 };

      this.http
        .post(`${this.apiUrl}taskCompleted`, projectID, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick =
                this.elementRef.nativeElement.querySelector(
                  '.popup_close_btn_delete_project'
                );
              if (elementToClick) {
                elementToClick.click();
              }
              setTimeout(() => {
                this.toastr.success('Task Completed Successfully.');
              }, 10);
              this.gettaskList();
            }
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        );
      // .add(() => (this.loading = false));
    }
  }

  getcalendertask() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = this.commonService.getAuthHeaders(token);
      const body = this.commonService.getTaskRequestPayload();

      if (!body) {
        return;
      }

      this.http.post(`${this.apiUrl}taskListAll`, body, { headers }).subscribe(
        (response: any) => {
          this.taskListAll = response?.data;

          // Initialize eventscal as an empty array
          this.eventscal = [];

          // Populate eventscal with data from taskListAll
          this.eventscal = this.taskListAll.map((task: any) => ({
            start: subDays(new Date(task.created_at), 1),
            end: addDays(new Date(task.due_date), 1),
            title: task.title,
            color: { ...colors['red'] },
            actions: this.actions,
            allDay: true,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            draggable: false,
          }));

          // Refresh the events array when data is available
          this.events = [...this.eventscal];
        },
        (error) => {
          if (error.status === 401) {
            this.commonService.logout();
          }
          // Handle errors, for example, display an error message
          console.error('Error fetching task list:', error);
        }
      );
    } else {
      console.error('No token found in localStorage.');
    }
  }




}
