import { Component, ViewChild, TemplateRef, ElementRef, Renderer2, OnInit, NgModule } from '@angular/core';
import { NgbRatingModule, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { format as formatDate, parse as parseDate } from 'date-fns';
import { FormatWidth } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Pusher from 'pusher-js';
import { DateAdapter } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../service/common.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { NgSelectModule } from '@ng-select/ng-select';

declare var bootstrap: any;

interface Client {
  item_id: any;
  item_text: string;
}
interface Reference {
  item_id: any;
  item_text: string;
  item_type: string;
}

interface TaskType {
  id: number;
  title: string;
}

interface TaskTypeChecklist {
  tasktypechecklist: string;
  tasktyperemark: string;
  is_document: string;
  tasktypeIdck: number;
}

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
  standalone: true,
  imports: [NgbRatingModule, CdkDropList, CdkDrag, MatSlideToggleModule, RouterModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, NgFor, NgMultiSelectDropDownModule, ReactiveFormsModule, NgIf, NgxSpinnerModule, MatMenuModule, DatePipe, MatCheckboxModule, NgSelectModule]
})
export class AddProjectComponent {

  @ViewChild('checklistModal') slideToggle!: MatSlideToggle;
  @ViewChild('checklistModal') checklistModal!: ElementRef;
  @ViewChild('checklistViews') checklistViews!: ElementRef;
  @ViewChild('body') body!: ElementRef;


  private apiUrl = environment.ApiUrl;
  addprojectForm!: FormGroup;
  projectForm!: FormGroup;
  projectFormchecklist!: FormGroup;
  servicelistData: any;
  tasktypelist: any;
  projectslistData: any;
  projectslistcreated: any;
  projectslistassigned: any;
  loading = false;
  team1: Array<Client> = [];
  team3: Array<Reference> = [];
  managerName: { id: number; name: string }[] = [];
  membersName: { id: number; name: string }[] = [];
  tasktypeData: any;
  dropdownSettings1: any = {};
  dropdownSettings2: any = {};
  dropdownSettings3: any = {};
  selectedTaskTitle: string = '';
  hours: number[] = Array.from({ length: 24 }, (_, i) => i + 1); // Array of hours from 1 to 24
  memberlistData: any;
  currentChecklistIndex: number | null = null;
  isView: any;
  filteredChecklistArray: any[] = [];

