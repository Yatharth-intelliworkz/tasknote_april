import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  NgModule,
  NgModuleRef,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import {
  UntypedFormControl,
  FormControl,
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  NgModel,
  FormArray,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormModule } from '@coreui/angular';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from '../../service/common.service';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import * as RecordRTC from 'recordrtc';
declare var $: any;
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgSelectModule } from '@ng-select/ng-select';
import {CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';


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
interface CombinedCost {
  userid: string;
  checklistid: string;
  less: string | null;
  greater: string | null;
  timeExceeded: number;
  costExceeded: number;
}

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.scss'],
  standalone: true,
  imports: [
    CdkDropList, CdkDrag,
    MatFormFieldModule,
    MatButtonToggleModule,
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
    RouterLink,
    DatePipe,
    NgClass,
    NgxDocViewerModule,
    NgSelectModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ViewTaskComponent {
  [x: string]: any;
  // priority dropdown

  reminderSelected!: Date | null;
  selectedPriority: { image: string } = { image: '' }; // initialize with the default status
  remindOn: boolean = false;
  remindOnControl = new FormControl();
  loading: boolean = false;
  submitFormComment!: FormGroup;
  reminderForm!: FormGroup;
  taskFormchecklist!: FormGroup;
  taskCommentData: any;
  edittaskid: any;
  localstorageuserId = localStorage.getItem('userid');

  // priority dropdown
  isHidden: boolean = true;
  isEditEnabled = false;
  private apiUrl = environment.ApiUrl;
  email = new FormControl();
  taskForm!: FormGroup;
  projectslistcreated: any;
  projectslistData: any;
  statuslistData: any;
  statuslist: any;
  selectedImage: any;
  fileForm!: FormGroup;
  servicelistData: any;
  servicelist: any;
  noteslistData: any;
  ClientlistData: any;
  Clientlist: any;
  role: any;
  taskId: any;
  taskDetailData: any;
  taskDetail: any;
  selectedItems2: ICountry[] = [];
  form: FormGroup;
  countries: Array<ICountry> = [];
  team1: Array<Client> = [];
  team2: Array<Client> = [];
  team4: Array<Client> = [];
  team5: Array<Client> = [];
  team3: Array<Client> = [];
  team7: Array<Client> = [];
  team8: Array<Client> = [];
  memberlist: any;
  memberlistData: any;
  clientlist: any;
  clientslistData: any;
  responsiblelist: any;
  responsiblelistData: any;
  dropdownSettings1: any = {};
  dropdownSettings2: any = {};
  dropdownSettings3: any = {};
  dropdownSettings4: any = {};
  dropdownSettings5: any = {};
  remainingarray: any = {};
  taskData: any;
  formData = new FormData();
  img: any = '../../../assets/img/dashboard/flag-G.svg';
  sub_priority: any;
  editbutton: any;
  selectedImages: any;
  selctedfiletype: any;
  previewfile: any;
  progress: any;
  isUploading: boolean = false;
  selctedfilename: any;
  projectselect: any;

  minDate: any;
  minDates: any;
  maxDate: Date = new Date();
  selectedMembersch: Array<{
    item_id: number;
    item_text: string;
    input: string;
    item_time: any;
    item_name: any;
    user_id: any;
  }> = [];
  TimeExceeded: any;
  computedCosts: any;
  combinedCosts: any;
  pricetoatals: any;
  remainingtotals: any;
  checkslistsData: any;
  editChecksListsData: any;
  displayChecksListsData: any;
  checkboxStates: { id: number; state: number }[] = [];
  membersids: number[] = []; // Initialize as an array for multiple selection
  responsiblePerson: number[] = [];
  // cost: any;
  projectRemainingPrice: any;
  remainingtotalCost: any;

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

  title = 'micRecorder';
  //Lets declare Record OBJ
  record: any;
  //Will use this flag for toggeling recording
  recording = false;
  //URL of Blob
  url: any;
  error: any;

  isDivVisible = false;
  filteredTeam: any;
  isDropdownDisabled: boolean = true;

  // angular  bootstap date
  selected!: Date | null;
  subTaskselected!: Date | null;
  checkListselected!: Date | null;
  // angular  bootstap date
  task_id: any;
  opened!: boolean;
  reminderOpen!: boolean;
  checklistOpened: boolean | undefined;
  selectedTaskId: any;
  selectedTaskchecklistId: any;
  usertypes: any;
  constructor(
    private dateAdapter: DateAdapter<Date>,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private http: HttpClient,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private toastr: ToastrService,
    private elementRef: ElementRef,
    private datePipe: DatePipe
  ) {
    this.spinner.show();
    this.reminderSelected = new Date();
    this.route.paramMap.subscribe((params) => {
      this.taskId = params.get('id');
      this.task_id = params.get('id');
      this.edittaskid = params.get('id');
    });
    
    this.submitFormComment = this.fb.group({
      comment: [''],
      is_comment: ['text'],
      extension: [''],
      filename: [''],
    });
    this.taskFormchecklist = this.fb.group({
      tasktypechecklist: [null],
      tasktyperemark: [null],
      is_documentupload: [null],
      id: [null],
    });
    this.getmemberlist();
    this.loadProjectsList();
    this.gettaskDetail(this.taskId);
    this.serviceList();
    this.statusList();
   
    this.role = localStorage.getItem('roleName');
    this.fileForm = this.fb.group({
      multiplefile: ['initialValue'],
    });
    this.dateAdapter.setLocale('en-In');

    this.form = this.fb.group({
      selectedItems2: [[]],
      yourFormControlName: ['initialValue'],
    });

    this.dropdownSettings1 = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 2,
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
    this.dropdownSettings3 = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 2,
      // selectAllText: 'Select All',
      // unSelectAllText: 'UnSelect All',
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

    this.reminderForm = this.fb.group({
      remindOnControl: [],
      reminderdate: [],
      priority: [],
      priority_based: [],
      selectedHour: ['00'], // Default value
      selectedMinute: ['00'], // Default value
      recipients: [[]], // Default value as an empty array
      notificationTypes: [[]], // Default value as an empty array
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((name) => name.charAt(0))
      .join('');
  }

  ngOnInit(): void {

    this.usertypes = localStorage.getItem('usertype');
    this.ClientList();
    this.responsiblePersonList();
    this.commenttask();
    this.serviceList();
    this.commonService.checkLoggedIn();
    this.selectPriority('../../../assets/img/dashboard/flag-R.svg');
    this.minDate = new Date();
    this.minDates = new Date();

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      start: [''],
      due_date: [''],
      description: [''],
      project_id: [''],
      client_id: [''],
      members_id: [],
      priority: [''],
      periodic_date: [''],
      status: [''],
      service_id: [''],
      selectedClient: [''],
      targettimehour: [''],
      targettimemin: [''],
      responsible_person: [''],
      checklist: [''],
      totalpricesuser: [''],
      prices: this.fb.array([]),
      taskID: [''],
      tasktype: [''],
      totalCost: [{ value: '', readonly: true }],
      remainingAmount: [{ value: '', readonly: true }],
      checklistsForm: this.fb.array([]),
    });
    this.taskForm.get('project_id')?.disable();
    this.taskForm.get('tasktype')?.disable();
  }


  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    due_date: new FormControl<Date | null>(null),
    periodic_date: new FormControl<Date | null>(null),
  });

  get checklistsTask(): FormArray {
    return this.taskForm.get('checklistsForm') as FormArray;
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
  removeItem(checklistsIdss: any) {
    const index = this.displayChecksListsData.findIndex(
      (item: { id: any }) => item.id === checklistsIdss
    );

    if (index !== -1) {
      this.displayChecksListsData.splice(index, 1);

      const checklistsFormArray = this.taskForm.get(
        'checklistsForm'
      ) as FormArray;
      checklistsFormArray.removeAt(index);
    } else {
      console.error(
        `Item with id ${checklistsIdss} not found in taskCheckListsData`
      );
    }
  }

  generateRandom3DigitNumber = () => {
    return Math.floor(100 + Math.random() * 900);
  };

  addChecklistTaskType() {
    const checklistName = this.taskFormchecklist?.value.tasktypechecklist;

    if (!checklistName) {
      this.toastr.error('Please Enter Checklist');
      return;
    }

    const documentRequirement =
      this.taskFormchecklist?.value.is_documentupload == 'Document Required';

    const newChecklist = this.fb.group({
      // Create a new FormGroup
      checklist_name: [checklistName, Validators.required],
      checklist_remark: [
        this.taskFormchecklist?.value.tasktyperemark || '',
        Validators.required,
      ],
      checklist_document: [documentRequirement],
      id: [this.generateRandom3DigitNumber()], // Optional: if you want to keep it in the form group
      checklist_time_hour: [''],
      checklist_time_minute: [''],
      checklist_members_id: [''],
      checklist_responsible_person: [''],
    });

    this.displayChecksListsData.push(newChecklist.value);
    (this.taskForm.get('checklistsForm') as FormArray).push(newChecklist);
    this.resetChecklistForm();
  }

  resetChecklistForm() {
    this.taskFormchecklist?.get('tasktypechecklist')?.setValue('');
    this.taskFormchecklist?.get('tasktyperemark')?.setValue('');
    this.taskFormchecklist?.get('is_documentupload')?.setValue(false);
  }

  reminderFormSubmit() {
    const information = this.reminderForm.value;
    information.reminderdate = this.reminderSelected;
    if (
      information.reminderdate == '' ||
      information.priority_based == '' ||
      information.selectedHour == '' ||
      information.selectedMinute == '00' ||
      information.recipients == '' ||
      information.notificationTypes == ''
    ) {
      this.toastr.error('Please select all fields.');
      return;
    }
    if (
      information.selectedHour == null ||
      information.selectedMinute == null ||
      information.priority_based == null ||
      information.recipients == null ||
      information.notificationTypes == null ||
      information.priority == null
    ) {
      this.toastr.error('Please select all fields.');
      return;
    }
    information.taskID = this.taskId;
    information.recipientsjson = JSON.stringify(information.recipients);
    information.notificationTypesjson = JSON.stringify(
      information.notificationTypes
    );

    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .post(`${this.apiUrl}taskReminder`, information, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              this.toastr.success('Reminder Set Successfully.');
              this.reminderOpen = false;
              this.reminderForm.reset();
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

  responsiblePersonList() {
    this.spinner.show();
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(
          `${this.apiUrl}partnerMemberList?companyID=` +
            localStorage.getItem('usercompanyId'),
          {
            headers,
          }
        )
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

  ClientList() {
    this.spinner.show();
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(
          `${this.apiUrl}clientList?companyID=` +
            localStorage.getItem('usercompanyId'),
          {
            headers,
          }
        )
        .subscribe(
          (clientslistData: any) => {
            this.clientslistData = clientslistData;
            this.clientlist = this.clientslistData?.data;
            this.team3 = this.clientslistData?.data.map(
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

  gettaskDetail(information: any) {    
    const token = localStorage.getItem('tasklogintoken');
    const Dataarray = { taskID: information };
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .post(`${this.apiUrl}taskDetail`, Dataarray, { headers })
        .subscribe(
          (response: any) => {
            if (response) {
              this.editbutton = response.edit;
              this.taskData = response.data;
          
              this.getchecklist(this.taskData.type_id);
              this.task_id = this.taskData.id;
              this.membersids = this.taskData.taskMembers.map(
                (member: { item_id: any }) => member.item_id
              );
              this.responsiblePerson = this.taskData.responsible_person.map(
                (responsiblePerson: { item_id: any }) =>
                  responsiblePerson.item_id
              );
              this.getusers(this.taskData.project_id);

              this.range.patchValue({
                start: response.data.start_date
                  ? new Date(response.data.start_date)
                  : null,
                due_date: response.data.due_date
                  ? new Date(response.data.due_date)
                  : null,
                periodic_date: response.data.periodic_date
                  ? new Date(response.data.periodic_date)
                  : null,
              });

              this.minDate = this.range.get('start')?.value;

              this.spinner.hide();
              const mapAndFilter = (dataArray: any[], teamArray: any[]) => {
                const selectedMembers = dataArray.map(
                  (member: { item_id: any }) => member.item_id
                );

                return teamArray.filter((member) => {
                  return selectedMembers.includes(Number(member.item_id));
                });
              };

              const waitForTeamData = () => {
                if (this.team1.length == 0 || this.team4.length == 0) {
                  setTimeout(waitForTeamData, 2000);
                } else {
                  this.team7 = mapAndFilter(
                    response.data.taskMembers,
                    this.team1
                  );
                  this.team8 = mapAndFilter(
                    response.data.responsible_person,
                    this.team4
                  );
                }
              };
              waitForTeamData();

              this.displayChecksListsData = [];
              this.editChecksListsData = response.data.checkList;
              
              
              if (
                this.editChecksListsData &&
                Array.isArray(this.editChecksListsData)
              ) {
                this.editChecksListsData.forEach(
                  (item: {
                    user_id: any;
                    id: any;
                    checklist_document: any;
                    taskTypeId: any;
                    checklist_name: any;
                    checklist_remark: any;
                    checklist_time_hour: any;
                    checklist_time_minute: any;
                    checklist_members_id: any;
                    checklist_responsible_person: any;
                  }) => {
                    this.displayChecksListsData.push({
                      id: item.id,
                      is_document: item.checklist_document,
                      taskTypeId: item.taskTypeId,
                      tasktypechecklist: item.checklist_name,
                      tasktyperemark: item.checklist_remark,
                      checklist_time_hour: item.checklist_time_hour,
                      checklist_time_minute: item.checklist_time_minute,
                      checklist_members_id: item.user_id || null,
                      checklist_responsible_person:
                        item.checklist_responsible_person
                          ? item.checklist_responsible_person[0]
                          : null,
                    });
                  }
                );


                this.displayChecksListsData.forEach((item: any) => {
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
                    checklist_document: [documentRequirement],
                    checklist_time_hour: [item.checklist_time_hour || ''],
                    checklist_time_minute: [item.checklist_time_minute || ''],
                    checklist_members_id: item.checklist_members_id || null,
                      checklist_responsible_person:
                        item.checklist_responsible_person.item_id || null,
                  });
                  (this.taskForm.get('checklistsForm') as FormArray).push(
                    checklistGroup
                  );
                });
              }
            }
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        );
    }
  }

  getusers(id: any) {
    const projectIds = id[0].item_id;

    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .post(
          `${this.apiUrl}projectByTaskTypeList?projectID=` + projectIds,
          {},
          { headers }
        )
        .subscribe(
          (clientslistData: any) => {
            if (clientslistData && clientslistData.data) {
              this.memberlistData = clientslistData;
              this.team5 = this.memberlistData.data.map(
                (item: { taskTypeId: any; tasktype: any }) => ({
                  item_id: item.taskTypeId,
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
      userName: [member.item_text], // Add userName
      checklistName: [checklistItem.item_text], // Add checklistName
    });

    this.prices.push(priceGroup);
  }

 
  populatePrices(data: any[]) {
    data.forEach((item) => {
      // Check if the item with the same id already exists in the form array
      const exists = this.prices.controls.some(
        (control) => control.get('id')?.value === item.id
      );

      if (!exists) {
        this.prices.push(
          this.fb.group({
            id: [item.id], // Include id field for checking duplicates
            targettimehours: [item.user_hour],
            targettimemins: [item.user_minute],
            userperhourmoney: [item.hour_per_cost],
            userids: [item.user_id],
            checklistid: [item.checklist_id],
            totalpricesuser: [item.toatal_money],
            userName: [item.userName],
            checklistName: [item.remark],
          })
        );
      }
    });
  }

  existingprice() {
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
      const targettimemins = +price.targettimemins || 0;
      const userperhourmoney = +price.userperhourmoney || 0;
      const userid = price.userids;
      const checklistid = price.checklistid;

      const totalMinutes = targettimehour * 60 + targettimemins;
      totalTargetTimeMinutes += totalMinutes;

      const costPerMinute = userperhourmoney / 60;
      const userTotalCost = totalMinutes * costPerMinute;
      totalCost += userTotalCost;

      this.computedCosts[index] = {
        userid: userid,
        checklistid: checklistid,
        overtime: userTotalCost.toFixed(0),
        current: userTotalCost.toFixed(0),
      };

      (this.prices.at(index) as FormGroup).patchValue({
        totalpricesuser: userTotalCost.toFixed(0),
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

    this.projectRemainingPrice = (
      projectprice - this.taskData.remainingtotalCost
    ).toFixed(0);

    this.remainingtotalCost = totalCost.toFixed(0);
    this.taskForm.patchValue({
      totalCost: this.remainingtotalCost,
      remainingAmount: this.projectRemainingPrice,
    });
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
        overtime: userTotalCost.toFixed(0),
        current: userTotalCost.toFixed(0),
      };

      (this.prices.at(index) as FormGroup).patchValue({
        totalpricesuser: userTotalCost.toFixed(0),
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

    this.projectRemainingPrice = (projectprice - totalCost).toFixed(0);
    this.remainingtotalCost = totalCost.toFixed(0);
  }

  isUniqueName(index: number): boolean {
    const currentName = this.prices.at(index).get('userName')?.value;
    return (
      this.prices.value.findIndex(
        (price: any) => price.userName === currentName
      ) === index
    );
  }

  isUniqueId(index: number): boolean {
    const currentid = this.prices.at(index).get('userids')?.value;
    return (
      this.prices.value.findIndex(
        (price: any) => price.userids === currentid
      ) === index
    );
  }

  removeInArray(useridss: any): void {
    const pricesArray = this.prices.value;

    const filteredArray = pricesArray.filter(
      (price: any) => price.userids !== useridss
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

  getComputedCost(
    userid: string,
    checklistid: string,
    type: 'less' | 'greater'
  ): string | null {
    const cost = this.combinedCosts.find(
      (cost: { userid: string; checklistid: string }) =>
        cost.userid === userid && cost.checklistid === checklistid
    );
    return cost ? (type === 'less' ? cost.less : cost.greater) : null;
  }

  isTimeExceeded(userid: string, checklistid: string): boolean {
    const cost = this.combinedCosts.find(
      (cost: { userid: string; checklistid: string }) =>
        cost.userid === userid && cost.checklistid === checklistid
    );
    return cost ? cost.timeExceeded === 1 : false;
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
            userName: [userhourmoneys?.item_text], // Add userName
            checklistName: [selectedMember.item_text], // Add checklistName
          });

          this.selectedMembersch.push({
            item_id: item.item_id,
            user_id: user.item_id,
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

  setusersfollow() {
    const membersIdControl = this.taskForm.get('members_id');
    if (membersIdControl) {
      membersIdControl.valueChanges.subscribe((selectedMembers) => {
        this.filterFollowingMembers(selectedMembers);
      });
    }
  }

  filterFollowingMembers(selectedMembers: any[]) {
    const selectedIds = selectedMembers.map((member) => member.item_id);
    this.filteredTeam = this.team1.filter(
      (member) => !selectedIds.includes(member.item_id)
    );
  }
  // code added by jeet for listing

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
          },
          (error) => {
            console.error('Error loading company list:', error);
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
      console.log('No token found in localStorage.');
    }
  }

  // get subtasks() {
  //   return this.taskForm.get('subtasks') as FormArray;
  // }

  // subtasksArray: {
  //   sub_due_date: any;
  //   sub_members_id: any;
  //   sub_status: any;
  //   sub_priority: any;
  //   sub_title: any
  // }[] = [];
  // addSubTask() {

  //   const arrayofsubtask = this.taskForm.get('subtasks');

  //   if (arrayofsubtask?.value.sub_title === '') {
  //     this.toastr.error('please add subtask name');
  //     return;
  //   }

  //   const newSubtask = { sub_title: arrayofsubtask?.value.sub_title, sub_due_date: this.selected, sub_members_id: arrayofsubtask?.value.sub_members_id, sub_status: arrayofsubtask?.value.sub_status, sub_priority: this.sub_priority };
  //   this.subtasksArray.push(newSubtask);
  //   arrayofsubtask?.get('sub_title')?.setValue('');
  //   arrayofsubtask?.get('sub_due_date')?.setValue(new Date());
  //   arrayofsubtask?.get('sub_members_id')?.setValue('');
  //   arrayofsubtask?.get('sub_status')?.setValue('');
  //   arrayofsubtask?.get('sub_priority')?.setValue('0');
  // }
  // removeSubtask(index: number): void {
  //   this.remainingarray = this.taskData.subTask.splice(index, 1);
  //   this.subtasksArray.push(this.remainingarray);
  // }

  // subTaskDelete(index: number): void {
  //   const token = localStorage.getItem('tasklogintoken');
  //   if (token) {
  //     const headers = new HttpHeaders()
  //       .set('Authorization', `Bearer ${token}`)
  //       .set('Accept', 'application/json');
  //     const subTaskID = { subTaskID: index };

  //     this.http
  //       .post(`${this.apiUrl}subTaskDelete`,
  //         subTaskID,
  //         { headers }
  //       )
  //       .subscribe(
  //         (response: any) => {
  //           if (response.status === true) {
  //             this.gettaskDetail(this.taskId);
  //           }
  //         },
  //         (error: any) => {
  //           this.spinner.hide();
  //           console.error('Error sending data', error);
  //         }
  //       );
  //   }
  // }

  // removeSubtask(index: number): void {
  //   this.subtasksArray.splice(index, 1);
  // }
  //  checklist code

  // checklistarray: {
  //   checkList_title: any;
  //   checkList_date: any
  // }[] = [];

  // addchecklist() {
  //   const checklist = this.taskForm.get('check_list');

  //   if (checklist?.value.checkList_title === '') {
  //     this.toastr.error('please add checklist name');
  //     return;
  //   }
  //   const newchecklist = {
  //     checkList_title: checklist?.value.checkList_title,
  //     checkList_date: this.datePipe.transform(this.selected, 'yyyy-MM-dd')
  //   };
  //   this.checklistarray.push(newchecklist);
  //   checklist?.get('checkList_title')?.setValue('');
  //   checklist?.get('checkList_date')?.setValue(new Date());
  // }

  // removechecklist(index: number) {
  //   this.taskData.checkList.splice(index, 1);
  // }

  clickOutside() {
    this.opened = !this.opened;
  }
  reminder() {
    this.opened = !this.opened;
  }
  checklist() {
    this.checklistOpened = !this.checklistOpened;
  }

  get getItems() {
    return this.countries.reduce((acc, curr) => {
      // acc[curr.item_id] = curr;
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
              this.serviceList();
            }
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        );
    }
  }

  serviceList() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(
          `${this.apiUrl}serviceList?companyID=` +
            localStorage.getItem('usercompanyId'),
          {
            headers,
          }
        )
        .subscribe(
          (noteslistData: any) => {
            this.servicelistData = noteslistData;
            this.servicelist = this.servicelistData?.data;
          },
          (error) => {}
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  getchecklist(id: any) {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      const information = {
        projectID: this.taskData.project_id[0].item_id,
        typeID: id[0].item_id,
      };

      this.http
        .post(`${this.apiUrl}projectByTypeCheckList`, information, { headers })
        .subscribe(
          (checkslistData: any) => {
            if (checkslistData && checkslistData.data) {
              this.checkslistsData = checkslistData?.data;
              // this.checkslistsData.forEach((item: { id: any; }) => {
              //   this.checkboxStates.push({ id: item.id, state: 0 });
              // });
            } else {
              console.log('Invalid response structure:', checkslistData);
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
            // Handle the response data appropriately
            this.projectslistData = projectslistData;
            this.projectslistcreated = projectslistData?.data;
            this.team2 = this.projectslistData.data.map(
              (item: { id: any; name: any; total_cost: any }) => ({
                item_id: item.id,
                item_cost: item.total_cost,
                item_text: item.name,
              })
            );
             // this.autoProjectSelect();
          },
          (error) => {
            console.error('Error loading projects list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
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
  //  user assign dropdown
  //  user assign dropdown 27-12
  showStatus = false;

  statusSelect() {
    this.showStatus = !this.showStatus;
  }
  //  user assign dropdown

  onSubmit() {
    const information = this.taskForm.value;

    if (information.members_id === '') {
      setTimeout(() => {
        this.toastr.error('Pls assign task at least one member');
      }, 10);
      return;
    }

    const token = localStorage.getItem('tasklogintoken');

    if (this.prices) {
      information.pricesestimate = this.prices.value;
    }

    if (this.remainingtotalCost) {
      information.remainingtotalCost = this.remainingtotalCost;
    }

    // Convert dates to UTC format if they are defined
    if (this.range.value.start) {
      information.start = this.toUTC(this.range.value.start);
    }
    if (this.range.value.due_date) {
      information.due_date = this.toUTC(this.range.value.due_date);
    }
    if (this.range.value.periodic_date) {
      information.periodic_date = this.toUTC(this.range.value.periodic_date);
    }

    information.taskID = this.task_id;
    information.is_cocuments = this.checkboxStates;

    const projectdatas = JSON.stringify(this.taskData.project_id[0].item_id);
    information.project_id = JSON.parse(projectdatas);

    information.type_id = this.taskData.type_id[0].item_id;

    if (!information.start || !information.due_date) {
      setTimeout(() => {
        this.toastr.error('Pls Fill Start & End Date Required Field');
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
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .post(`${this.apiUrl}taskEdit`, information, { headers })
        .subscribe(
          (response: any) => {
            if (response) {
              if (this.selectedImages) {
                this.uploadtaskkimage(this.task_id);
              } else {
                this.router.navigateByUrl('tasks');
              }
            }
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        );
    }
  }

  toUTC(date: Date): string {
    return new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();
  }

  onKeyPress(event: KeyboardEvent): void {
    // Check if the Enter key is pressed without the Shift key
    if (event.key === 'Enter' && !event.shiftKey) {
      // Prevent the default behavior of the Enter key
      event.preventDefault();

      // Call your function to submit the form
      this.commentontask(this.submitFormComment.value);
    }
  }

  uploadtaskkimage(id: any) {
    const token = localStorage.getItem('tasklogintoken');
    const formData = new FormData();
    if (id) {
      formData.append('task_id', id);
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
              this.router.navigateByUrl('tasks');
            }
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        );
    }
  }
  onFileChangeWithNull() {
    // Call onFileChange with null argument
    this.onFileChange(null);
    this.progress = 0;
    this.isUploading = false;
    this.selctedfiletype = 'null';
  }
  onFileChange(event: any) {
    if (!event) {
      // Handle null event
      // Reset variables or perform any necessary action
      this.selectedImages = null;
      this.previewfile = null;
      this.selctedfiletype = null;
      this.selctedfilename = null;
      return; // Exit the function
    }
    this.progress = 0;
    this.isUploading = true;
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const file: File = files[0];
      if (file.type.startsWith('image/')) {
        // It's an image
        this.selectedImages = file;
        this.previewfile = URL.createObjectURL(file);
        this.selctedfiletype = 'image';
      } else {
        // It's not an image, consider it as a document
        this.selectedImages = file;

        this.selctedfiletype = 'file';
        this.selctedfilename = this.selectedImages.name;
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          this.previewfile = e.target.result;
        };
        reader.readAsDataURL(file);
      }
      // Check file size limit here if needed
      if (file.size > 15 * 1024 * 1024) {
        this.toastr.error('File size exceeds the limit of 15 MB.');
        (event.target as HTMLInputElement).value = '';
        this.selectedImages = null; // Reset the selected file
        this.previewfile = null; // Reset the preview URL
        this.selctedfiletype = null; // Reset the file type
      }
    }
  }

  enabledforedit() {
    this.isEditEnabled = !this.isEditEnabled;
    this.isHidden = !this.isHidden;
  }

  // voice chat 6-1-24

  // voice chat
  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  // * Start recording.*/
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
  /**
   * Will be called automatically.
   */
  successCallback(stream: MediaStream) {
    var options = {
      mimeType: 'audio/wav' as
        | 'audio/wav'
        | 'audio/webm'
        | 'audio/webm;codecs=pcm',
      numberOfAudioChannels: 1 as 1 | 2 | undefined,
      sampleRate: 44100,
    };

    // Start Actual Recording
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;

    // Corrected: Use the correct Options type
    var recordOptions: RecordRTC.Options = {
      mimeType: options.mimeType,
      numberOfAudioChannels: options.numberOfAudioChannels,
      sampleRate: options.sampleRate,
    };

    this.record = new StereoAudioRecorder(stream, recordOptions);
    this.record.record();
  }
  /**
   * Stop recording.
   */
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
    this.url = URL.createObjectURL(blob);

    if (blob instanceof Blob) {
      this.url = URL.createObjectURL(blob);

      // Assuming this.url is set as in the previous example
      const formData = new FormData();
      formData.append('comment', blob, 'recorded_audio.wav');
      formData.append('is_comment', 'audio');
      formData.append('task_id', this.task_id);

      // Submit the recording data without appending it to the HTML
      this.commentontask(formData);
    }

    // Assuming this.url is set as in the previous example
    const appendRecordingElement = document.getElementById('appendrecording');

    if (appendRecordingElement) {
      const audioElement = document.createElement('audio');
      audioElement.controls = true;

      const sourceElement = document.createElement('source');
      sourceElement.type = 'audio/wav';

      // Unwrap the SafeResourceUrl using DomSanitizer.bypassSecurityTrustResourceUrl
      sourceElement.src = this.url;

      audioElement.appendChild(sourceElement);
      appendRecordingElement.appendChild(audioElement);
    }
  }
  /**
   * Process Error.
   */
  errorCallback(error: any) {
    this.error = 'Can not play audio in your browser';
  }

  // voice chat

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
      const projectID = { subTaskID: id, completed: 1 };

      this.http
        .post(`${this.apiUrl}subTaskCompleted`, projectID, { headers })
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
                this.toastr.success('Sub Task Completed Successfully.');
              }, 10);
              location.reload();
            }
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        );
      // .add(() => (this.loading = false));
    }
  }

  deletetaskchecklistsopendialogue(id: any) {
    this.selectedTaskchecklistId = id;
    const modal = document.getElementById('deleteprojectModal');
  }

  confirmDeleteChecklist(): void {
    if (this.selectedTaskchecklistId) {
      this.deleteselectedTaskchecklistId(this.selectedTaskchecklistId);
    }
  }

  deleteselectedTaskchecklistId(id: any) {
    // this.loading = true; // Start loader
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const projectID = { checkListID: id, completed: 1 };

      this.http
        .post(`${this.apiUrl}checkListCompleted`, projectID, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick =
                this.elementRef.nativeElement.querySelector(
                  '.popup_close_btn_delete_checklist'
                );
              if (elementToClick) {
                elementToClick.click();
              }
              setTimeout(() => {
                this.toastr.success('Sub Task Completed Successfully.');
              }, 10);
              location.reload();
            }
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        );
      // .add(() => (this.loading = false));
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

    // Create the comment structure
    const commentElement = document.createElement('div');
    commentElement.className = 'comment me';
    commentElement.id = commentId;

    const shortNameElement = document.createElement('div');
    shortNameElement.className = 'user_short_name';
    shortNameElement.textContent = this.getshortname() ?? 'DefaultShortName'; // Use a default value if getshortname() is undefined

    const bubbleElement = document.createElement('div');
    bubbleElement.className = 'bubble';
    bubbleElement.textContent = text;

    commentElement.appendChild(shortNameElement);
    commentElement.appendChild(bubbleElement);

    // Append the comment structure to the parent element
    const parentElement = document.getElementById('appendtext');
    if (parentElement) {
      parentElement.appendChild(commentElement);
    }
  }

  commenttask() {
    const id = this.route.snapshot.paramMap.get('id');
    this.edittaskid = id;
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}taskCommentList?task_id=` + id, { headers })
        .subscribe(
          (response: any) => {
            this.taskCommentData = response?.data;
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

  getDateKeys(): string[] {
    return Object.keys(this.taskCommentData);
  }

  commentontask(formData: any) {
    if (formData && formData.is_comment == null && formData.extension == null) {
      formData.is_comment = 'text';
    }

    const token = localStorage.getItem('tasklogintoken');
    if (!token) {
      console.log('No token found in localStorage.');
      return;
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    if (formData) {
      formData.task_id = this.route.snapshot.paramMap.get('id');
      this.http
        .post(`${this.apiUrl}taskComment`, formData, { headers })
        .subscribe(
          (response: any) => {
            this.submitFormComment.get('comment')?.setValue('');

            setTimeout(() => {
              this.toastr.success('Comment Added Successfully.');
            }, 10);
            this.taskCommentData = response.data;
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        )
        .add(() => (this.loading = false));
    } else {
      this.http
        .get(`${this.apiUrl}taskCommentList?task_id=` + this.edittaskid, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.submitFormComment.get('comment')?.setValue('');
            setTimeout(() => {
              this.toastr.success('Comment Added Successfully.');
            }, 10);
            this.taskCommentData = response.data;
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        )
        .add(() => (this.loading = false));
    }
  }
  uploadtaskcomment(event: any) {
    const file = (event.target as HTMLInputElement).files?.item(0);

    if (file) {
      const reader = new FileReader();

      const fileName = file.name;
      const fileExtension = fileName.split('.').pop();
      let filenamesends = fileName.split('/');
      let filenamesend = filenamesends[filenamesends.length - 1];

      // Split the filename by the '.' character to get an array of filename parts
      let filenameParts = filenamesend.split('.');

      // Get the first part which should be the filename without the extension
      let filenamepost = filenameParts[0];

      reader.onload = (e) => {
        // Set the Base64 string in the comment field
        this.submitFormComment.get('comment')?.setValue(e.target?.result);
        this.submitFormComment.get('is_comment')?.setValue('file');
        this.submitFormComment.get('extension')?.setValue(fileExtension);
        this.submitFormComment.get('filename')?.setValue(filenamepost);

        // Call commentontask() after the file is loaded
        this.commentontask(this.submitFormComment.value);
      };

      // Read the file as Data URL (Base64)
      reader.readAsDataURL(file);
    }
  }

  setfilter() {
    const selectedHour = this.reminderForm.value.selectedHour;
    const selectedMinute = this.reminderForm.value.selectedMinute;
    const recipients = this.reminderForm.value.recipients;
    const notificationTypes = this.reminderForm.value.notificationTypes;

    // Create the payload
    const payload = {
      selectedHour,
      selectedMinute,
      recipients,
      notificationTypes,
    };
  }

  onCheckboxChange(event: any, id: number) {
    const state = event.target.checked ? 1 : 0;

    const index = this.checkboxStates.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.checkboxStates.splice(index, 1);
    }
    this.checkboxStates.push({ id, state });
  }

  drop(event: CdkDragDrop<any[]>) {
    const formArray = this.taskForm.get('checklistsForm') as FormArray;
    const controlsCopy = formArray.controls.slice();
    moveItemInArray(controlsCopy, event.previousIndex, event.currentIndex);
    formArray.clear();
    controlsCopy.forEach((control) => {
      formArray.push(control);
    });
  
   
  }
  
  updateassignlist(selectedValue: any): void {
    this.team7 = selectedValue;
  }
  updateresponpersonlist(selectedValue: any): void {
    this.team8 = selectedValue;
  }
}
