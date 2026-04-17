import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  NgModule,
  NgModuleRef,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  HostListener,
} from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import {
  UntypedFormControl,
  FormControl,
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  NgModel,
  Validators,
  FormArray,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgFor, NgForOf, NgIf, NgStyle } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormModule } from '@coreui/angular';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../src/environments/environment';
import { CommonService } from '../service/common.service';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule, DatePipe } from '@angular/common';
import * as RecordRTC from 'recordrtc';
declare var $: any;
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { DateAdapter } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';

import { ChangeDetectorRef } from '@angular/core';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { tr } from 'date-fns/locale';
import { event } from 'jquery';
import { NgSelectModule } from '@ng-select/ng-select';
const moment = _rollupMoment || _moment;
import {CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';




// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

interface ICountry {
  item_id: any;
  item_text: string;
  image: string;
  isDisabled?: boolean;
}

interface Client {
  id: any;
  name: string;
  item_id: any;
  item_text: string;
  item_time: any;
  item_cost: any;
}
interface Projectids {
  id: any;
  name: string;
  item_id: any;
  item_text: string;
  item_time: any;
  item_cost: any;
}

interface StatusItem {
  id: number;
  status: string;
  code: string;
  is_action: number;
  is_active: number;
}

@Component({
  selector: 'app-crete-new-task',
  templateUrl: './crete-new-task.component.html',
  styleUrls: ['./crete-new-task.component.scss'],
  standalone: true,
  imports: [
    CdkDropList, CdkDrag,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgIf,
    FormModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    NgForOf,
    NgMultiSelectDropDownModule,
    NgStyle,
    MatDividerModule,
    MatChipsModule,
    FormsModule,
    MatMenuModule,
    NgFor,
    CommonModule,
    DatePipe,
    NgSelectModule,
  ],
  // encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreteNewTaskComponent implements OnInit {
    // Date filter to disable past dates
    dateFilter = (d: Date | null): boolean => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d ? d >= today : false;
    };
  // nikunj changes 28-12 subtask & checklist
  @ViewChild('subTaskdata', { static: true }) subTaskdata!: ElementRef;
  @ViewChild('listsubTask', { static: true }) listsubTask!: ElementRef;
  @ViewChild('checklistData', { static: true }) checklistData!: ElementRef;
  @ViewChild('listChecklistData', { static: true })
  listChecklistData!: ElementRef;
  // nikunj changes 28-12 subtask & checklist
  // @HostListener('document:click', ['$event'])

  // new dropdown

  // new dropdown

  // priority dropdown
  selectedPriority: { image: string } = { image: '' }; // initialize with the default status
  formData = new FormData();
  img: any = '../../../assets/img/dashboard/flag-G.svg';
  sub_priority: any;
  selectedImages: any;
  selctedfiletype: any;
  previewfile: any;
  chatresponse: any;
  statuslistSelect: any;
  calendar: any;
  TimeExceeded: any;
  selectPriority(priority: any): void {
    this.sub_priority = priority;
    if (priority == 2) {
      this.img = '../../../assets/img/dashboard/flag-Y.svg';
      return this.img;
    }
    if (priority == 1) {
      this.img = '../../../assets/img/dashboard/flag-R.svg';
      return this.img;
    }
    if (priority == 0) {
      this.img = '../../../assets/img/dashboard/flag-G.svg';
      return this.img;
    }
  }

  // priority dropdown.

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    due_date: new FormControl<Date | null>(null),
  });

  selected!: Date | null;
  checkListselected!: Date | null;

  opened!: boolean;
  reminderOpen!: boolean;

  checklistOpened: boolean | undefined;
  //  taskForm: FormGroup;
  membersNotSelected: boolean = false;
  selectedMembersch: Array<{
    item_id: number;
    item_text: string;
    input: string;
    item_time: any;
    item_name: any;
    user_id: any;
    user_name: any;
  }> = [];
  computedCosts: any[] = [];
  projectRemainingPrice: any;
  remainingtotalCost: any;
  private apiUrl = environment.ApiUrl;
  email = new FormControl();
  submitFormComment!: FormGroup;
  taskForm: FormGroup;
  fileForm!: FormGroup;
  noteslistData: any;
  clientlist: any;
  clientslistData: any;
  responsiblelist: any;
  responsiblelistData: any;
  role: any;
  team1: Array<Client> = [];
  team2: Array<Projectids> = [];
  team3: Array<Client> = [];
  team4: Array<Client> = [];
  team5: Array<Client> = [];
  team6: Array<Client> = [];
  team7: Array<Client> = [];
  team8: Array<Client> = [];
  memberlist: any;
  memberlistData: any;
  projectslistcreated: any;
  projectslistData: any;
  statuslistData: any;
  statuslist: any;
  selectedImage: any;
  multipleclient: boolean = false;
  title = 'micRecorder';
  selectedImagesComment: any;
  loading: boolean = false;
  hidecomment: boolean = false;
  //Lets declare Record OBJ
  record: any;
  companyId: any;
  isButtonDisabled: boolean = false;
  progress: any;
  isUploading: boolean = false;
  selctedfilename: any;
  selectedpriority: any = {
    priority: 0,
  };
  projectselect: any;
  combinedCosts: any[] = [];
  checkslistData: any;
  checkslistsData: any;
  getaprojectId: any;
  checkboxStates: { id: number; state: number }[] = [];

  //Will use this flag for toggeling recording
  recording = false;
  //URL of Blob
  url: any;
  error: any;
  taskCheckListsData: any;
  descriptionTask:any
  taskFormchecklist!: FormGroup;

  todayDate: any;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  selectedTimeNames: { name: string; hours: number; minutes: number }[] = []; // Initialize empty array

  ngOnInit(): void {
    // this.commentDelete();
    this.todayDate = this.getFormattedDate(new Date());
    // Used for date-picker min constraints (no past date selection).
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);
    this.maxDate = new Date(this.minDate);
    this.permission();
    this.ClientList();
    this.responsiblePersonList();
    this.commonService.checkLoggedIn();
    this.selectPriority('../../../assets/img/dashboard/flag-R.svg');
  }

  // focus on searchbar
  searchFocus(target: any) {
    const input = this.elementRef.nativeElement.querySelector(
      '.filter-textbox > input'
    );
    if (input) {
      input.focus();
    }
  }

  clientsearchFocus(event: any) {
    // Check if the event target is inside the ng-multiselect-dropdown
    if (event.target.closest('#two')) {
      const input = this.elementRef.nativeElement.querySelector(
        '#two .filter-textbox input'
      );
      if (input) {
        input.focus();
      }
    }
  }
  tasksearchFocus(event: any) {
    // Check if the event target is inside the ng-multiselect-dropdown
    if (event.target.closest('#three')) {
      const input = this.elementRef.nativeElement.querySelector(
        '#three .filter-textbox input'
      );
      if (input) {
        input.focus();
      }
    }
  }
  assignsearchFocus(event: any) {
    if (event.target.closest('#four')) {
      const input = this.elementRef.nativeElement.querySelector(
        '#four .filter-textbox input'
      );
      if (input) {
        input.focus();
      }
    }
  }

  // focus on searchbar

  getFormattedDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${day}-${month}-${year}`;
  }

  selectedItems2: ICountry[] = [];
  form: FormGroup;
  countries: Array<ICountry> = [];
  filteredTeam: any;
  dropdownSettings1: any = {};
  dropdownSettings2: any = {};
  dropdownSettings3: any = {};
  dropdownSettings4: any = {};
  dropdownSettings5: any = {};
  sub_status: any;
  constructor(
    private cdRef: ChangeDetectorRef,
    private dateAdapter: DateAdapter<Date>,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: Router,
    private commonService: CommonService,
    private renderer: Renderer2,
    private datePipe: DatePipe,
    private domSanitizer: DomSanitizer,
    private toastr: ToastrService,
    private elementRef: ElementRef
  ) {
    this.spinner.show();
    this.dateAdapter.setLocale('en-In');
    this.taskForm = this.fb.group({
      members_id: [[], Validators.required],
      members_ids: [''],
    });

    this.taskFormchecklist = this.fb.group({
      tasktypechecklist: [null],
      tasktyperemark: [null],
      is_documentupload: [null],
      id: [null],
    });

    this.companyId = localStorage.getItem('usercompanyId');
    this.ClientList();
    this.getmemberlist();
    this.statusList();
    this.loadProjectsList();
    this.role = localStorage.getItem('roleName');
    this.fileForm = this.formBuilder.group({
      multiplefile: ['initialValue'],
    });

    this.submitFormComment = this.fb.group({
      comment: [''],
      is_comment: ['text'],
      extension: [''],
      filename: [''],
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
    this.dropdownSettings3 = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };
    this.dropdownSettings1 = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.dropdownSettings4 = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.dropdownSettings5 = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
    };

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      start: ['', Validators.required],
      due_date: ['', Validators.required],
      periodic_date: [''],
      description: [''],
      project_id: [null, Validators.required],
      members_id: [null, Validators.required],
      checklist: [''],
      responsible_person: [''],
      checklist_responsible_person: [''],
      checklist_assign: [''],
      checklist_document: [''],
      checklist_time_hour: [''],
      checklist_time_minute: [''],
      checklist_name: [''],
      checklist_remark: [''],
      notificationTypes: [''],
      remindOnControl: [false],
      priority: ['', Validators.required],
      status: [''],
      client_id: [null, Validators.required],
      selectedClient: ['', Validators.required],
      targettimehour: [''],
      targettimemin: ['', Validators.required],
      totalCost: ['', Validators.required],
      tasktype: [null],
      prices: this.fb.array([]),
      checklistsForm: this.fb.array([]),
    });
  }
  existingChecklistData(existingChecklistData: any) {
    throw new Error('Method not implemented.');
  }

  get checklistsTask(): FormArray {
    return this.taskForm.get('checklistsForm') as FormArray;
  }

  statusList() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(
          `${this.apiUrl}statusList?companyID=` +
            localStorage.getItem('usercompanyId'),
          { headers }
        )
        .subscribe(
          (companylistData: any) => {
            this.statuslistData = companylistData;
            this.statuslist = companylistData?.data;
            this.statuslistSelect = [
              this.statuslist.find(
                (status: StatusItem) => status.status === 'New Task'
              ),
            ];
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
  comparePriority(option1: number, option2: number): boolean {
    return option1 === option2;
  }

  getmemberlist() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(
          `${this.apiUrl}comapnyMemberList?companyID=` +
            localStorage.getItem('usercompanyId'),
          {
            headers,
          }
        )
        .subscribe(
          (clientslistData: any) => {
            this.memberlistData = clientslistData;
            this.team1 = this.memberlistData.data.map(
              (item: { id: any; name: any; hour_per_cost: any }) => ({
                item_id: item.id,
                item_text: item.name,
                item_time: item.hour_per_cost,
              })
            );
            this.spinner.hide();
          },
          (error) => {}
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }
  get subtasks() {
    return this.taskForm.get('subtasks') as FormArray;
  }

  subtasksArray: {
    sub_due_date: any;
    sub_members_id: any;
    sub_status: any;
    sub_priority: any;
    sub_title: any;
  }[] = [];

  get prices(): FormArray {
    return this.taskForm.get('prices') as FormArray;
  }

  addPriceGroup(member: any, checklistItem: any) {
    const priceGroup = this.fb.group({
      userids: [member.item_id],
      checklistid: [checklistItem.item_id],
      targettimehours: [''],
      targettimemins: [''],
      userperhourmoney: [member.item_time],
      totalpricesuser: [''],
    });

    this.prices.push(priceGroup);
  }

  onProjectSelect(event: any) {
    const selectedProject = this.team2.find(
      (member) => member.item_id === event.item_id
    );

    this.projectselect = selectedProject?.item_cost;
    let projectmaxdate = this.projectslistcreated.find(
      (member: { id: any }) => member.id === event.item_id
    );
    this.maxDate = new Date(projectmaxdate.endDate);

    this.selectedMembersch = [];
    while (this.prices.length !== 0) {
      this.prices.removeAt(0);
    }
    this.combinedCosts = [];
    while (this.combinedCosts.length !== 0) {
      this.prices.removeAt(0);
    }
    this.projectRemainingPrice = undefined;
    this.remainingtotalCost = undefined;
  }

  getprices() {
    const actualhour = +this.taskForm.get('targettimehours')?.value || 0;
    const actualtimeminute = +this.taskForm.get('targettimemins')?.value || 0;
    const projectprice = +this.projectselect || 0;

    const arrayofprices = this.prices.value;
    this.computedCosts = [];
    this.combinedCosts = [];

    let totalTargetTimeMinutes = 0;
    let totalCost = 0;

    arrayofprices.forEach((price: any, index: any) => {
      const targettimehour = +price.targettimehours || 0;
      const targettimemin = +price.targettimemins || 0;
      const userperhourmoney = +price.userperhourmoney || 0;
      const userid = price.userids;
      const checklistid = price.checklistid;

      const totalMinutes = targettimehour * 60 + targettimemin;
      totalTargetTimeMinutes += totalMinutes;

      const costPerMinute = userperhourmoney / 60;
      const userTotalCost = totalMinutes * costPerMinute;
      totalCost += userTotalCost;

      this.computedCosts[index] = {
        userid: userid,
        checklistid: checklistid,
        overtime: Math.round(userTotalCost),
        current: Math.round(userTotalCost),
      };

      (this.prices.at(index) as FormGroup).patchValue({
        totalpricesuser: Math.round(userTotalCost),
      });
    });

    const totalTargetTimeHours = Math.floor(totalTargetTimeMinutes / 60);
    const totalTargetTimeRemainingMinutes = totalTargetTimeMinutes % 60;

    let totalTimeExceeded =
      totalTargetTimeHours > actualhour ||
      (totalTargetTimeHours === actualhour &&
        totalTargetTimeRemainingMinutes > actualtimeminute);
    let totalCostExceeded = false;

    this.TimeExceeded = totalTimeExceeded;

    arrayofprices.forEach((price: any, index: any) => {
      const userid = price.userids;
      const checklistid = price.checklistid;
      this.combinedCosts.push({
        userid: userid,
        checklistid: checklistid,
        less: !totalCostExceeded ? this.computedCosts[index].current : null,
        greater: totalCostExceeded ? this.computedCosts[index].current : null,
        timeExceeded: totalTimeExceeded ? 1 : 0,
        costExceeded: totalCostExceeded ? 1 : 0,
      });
    });

    this.projectRemainingPrice = Math.round(projectprice - totalCost);
    this.remainingtotalCost = Math.round(totalCost);
  }

  getComputedCost(
    userid: string,
    checklistid: string,
    type: 'less' | 'greater'
  ): string {
    const cost = this.combinedCosts.find(
      (cost) => cost.userid === userid && cost.checklistid === checklistid
    );
    return cost ? (type === 'less' ? cost.less : cost.greater) : '0.00';
  }

  isUniqueName(index: number): boolean {
    const currentName = this.prices.at(index).get('userName')?.value;
    return (
      this.prices.value.findIndex(
        (price: any) => price.userName === currentName
      ) === index
    );
  }

  removeInArray(userids: any): void {
    const pricesArray = this.prices.value;

    const filteredArray = pricesArray.filter(
      (price: any) => price.userids !== userids
    );

    this.prices.clear();
    filteredArray.forEach((price: any) => {
      const priceGroup = this.fb.group({
        targettimehours: [price.targettimehours],
        targettimemins: [price.targettimemins],
        userperhourmoney: [price.userperhourmoney],
        userids: [price.userids],
        checklistid: [price.checklistid],
        totalpricesuser: [price.totalpricesuser],
        userName: [price.userName],
        checklistName: [price.checklistName],
      });
      this.prices.push(priceGroup);
    });

    const remainingTotalCost = filteredArray.reduce(
      (acc: number, price: any) => acc + parseFloat(price.totalpricesuser),
      0
    );
    this.remainingtotalCost = Math.round(remainingTotalCost);
  }

  addusers() {
    const selectedChecklist = this.taskForm.get('checklist')?.value;
    const selectedUsers = this.taskForm.get('members_id')?.value;

    for (const user of selectedUsers) {
      const userhourmoneys = this.team1.find(
        (member: { item_id: any }) => member.item_id === user.item_id
      );
      for (const item of selectedChecklist) {
        const selectedMember = this.team5.find(
          (member) => member.item_id === item.item_id
        );
        if (
          selectedMember &&
          !this.selectedMembersch.some(
            (member) =>
              member.item_id === selectedMember.item_id &&
              member.user_id === user.item_id
          )
        ) {
          const priceGroup = this.fb.group({
            userids: [user.item_id],
            checklistid: [item.item_id],
            targettimehours: [''],
            targettimemins: [''],
            userperhourmoney: [userhourmoneys?.item_time],
            totalpricesuser: [''],
            userName: [user.item_text],
            checklistName: [item.item_text],
          });

          this.selectedMembersch.push({
            item_id: item.item_id,
            user_id: user.item_id,
            user_name: user.item_text,
            item_text: selectedMember.item_text,
            item_time: userhourmoneys?.item_time,
            item_name: userhourmoneys?.item_text,
            input: '',
          });
          this.prices.push(priceGroup);
        }
      }
    }

    this.taskForm.get('checklist')?.setValue(null);
    this.taskForm.get('members_id')?.setValue(null);
  }

  addSubTask() {
    const arrayofsubtask = this.taskForm.get('subtasks');

    if (arrayofsubtask?.value.sub_title === '') {
      this.toastr.error('Please add subtask name');
      return;
    }

    // Removed past date validation for subtask due date.

    const newSubtask = {
      sub_title: arrayofsubtask?.value.sub_title,
      sub_due_date: this.datePipe.transform(this.selected, 'yyyy-MM-dd'),
      sub_members_id: arrayofsubtask?.value.sub_members_id,
      sub_status: arrayofsubtask?.value.sub_status,
      sub_priority: this.sub_priority,
    };
    this.subtasksArray.push(newSubtask);
    arrayofsubtask?.get('sub_title')?.setValue('');
    arrayofsubtask?.get('sub_due_date')?.setValue(new Date());
    arrayofsubtask?.get('sub_members_id')?.setValue('');
    arrayofsubtask?.get('sub_status')?.setValue('');
    arrayofsubtask?.get('sub_priority')?.setValue('0');
  }
  removeSubtask(index: number): void {
    this.subtasksArray.splice(index, 1);
  }

  checklistarray: {
    checkList_title: any;
    checkList_date: any;
  }[] = [];

  addchecklist() {
    const checklist = this.taskForm.get('check_list');
    if (checklist?.value.checkList_title === '') {
      this.toastr.error('Please add checklist name');
      return;
    }

    // Removed past date validation for checklist date.

    const newchecklist = {
      checkList_title: checklist?.value.checkList_title,
      checkList_date: this.datePipe.transform(this.selected, 'yyyy-MM-dd'),
    };
    this.checklistarray.push(newchecklist);
    checklist?.get('checkList_title')?.setValue('');
    checklist?.get('checkList_date')?.setValue(new Date());
  }

  onSubmit(information: any) {

    // Removed all past date validation and error messages for start, due, and periodic dates.
    if (this.range.value.start) {
      information.start = this.toUTC(this.range.value.start);
    }
    if (this.range.value.due_date) {
      information.due_date = this.toUTC(this.range.value.due_date);
    }
    information.is_cocuments = this.checkboxStates;
    if (this.periodic_date?.value) {
      // No validation for past periodic date
    }

    information.periodic_date = this.periodic_date.value;

    if (information.project_id == null) {
      setTimeout(() => {
        this.toastr.error('Please select project');
      }, 10);
      return;
    }
    if (information.client_id == null) {
      setTimeout(() => {
        this.toastr.error('Please select client');
      }, 10);
      return;
    }
    if (information.tasktype == null) {
      setTimeout(() => {
        this.toastr.error('Please select task type');
      }, 10);
      return;
    }
    if (information.members_id == null) {
      setTimeout(() => {
        this.toastr.error('Please select assign');
      }, 10);
      return;
    }
    if (information.description == 'undefined') {
      setTimeout(() => {
        this.toastr.error('Please enter description');
      }, 10);
      return;
    }
    if (information.start === '' || information.due_date === '') {
      setTimeout(() => {
        this.toastr.error('Please Fill Start & End Date Required Field');
      }, 10);
      return;
    }
    if (information.responsible_person == '') {
      setTimeout(() => {
        this.toastr.error('Please select responsible person');
      }, 10);
      return;
    }
    if (information.periodic_date == '') {
      setTimeout(() => {
        this.toastr.error('Please select periodic date');
      }, 10);
      return;
    }
    
    for (let i = 0; i < information.checklistsForm.length; i++) {
      const checklist = information.checklistsForm[i];
      if (!checklist.checklist_time_hour || !checklist.checklist_time_minute ||
          !checklist.checklist_responsible_person || !checklist.checklist_members_id) {
        this.toastr.error(`Checklist Please fill in all required fields.`);
        return
      }
    }
    // console.log(information);
    // return

    this.spinner.show();

    const token = localStorage.getItem('tasklogintoken');
    if (this.subtasksArray) {
      information.sub_task = this.subtasksArray;
    }

    if (this.checklistarray) {
      information.checkList = this.checklistarray;
    }

    const projectdatas = JSON.stringify(information.project_id);
    information.project_id = JSON.parse(projectdatas);
    information.periodic_date = this.periodic_date.value;
    information.is_recurring = information.remindOnControl;
    information.recurring_time = information.notificationTypes;

    if (token) {
      this.isButtonDisabled = true;
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .post(`${this.apiUrl}taskAdd`, information, { headers })
        .subscribe(
          (response: any) => {
            if (response) {
              this.isButtonDisabled = true;
              if (response.status === true) {
                this.toastr.success('Task Added Successfully.');
                this.spinner.hide();
                this.uploadtaskkimage(response.task_id);
                setTimeout(() => {
                  this.route.navigate(['/tasks']);
                }, 2000);
              }
            }
          },
          (error: any) => {
            this.isButtonDisabled = true;
            this.spinner.hide();
            console.error('Error sending data', error);
          }
        );
    }
  }

  toUTC(date: Moment | Date): string {
    let dateObj: Date;
    if (moment.isMoment(date)) {
      dateObj = date.toDate();
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      throw new Error('Invalid date type');
    }
    return new Date(
      dateObj.getTime() - dateObj.getTimezoneOffset() * 60000
    ).toISOString();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.commentontask(this.submitFormComment.value);
    }
  }

  uploadtaskkimage(id: any) {
    const token = localStorage.getItem('tasklogintoken');
    const formData = new FormData();
    if (id) {
      formData.append('task_id', id);
    }

    if (this.selectedImages === undefined) {
      return;
    }

    if (this.selectedImages === null) {
      return;
    }

    if (this.selectedImages) {
      formData.append('files', this.selectedImages);
    }

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .post(`${this.apiUrl}fileUpload`, formData, { headers })
        .subscribe(
          (response: any) => {
            if (response) {
              // this.route.navigateByUrl('tasks');
            }
          },
          (error: any) => {
            this.spinner.hide();
            console.error('Error sending data', error);
          }
        );
    }
  }

  onFileChangeWithNull() {
    this.onFileChange(null);
    this.progress = 0;
    this.isUploading = false;
    this.selctedfiletype = 'null';
  }
  onFileChange(event: any) {
    if (!event) {
      this.selectedImages = null;
      this.previewfile = null;
      this.selctedfiletype = null;
      this.selctedfilename = null;
      return;
    }
    this.progress = 0;
    this.isUploading = true;
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const file: File = files[0];
      if (file.type.startsWith('image/')) {
        this.selectedImages = file;
        this.previewfile = URL.createObjectURL(file);
        this.selctedfiletype = 'image';
      } else {
        this.selectedImages = file;
        this.selctedfiletype = 'file';
        this.selctedfilename = this.selectedImages.name;
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          this.previewfile = e.target.result;
        };
        reader.readAsDataURL(file);
      }
      if (file.size > 15 * 1024 * 1024) {
        this.toastr.error('File size exceeds the limit of 15 MB.');
        (event.target as HTMLInputElement).value = '';
        this.selectedImages = null;
        this.previewfile = null;
        this.selctedfiletype = null;
      }
    }
  }

  clickOutside() {
    this.opened = !this.opened;
  }

  reminder() {
    this.opened = !this.opened;
  }


  closeReminder() {
    if (this.taskForm.get('notificationTypes')?.value >= 0 && this.taskForm.get('notificationTypes')?.value <= 5) {
      this.multipleclient = true;
    }
    this.reminderOpen = false;
  }

  checklist() {
    this.checklistOpened = !this.checklistOpened;
  }

  get getItems() {
    return this.countries.reduce((acc, curr) => {
      return acc;
    }, {});
  }



  insertservice(information: any): void {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .post(`${this.apiUrl}serviceAdd`, information, { headers })
        .subscribe(
          (response: any) => {
            if (response) {
              this.toastr.success('Service Added Successfully.');
              const elementToClick =
                this.elementRef.nativeElement.querySelector('#serviceclose');
              if (elementToClick) {
                elementToClick.click();
              }
            }
          },
          (error: any) => {
            this.spinner.hide();
            console.error('Error sending data', error);
          }
        );
    }
  }

  ClientList() {
    this.spinner.show();
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}clientList?companyID=` + this.companyId, {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.clientslistData = clientslistData;
            this.clientlist = this.clientslistData?.data;
            this.team3 = this.clientslistData?.data.map(
              (item: { id: any; name: any;company_name:any; }) => ({
                item_id: item.id,
                item_text: item.company_name +' ('+ item.name +')',
              })
            );

            this.spinner.hide();
          },
          (error) => {}
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }

  responsiblePersonList() {
    this.spinner.show();
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}partnerMemberList?companyID=` + this.companyId, {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.responsiblelistData = clientslistData;
            this.responsiblelist = this.responsiblelistData?.data;
            this.team4 = this.responsiblelistData?.data.map(
              (item: { id: any; name: any }) => ({
                item_id: item.id,
                item_text: item.name,
              })
            );
            this.spinner.hide();
          },
          (error) => {}
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }

  permission() {
    // UI permission gating removed: allow all roles to create tasks.
    // (If you need true security, enforce it server-side as well.)
  }

  loadProjectsList() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(
          `${this.apiUrl}taskProjectList?companyID=` +
            localStorage.getItem('usercompanyId'),
          { headers }
        )
        .subscribe(
          (projectslistData: any) => {
            this.projectslistData = projectslistData;
            this.projectslistcreated = projectslistData?.data;
            this.team2 = this.projectslistData.data.map(
              (item: { id: any; name: any; total_cost: any }) => ({
                item_id: item.id,
                item_cost: item.total_cost,
                item_text: item.name.toUpperCase(),
              })
            );
          },
          (error) => {
            console.error('Error loading projects list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  checklistassignes(selectedIds: any) {
    this.team7 = this.team1.filter((member) =>
      selectedIds.includes(member.item_id)
    );
  }
  checklistresponsibleperson(selectedId: any) {
    this.team8 = this.team4.filter((member) =>
      selectedId.includes(member.item_id)
    );
  }

  

  // nikunj changes 28-12 subtask and checklist

  //  user assign dropdown 27-12
  showAssignlist = false;
  showeditAssignlist = false;

  toggleDropdown() {
    this.showAssignlist = !this.showAssignlist;
  }

  edituserAssign() {
    this.showeditAssignlist = !this.showeditAssignlist;
  }

  showStatus = false;

  statusSelect() {
    this.showStatus = !this.showStatus;
  }

  removechecklist(index: number) {
    this.checklistarray.splice(index, 1);
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  initiateRecording() {
    this.recording = true;
    let mediaConstraints = {
      video: false,
      audio: true,
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  successCallback(stream: MediaStream) {
    var options = {
      mimeType: 'audio/wav' as
        | 'audio/wav'
        | 'audio/webm'
        | 'audio/webm;codecs=pcm',
      numberOfAudioChannels: 1 as 1 | 2 | undefined,
      sampleRate: 44100,
    };

    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;

    var recordOptions: RecordRTC.Options = {
      mimeType: options.mimeType,
      numberOfAudioChannels: options.numberOfAudioChannels,
      sampleRate: options.sampleRate,
    };

    this.record = new StereoAudioRecorder(stream, recordOptions);
    this.record.record();
  }

  stopRecording() {
    this.recording = false;
    if (this.record) {
      this.record.stop(this.processRecording.bind(this));
    } else {
      console.error('Record object is undefined. Unable to stop recording.');
    }
  }
  /**
   * processRecording Do what ever you want with blob
   * @param  {any} blob Blog
   */
  processRecording(blob: Blob | MediaSource) {
    if (blob instanceof Blob) {
      this.url = URL.createObjectURL(blob);
      const formData = new FormData();
      formData.append('comment', blob, 'recorded_audio.wav');
      formData.append('is_comment', 'audio');
      this.commentontask(formData);
    }
  }

  /**
   * Process Error.
   */
  errorCallback(error: any) {
    this.error = 'Can not play audio in your browser';
  }

  getDateKeys(): string[] {
    return Object.keys(this.chatresponse);
  }

  commentontask(formData: any) {
    const token = localStorage.getItem('tasklogintoken');
    if (!token) {
      console.log('No token found in localStorage.');
      this.commonService.logout();
      return;
    }
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    if (formData && formData.is_comment == null && formData.extension == null) {
      formData.is_comment = 'text';
    }
    this.http
      .post(`${this.apiUrl}taskComment`, formData, { headers })
      .subscribe(
        (response: any) => {
          this.submitFormComment.get('comment')?.setValue('');
          setTimeout(() => {
            this.toastr.success('Comment Added Successfully.');
          }, 10);
          this.chatresponse = response.data;
          this.submitFormComment.reset();
        },
        (error: any) => {
          this.spinner.hide();
          console.error('Error sending data', error);
        }
      );
  }

  uploadtaskcomment(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const file: File = files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop();
      let filenamesends = fileName.split('/');
      let filenamesend = filenamesends[filenamesends.length - 1];

      let filenameParts = filenamesend.split('.');

      let filenamepost = filenameParts[0];

      if (file.size <= 15 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.submitFormComment.get('comment')?.setValue(e.target?.result);
          this.submitFormComment.get('is_comment')?.setValue('file');
          this.submitFormComment
            .get('extension')
            ?.setValue(file.name.split('.').pop());
          this.submitFormComment.get('filename')?.setValue(filenamepost);
          this.commentontask(this.submitFormComment.value);
        };
        reader.readAsDataURL(file);
      } else {
        this.toastr.error('File size exceeds the limit of 15 MB.');
        (event.target as HTMLInputElement).value = '';
      }
    }
  }

  getshortname() {
    const shortname = localStorage.getItem('username');
    return shortname
      ?.split(' ')
      .map((name) => name.charAt(0))
      .join('');
  }

  generateCommentStructure(text: string): void {
    const commentId = 'comment_' + Math.random().toString(36).substring(7);
    const commentElement = document.createElement('div');
    commentElement.className = 'comment me';
    commentElement.id = commentId;
    const shortNameElement = document.createElement('div');
    shortNameElement.className = 'user_short_name';
    shortNameElement.textContent = this.getshortname() ?? 'DefaultShortName';
    const bubbleElement = document.createElement('div');
    bubbleElement.className = 'bubble';
    bubbleElement.textContent = text;
    commentElement.appendChild(shortNameElement);
    commentElement.appendChild(bubbleElement);
    const parentElement = document.getElementById('appendtext');
    if (parentElement) {
      parentElement.appendChild(commentElement);
    }
  }

  getusers(id: any) {
    this.getaprojectId = id.item_id;

    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .post(
          `${this.apiUrl}projectByTaskTypeList?projectID=` + this.getaprojectId,
          {},
          { headers }
        )
        .subscribe(
          (clientslistData: any) => {
            if (clientslistData && clientslistData.data) {
              this.memberlistData = clientslistData;
              this.team5 = this.memberlistData.data.map(
                (item: { id: any; tasktype: any }) => ({
                  item_id: item.id,
                  item_text: item.tasktype,
                })
              );
            } else {
              console.log('Invalid response structure:', clientslistData);
            }
          },
          (error) => {
            console.error('Error fetching client list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  getchecklist(id: any) {
    // this.clearFormArray(this.taskFormchecklist?.value.tasktypechecklist);
    if (this.taskForm.get('checklistsForm')?.value.length !== 0) {
      const checklistsFormArray = this.taskForm.get('checklistsForm') as FormArray;
      checklistsFormArray.clear();
    }

    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      const information = {
        projectID: this.getaprojectId,
        typeID: id.item_id,
      };

      this.http
        .post(`${this.apiUrl}projectByTypeCheckList`, information, { headers })
        .subscribe(
          (checkslistData: any) => {
            if (checkslistData && checkslistData.data) {
              this.checkslistsData = checkslistData?.data;

              this.taskCheckListsData = [];

              this.checkslistsData = checkslistData?.data;

              if (this.checkslistsData && Array.isArray(this.checkslistsData)) {
                this.checkslistsData.forEach(
                  (item: {
                    id: any;
                    is_document: any;
                    taskTypeId: any;
                    tasktypechecklist: any;
                    tasktyperemark: any;
                  }) => {
                    this.taskCheckListsData.push({
                      id: item.id,
                      is_document: item.is_document,
                      taskTypeId: item.taskTypeId,
                      tasktypechecklist: item.tasktypechecklist,
                      tasktyperemark: item.tasktyperemark,
                    });
                  }
                );

                this.taskCheckListsData.forEach((item: any) => {
                  // Convert the document requirement to a boolean
                  const documentRequirement =
                    item.is_document === 'Document Required';

                  const checklistGroup = this.fb.group({
                    id: [item.id],
                    checklist_name: [
                      item.tasktypechecklist || '',
                      Validators.required,
                    ],
                    checklist_remark: [
                      item.tasktyperemark || '',
                      Validators.required,
                    ],
                    checklist_document: [documentRequirement], // Store as boolean
                    checklist_time_hour: [item.checklist_time_hour || ''],
                    checklist_time_minute: [item.checklist_time_minute || ''],
                    checklist_members_id: [item.checklist_assign || null],
                    checklist_responsible_person: [
                      item.checklist_responsible_person || null,
                    ],
                  });

                  (this.taskForm.get('checklistsForm') as FormArray).push(
                    checklistGroup
                  );
                });
              } else {
                console.error(
                  'checkslistsData is not an array or is undefined'
                );
              }
            } else {
              console.log('Invalid response structure:', checkslistData);
            }
          },
          (error) => {
            console.error('Error fetching client list:', error);
          }
        );

        this.http
        .post(`${this.apiUrl}projectByDescription`, information, { headers })
        .subscribe(
          (descriptionTaskData: any) => {
            this.descriptionTask = descriptionTaskData.data.tasktypeDescription;
            if(this.taskCheckListsData.length <= 0){
              const checklistGroup = this.fb.group({
                id:[this.generateRandom3DigitNumber()],
                checklist_name:[this.descriptionTask],
                checklist_document: ['No Document Requirement'],
                checklist_time_hour: [1],
                checklist_time_minute: ['00'],
                checklist_members_id: [],
                checklist_responsible_person: [],
                checklist_remark: ['']
              });
              

              this.taskCheckListsData.push(checklistGroup.value);
              (this.taskForm.get('checklistsForm') as FormArray).push(
                checklistGroup
              );
              // this.taskCheckListsData = checklistGroup;
              console.log(this.taskCheckListsData);
              
          }else{
            this.taskCheckListsData = [];
          }
          },
          (error) => {
            console.error('Error fetching client list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  generateRandom3DigitNumber = () => {
    return Math.floor(100 + Math.random() * 900);
  };



  addChecklistTaskType(): void {
    // Get the checklist name from the form
    const checklistName = this.taskFormchecklist?.value.tasktypechecklist;
  
    // Validate the checklist name
    if (!checklistName) {
      this.toastr.error('Please Enter Checklist');
      return;
    }
  
    // Check if the document upload is required
    const documentRequirement =
      this.taskFormchecklist?.value.is_documentupload === 'Document Required';
  
    // Create a new FormGroup for the checklist
    const newChecklist = this.fb.group({
      checklist_name: [checklistName, Validators.required],
      checklist_remark: [
        this.taskFormchecklist?.value.tasktyperemark || '',
        Validators.required,
      ],
      checklist_document: [documentRequirement],
      id: [this.generateRandom3DigitNumber()],
      checklist_time_hour: [''],
      checklist_time_minute: [''],
      checklist_members_id: [null],
      checklist_responsible_person: [null],
    });
  
    console.log('New Checklist:', newChecklist.value);
  
    if (!Array.isArray(this.taskCheckListsData)) {
      this.taskCheckListsData = [];
    }
  
    this.taskCheckListsData.push(newChecklist.value);
  
    const checklistsFormArray = this.taskForm.get('checklistsForm') as FormArray;
    if (checklistsFormArray) {
      checklistsFormArray.push(newChecklist);
    } else {
      console.error('checklistsForm is not defined in taskForm.');
    }
  
    this.resetChecklistForm();
  
    this.toastr.success('Checklist item added successfully.');
    console.log(this.taskCheckListsData);
    
  }
  

  resetChecklistForm() {
    this.taskFormchecklist?.get('tasktypechecklist')?.setValue('');
    this.taskFormchecklist?.get('tasktyperemark')?.setValue('');
    this.taskFormchecklist?.get('is_documentupload')?.setValue(false);
  }

  removeItem(checklistsIdss: any) {

    
    if (Array.isArray(this.taskCheckListsData)) {
      const index = this.taskCheckListsData.findIndex(
        (item: { id: any }) => item.id == checklistsIdss
      );
       if (index !== -1) {
         this.taskCheckListsData.splice(index, 1);
        const checklistsFormArray = this.taskForm.get('checklistsForm') as FormArray;
        checklistsFormArray.removeAt(index);
      } else {
        const checklistsFormArray = this.taskForm.get('checklistsForm') as FormArray;
        checklistsFormArray.removeAt(0);
      }
    } else if (
      this.taskCheckListsData.value &&
      this.taskCheckListsData.value.id === checklistsIdss
    ) {
      this.taskCheckListsData = null;
      const checklistsFormArray = this.taskForm.get('checklistsForm') as FormArray;
      checklistsFormArray.removeAt(0);
    } else {
      const checklistsFormArray = this.taskForm.get('checklistsForm') as FormArray;
      checklistsFormArray.removeAt(0);
    }
  }

  

  filterFollowingMembers(selectedMembers: any[]) {
    const selectedIds = selectedMembers.map((member) => member.item_id);
    this.filteredTeam = this.team1.filter(
      (member) => !selectedIds.includes(member.item_id)
    );
  }

  periodic_date = new FormControl(moment());

  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.periodic_date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.periodic_date.setValue(ctrlValue);
    datepicker.close();
  }

  onCheckboxChange(event: any, id: number) {
    const state = event.target.checked ? 1 : 0;
    const index = this.checkboxStates.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.checkboxStates.splice(index, 1);
    }
    this.checkboxStates.push({ id, state });
  }

  clearFormArray(formArray: FormArray) {
    console.log(formArray);

    while (formArray.length !== 0) {
      formArray.removeAt(0); // Clear each control
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    console.log("sonsofn",event)
    moveItemInArray(this.checklistsTask.controls, event.previousIndex, event.currentIndex);
  }
}