  constructor(private elementRef: ElementRef, private toastr: ToastrService, private spinner: NgxSpinnerService, private http: HttpClient, private fb: FormBuilder, private commonService: CommonService, private renderer: Renderer2, private router: Router
  ) {
    this.loadProjectsList();
    this.spinner.show();
    this.addprojectForm = this.fb.group({
      name: [null, Validators.required],
      manager_id: [null, Validators.required],
      members_id: [null, Validators.required],
      start_date: [null, Validators.required],
      end_date: [null, Validators.required],
      description: [null, Validators.required],
      projectID: '',
      servic_id: '',
      total_cost: '',
      tasktypedata: this.fb.array([]),
      remark: [''],
      tasktype: [null, Validators.required],
      hours: [null, Validators.required],
      cost: [''],
      tasktypechecklistarray: [''],
      tasktypechecklistarraystore: [''],
      tasktypechecklistarrayDisplay: [''],
      task_description: [''],

    });

    this.projectFormchecklist = this.fb.group({
      tasktypechecklist: [''],
      tasktyperemark: [''],
      is_documentupload: [],
      taskinchecklist: [''],
    });

    this.dropdownSettings2 = {
      singleSelection: true,
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
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };
    this.dropdownSettings1 = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 2,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };
    this.gettasktype();
    this.getmemberlist();
    this.serviceList();
  }
  isNumberKey(event: KeyboardEvent): boolean {
    const char = event.key;
    if (char < '0' || char > '99') {
      event.preventDefault();
      return false;
    }
    return true;
  }

  validateRange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);
    // Enforce minimum and maximum range
    if (value < 0) {
      value = 0;
    } else if (value > 99) {
      value = 99;
    }
    this.addprojectForm.get('hours')?.setValue(value);

  }


  addproject(information: any) {
    this.spinner.show();
    if (this.addprojectForm.invalid) {
      this.toastr.error('Fill required fields.');
      this.spinner.hide();
      return;
    }
    const formData = new FormData();
    const companyID = localStorage.getItem('usercompanyId');
    const selectedmanager = this.addprojectForm.get('manager_id')?.value;
    if (companyID) {
      formData.append('companyId', companyID);
    }


    if (this.tasktypedata.value.length !== 0) {
      const selectedcheckList = this.tasktypedata.value;
      formData.set('taskType', JSON.stringify(selectedcheckList));
    }

    if (this.tasktypechecklistarraystore) {
      const tasktypechecklistarray = this.tasktypechecklistarraystore;
      formData.set('checkList', JSON.stringify(tasktypechecklistarray));
    }


    formData.set('total_cost', this.addprojectForm.get('total_cost')?.value);

    // formData.set('members_id', this.addprojectForm.get('members_id')?.value);

    Object.keys(information).forEach((key) => {
      formData.append(key, information[key]);
    });
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http.post(`${this.apiUrl}projectAdd`, formData, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              this.addprojectForm.reset();
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_project_add');
              if (elementToClick) {
                elementToClick.click();
              }
              this.toastr.success('Project Added Successfully.');
              this.loadProjectsList();
              this.router.navigate(['/projects']);
            }
            if (response.status === false && response.code == 210) {
              this.toastr.error('Project name already exist.')
            }
            this.spinner.hide();
          },
          (error: any) => {
            if (error.status === false && error.code == 210) {
              this.toastr.error('Project name already exist.')
            }
            this.spinner.hide();
            console.error('Error sending data', error);
          }
        );
    }
  }

  serviceList() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}serviceList?companyID=` + localStorage.getItem('usercompanyId'), {
          headers,
        })
        .subscribe(
          (serviceListData: any) => {
            this.servicelistData = serviceListData.data;
            this.spinner.hide();
          },
          (error: any) => {
            this.spinner.hide();
          }
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }

  checklistarray: {
    remark: '';
    hours: '';
    tasktype: '';
    cost: '';
  }[] = [];

  get tasktypedata(): FormArray {
    return this.addprojectForm.get('tasktypedata') as FormArray;
  }

  addChecklist(type: any) {

    this.isView = false;
    if (!this.addprojectForm?.value.tasktype) {
      this.toastr.error('Please Select Task Type');
      return;
    }
    // if (!this.addprojectForm?.value.hours) {
    //   this.toastr.error('Please Select Task Hours');
    //   return;
    // }

    const tasktypeId = this.addprojectForm?.value.tasktype;
    const datacheck = this.tasktypedata.value;
    const taskdescription = this.addprojectForm?.value.task_description;

      const duplicate = datacheck.find((item: any) => item.taskTypeId === tasktypeId);
      if (duplicate) {
        this.toastr.error('Task Type already exists');
        return;
      }

    const tasktypeName = this.tasktypelist.find((task: TaskType) => task.id === tasktypeId)?.title || '';

    const newChecklist = {
      remark: this.addprojectForm?.value.remark,
      hours: this.addprojectForm?.value.hours,
      cost: this.addprojectForm?.value.cost,
      tasktype: tasktypeName,
      taskTypeId: tasktypeId,
      taskdescription: taskdescription,
    };
    


    const priceGroup = this.fb.group({
      remark: [this.addprojectForm?.value.remark],
      hours: [this.addprojectForm?.value.hours],
      tasktype: [tasktypeName],
      cost: [this.addprojectForm?.value.cost],
      taskTypeId: [tasktypeId],
      taskdescription: [this.addprojectForm?.value.task_description],
    });


    this.tasktypedata.push(priceGroup);

    this.addprojectForm?.get('remark')?.setValue('');
    this.addprojectForm?.get('tasktype')?.setValue('');
    this.addprojectForm?.get('hours')?.setValue('');
    this.addprojectForm?.get('cost')?.setValue('');
    this.addprojectForm?.get('task_description')?.setValue('');
    setTimeout(() => {
    this.body.nativeElement.click();
    }, 100);
  }


  onSelectionChange(event: any): void {
    const selectedTask = this.tasktypelist.find((task: TaskType) => task.id === event.value);
    if (selectedTask) {
      this.selectedTaskTitle = selectedTask.title;
    }
  }
  removechecklist(index: number) {
    this.checklistarray.splice(index, 1);
  }
  removechecklisttasktype(index: number) {
    this.tasktypechecklistarray.splice(index, 1);
  }

  loadProjectsList() {
    this.spinner.show();
    this.loading = true; // Start loader
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(`${this.apiUrl}projectList?companyID=` + localStorage.getItem('usercompanyId'), { headers })
        .subscribe(
          (projectslistData: any) => {
            // Handle the response data appropriately
            this.projectslistData = projectslistData;
            this.projectslistcreated = projectslistData?.data.CreatedByMe;
            this.projectslistassigned = projectslistData?.data.AssigneeMe;
            this.loading = false; // Start loader
            this.spinner.hide();
          },
          (error: any) => {
            this.spinner.hide();
            // Handle errors appropriately
            console.error('Error loading projects list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }
  gettasktype() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}taskTypeList?companyID=` + localStorage.getItem('usercompanyId'), {
          headers,
        })
        .subscribe(
          (noteslistData: any) => {
            this.tasktypeData = noteslistData;
            this.tasktypelist = this.tasktypeData?.data;
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


  tasktypechecklistarray: {
    tasktypechecklist: '';
    tasktyperemark: '';
    is_document: string;
  }[] = [];

  tasktypechecklistarrayDisplay: {
    tasktypechecklist: '';
    tasktyperemark: '';
    is_document: string;
    tasktypeIdck: number;
  }[] = [];

  tasktypechecklistarraystore: {
    tasktypechecklist: '';
    tasktyperemark: '';
    is_document: string;
    tasktypeIdck: number;
  }[] = [];

  removeItem(index: number, arrayName: 'tasktypedata' | 'tasktypechecklistarray' | 'tasktypechecklistarraystore') {
    if (arrayName === 'tasktypedata') {
      (this[arrayName] as FormArray).removeAt(index);
    } else {
      (this[arrayName] as any[]).splice(index, 1);
    }
  }
  addChecklistTaskType(types: any) {

    this.isView = true;
    if (!this.projectFormchecklist?.value.tasktypechecklist) {
      this.toastr.error('Please Enter Checklist');
      return;
    }
    if (!this.projectFormchecklist?.value.taskinchecklist) {
      this.toastr.error('Please select task type');
      return;
    }

    const document = this.projectFormchecklist?.value.is_documentupload ? 'Document Required' : 'No Document Required';
    const newChecklist = {
      tasktypechecklist: this.projectFormchecklist?.value.tasktypechecklist,
      tasktyperemark: this.projectFormchecklist?.value.tasktyperemark,
      is_document: document,
      tasktypeIdck: this.projectFormchecklist?.value.taskinchecklist
    };

    // Add the new checklist to the main store
    this.tasktypechecklistarraystore.push(newChecklist);

    // Re-filter after adding new checklist
    this.filteredChecklistArray = this.tasktypechecklistarraystore.filter(
      (item: { tasktypeIdck: number }) => item.tasktypeIdck == this.currentChecklistIndex
    );

    // Reset the form controls
    this.projectFormchecklist?.get('tasktypechecklist')?.setValue('');
    this.projectFormchecklist?.get('tasktyperemark')?.setValue('');
    this.projectFormchecklist?.get('is_documentupload')?.setValue('');
  }

  isTaskTypeAvailable(taskTypeId: number): boolean {
    return this.tasktypechecklistarraystore.some(item => item.tasktypeIdck === taskTypeId);
  }


  openModal(tasktypeid: any): void {
    this.currentChecklistIndex = tasktypeid;

    const modalElement = this.checklistModal.nativeElement;
    const modal = new bootstrap.Modal(modalElement);

    // Filter based on tasktypeid
    this.filteredChecklistArray = this.tasktypechecklistarraystore.filter(
      (item: { tasktypeIdck: number }) => item.tasktypeIdck == tasktypeid
    );

    modal.show();
  }


  dataFilters(tasktypeid: any) {
    const filteredData = this.tasktypechecklistarraystore.filter((item: { tasktypeIdck: number }) => item.tasktypeIdck == tasktypeid);
    if (filteredData.length === 0) {
      this.toastr.error('Data Not Added');
      return
    }

    const modalElement = this.checklistViews.nativeElement;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    this.tasktypechecklistarrayDisplay = filteredData;
  }

  resetToggle(): void {
    this.currentChecklistIndex = null;
    this.tasktypechecklistarray = [];
    if (this.slideToggle) {
      this.slideToggle.checked = false;
    }
  }


  getmemberlist() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}comapnyMemberList?companyID=` + localStorage.getItem('usercompanyId'), {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.memberlistData = clientslistData;
            this.team1 = this.memberlistData.data.map((item: { id: any; name: any; }) => ({
              item_id: item.id,
              item_text: item.name,
            }));
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
          }
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }
}
