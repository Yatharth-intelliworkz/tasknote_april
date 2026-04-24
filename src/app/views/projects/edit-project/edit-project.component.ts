import { Component, ViewChild, TemplateRef, ElementRef, Renderer2, OnInit, NgModule } from '@angular/core';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
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


@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss'],
  standalone: true,
  imports: [NgSelectModule, NgbRatingModule, CdkDropList, CdkDrag, MatSlideToggleModule, RouterModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, NgFor, NgMultiSelectDropDownModule, ReactiveFormsModule, NgIf, NgxSpinnerModule, MatMenuModule, DatePipe, MatCheckboxModule]
})

export class EditProjectComponent {

  @ViewChild('slideToggle') slideToggle!: MatSlideToggle;
  @ViewChild('checklistModal') checklistModal!: ElementRef;


  private apiUrl = environment.ApiUrl;
  addprojectForm!: FormGroup;
  projectForm!: FormGroup;
  projectFormchecklist!: FormGroup;
  servicelistData: any;
  tasktypelist: any;
  projectslistData: any;
  projectslistcreated: any;
  projectslistassigned: any;
  selectedImage: File | null = null;
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
  projectlistedit: any;
  editprojectlistData: any;
  filteredChecklistArray: any[] = [];
  showTaskTypeError = false;
  showHoursError = false;
  showCostError = false;
  submitted = false;

  constructor(private elementRef: ElementRef, private toastr: ToastrService, private spinner: NgxSpinnerService, private http: HttpClient, private fb: FormBuilder, private commonService: CommonService, private route: ActivatedRoute, private router: Router) {
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
      servic_id: [null, Validators.required],
      total_cost: [null, Validators.required],
      tasktypedata: this.fb.array([]),
      remark: [''],
      tasktypechecklistarrayDisplay: [''],
      tasktypechecklistarray: [''],
      tasktypechecklistarraystore: [''],
      task_description: [''],
      tasktype: [null],
      hours: [null],
      cost: [null],
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
    this.editproject();
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
    this.submitted = true;
    this.spinner.show();

    // Ensure members_id is patched from membersName before validation
    if (!this.addprojectForm.get('members_id')?.value && this.membersName) {
      this.addprojectForm.get('members_id')?.setValue(this.membersName);
    }

    if (this.addprojectForm.invalid) {
      this.addprojectForm.markAllAsTouched();
      this.spinner.hide();
      return;
    }

    if (!this.tryAddDraftTaskTypeRow()) {
      this.spinner.hide();
      return;
    }

    const hasDraftTaskTypeRow = !!(
      this.addprojectForm.get('tasktype')?.value ||
      this.addprojectForm.get('hours')?.value ||
      this.addprojectForm.get('cost')?.value ||
      this.addprojectForm.get('remark')?.value ||
      this.addprojectForm.get('task_description')?.value
    );

    if (this.tasktypedata.length === 0) {
      this.showTaskTypeError = false;
      this.showHoursError = false;
      this.showCostError = false;
    }

    const formData = new FormData();
    const companyID = localStorage.getItem('usercompanyId');
    const selectedmanager = this.addprojectForm.get('manager_id')?.value;
    const normalizedManagerIds = Array.isArray(selectedmanager)
      ? selectedmanager
      : selectedmanager
        ? [selectedmanager]
        : [];
    if (companyID) {
      formData.append('companyId', companyID);
    }
    const projectID = this.addprojectForm.get('projectID')?.value;

    // Always send taskType and checkList (even if empty arrays) to avoid backend null errors
    formData.set('taskType', JSON.stringify(this.tasktypedata.value));
    formData.set('checkList', JSON.stringify(this.tasktypechecklistarray || []));

    formData.set('total_cost', this.addprojectForm.get('total_cost')?.value);
    const managerItems = normalizedManagerIds.map((id: any) => ({ item_id: id }));
    Object.keys(information).forEach((key) => {
      if (key === 'manager_id' || key === 'managers_id' || key === 'tasktypedata') {
        return;
      }
      formData.append(key, information[key]);
    });
    formData.set('manager_id', normalizedManagerIds.join(','));
    formData.set('managers_id', JSON.stringify(managerItems));
    formData.set('is_sender', '1');

    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http.post(`${this.apiUrl}projectEdit`, formData, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              this.submitted = false;
              this.toastr.success('Project Updated Successfully.');
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

  isFieldInvalid(fieldName: string): boolean {
    const control = this.addprojectForm.get(fieldName);
    if (!control || (!this.submitted && !control.touched)) {
      return false;
    }

    return this.isEmptyValue(control.value);
  }

  private isEmptyValue(value: any): boolean {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    if (value === null || value === undefined) {
      return true;
    }

    if (typeof value === 'string') {
      return value.trim().length === 0;
    }

    return false;
  }

  private tryAddDraftTaskTypeRow(): boolean {
    const taskTypeId = this.addprojectForm.get('tasktype')?.value;
    const hours = this.addprojectForm.get('hours')?.value;
    const cost = this.addprojectForm.get('cost')?.value;
    const remark = this.addprojectForm.get('remark')?.value;
    const taskDescription = this.addprojectForm.get('task_description')?.value;

    const hasDraftTaskTypeRow = !!(taskTypeId || hours || cost || remark || taskDescription);
    if (!hasDraftTaskTypeRow) {
      return true;
    }

    this.showTaskTypeError = false;
    this.showHoursError = false;
    this.showCostError = false;

    if (!taskTypeId) {
      this.showTaskTypeError = true;
      return false;
    }
    if (!hours) {
      this.showHoursError = true;
      return false;
    }
    if (!cost) {
      this.showCostError = true;
      return false;
    }

    const duplicate = this.tasktypedata.value.find((item: any) => item.taskTypeId === taskTypeId);
    if (duplicate) {
      return true;
    }

    const tasktypeName = this.tasktypelist.find((task: TaskType) => task.id === taskTypeId)?.title || '';
    this.tasktypedata.push(this.fb.group({
      remark: [remark],
      hours: [hours],
      tasktype: [tasktypeName],
      cost: [cost],
      taskTypeId: [taskTypeId],
      tasktypeDescription: [taskDescription],
    }));

    this.addprojectForm.get('remark')?.setValue('');
    this.addprojectForm.get('tasktype')?.setValue('');
    this.addprojectForm.get('hours')?.setValue('');
    this.addprojectForm.get('cost')?.setValue('');
    this.addprojectForm.get('task_description')?.setValue('');
    this.showTaskTypeError = false;
    this.showHoursError = false;
    this.showCostError = false;

    return true;
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
    this.showTaskTypeError = false;
    this.showHoursError = false;
    this.showCostError = false;
    if (!this.addprojectForm?.value.tasktype) {
      this.showTaskTypeError = true;
      return;
    }
    if (!this.addprojectForm?.value.hours) {
      this.showHoursError = true;
      return;
    }
    if (!this.addprojectForm?.value.cost) {
      this.showCostError = true;
      return;
    }
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
      tasktypeDescription: taskdescription,
    };


    const priceGroup = this.fb.group({
      remark: [this.addprojectForm?.value.remark],
      hours: [this.addprojectForm?.value.hours],
      tasktype: [tasktypeName],
      cost: [this.addprojectForm?.value.cost],
      taskTypeId: [tasktypeId],
      tasktypeDescription: [this.addprojectForm?.value.task_description],
    });


    this.tasktypedata.push(priceGroup);

    this.addprojectForm?.get('remark')?.setValue('');
    this.addprojectForm?.get('tasktype')?.setValue('');
    this.addprojectForm?.get('hours')?.setValue('');
    this.addprojectForm?.get('cost')?.setValue('');
    this.addprojectForm?.get('task_description')?.setValue('');
    this.showTaskTypeError = false;
    this.showHoursError = false;
    this.showCostError = false;
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
    taskTypeId: number;
    tasktypechecklist: '';
    tasktyperemark: '';
    is_document: string;
  }[] = [];

  tasktypechecklistarrayDisplay: {
    tasktypechecklist: '';
    tasktyperemark: '';
    is_document: string;
  }[] = [];

  tasktypechecklistarraystore: {
    taskTypeId: number;
    tasktypechecklist: '';
    tasktyperemark: '';
    is_document: string;
  }[] = [];

  removeItem(index: number, arrayName: 'tasktypedata' | 'tasktypechecklistarray' | 'tasktypechecklistarraystore') {
    if (arrayName === 'tasktypedata') {
      const removedTaskTypeId = (this[arrayName] as FormArray).at(index)?.get('taskTypeId')?.value;
      (this[arrayName] as FormArray).removeAt(index);

      if (removedTaskTypeId) {
        this.tasktypechecklistarray = this.tasktypechecklistarray.filter(
          (item: { taskTypeId: number }) => item.taskTypeId !== removedTaskTypeId
        );
        this.filteredChecklistArray = this.filteredChecklistArray.filter(
          (item: { taskTypeId: number }) => item.taskTypeId !== removedTaskTypeId
        );
      }
    } else {
      (this[arrayName] as any[]).splice(index, 1);
    }
    this.tasktypechecklistarray = [...this.tasktypechecklistarray]; // Force update the array reference
  }
  removeItemsd(index: number, arrayName: 'filteredChecklistArray') {
      (this[arrayName] as any[]).splice(index, 1);
    this.filteredChecklistArray = [...this.filteredChecklistArray]; // Force update the array reference
    this.tasktypechecklistarray = [...this.filteredChecklistArray]; // Force update the array reference

  }


  addChecklistTaskType(types: any) {
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
      taskTypeId: this.projectFormchecklist?.value.taskinchecklist
    };

    this.tasktypechecklistarray.push(newChecklist);
    this.filteredChecklistArray = this.tasktypechecklistarray.filter(
      (item: { taskTypeId: number }) => item.taskTypeId == this.currentChecklistIndex
    );
    this.projectFormchecklist?.get('tasktypechecklist')?.setValue('');
    this.projectFormchecklist?.get('tasktyperemark')?.setValue('');
    this.projectFormchecklist?.get('is_documentupload')?.setValue('');
  }

  isTaskTypeAvailable(taskTypeId: number): boolean {
    return this.tasktypechecklistarray.some(item => item.taskTypeId === taskTypeId);
  }


  openModal(tasktypeid: any): void {
    this.currentChecklistIndex = tasktypeid;

    this.filteredChecklistArray = this.projectlistedit.checkListData.filter((item: { taskTypeId: number }) => item.taskTypeId == tasktypeid);

    const modalElement = this.checklistModal.nativeElement;
    const modal = new bootstrap.Modal(modalElement);

    modal.show();

    modalElement.addEventListener('hidden.bs.modal', () => {
      this.resetToggle();
    });
  }

  dataFilters(tasktypeid: any) {
    const filteredData = this.projectlistedit.checkListData.filter((item: { taskTypeId: number }) => item.taskTypeId === tasktypeid);
    this.tasktypechecklistarrayDisplay = filteredData;
  }

  resetToggle(): void {
    this.currentChecklistIndex = null;
    // this.tasktypechecklistarray = [];
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

  editproject() {
    this.spinner.show();
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Accept', 'application/json');

      this.http.get(`${this.apiUrl}projectGet?projectID=${this.route.snapshot.paramMap.get('id')}`, { headers }).subscribe(
        (editstatuslistData: any) => {
          this.editprojectlistData = editstatuslistData;
          this.projectlistedit = this.editprojectlistData?.data;
          this.projectlistedit.start_date = parseDate(this.projectlistedit.start_date, 'dd-MM-yyyy', new Date());
          this.projectlistedit.end_date = parseDate(this.projectlistedit.end_date, 'dd-MM-yyyy', new Date());

          this.projectlistedit.typeListData.forEach((item: { remark: any; taskTypeId: any; cost: any; tasktype: any; hours: any; tasktypeDescription : any }) => {

            this.tasktypedata.push(this.fb.group({
              remark: [item.remark],
              taskTypeId: [item.taskTypeId],
              cost: [item.cost],
              tasktype: [item.tasktype],
              hours: [item.hours],
              tasktypeDescription: [item.tasktypeDescription],
            }));
          });
          this.tasktypechecklistarray = this.projectlistedit.checkListData;

           this.managerName = this.projectlistedit.managerName.map(
            (member: { item_id: any }) => member.item_id
          );
        
          this.membersName = this.projectlistedit.membersName || [];
          this.checklistarray = this.projectlistedit.checkList || [];

          // Patch form controls with loaded data so validators pass on submit
          this.addprojectForm.patchValue({
            name: this.projectlistedit.name,
            projectID: this.projectlistedit.id,
            total_cost: this.projectlistedit.total_cost,
            servic_id: this.projectlistedit.service_id,
            manager_id: this.managerName,
            members_id: this.membersName,
            description: this.projectlistedit.description,
            start_date: this.projectlistedit.start_date,
            end_date: this.projectlistedit.end_date,
          });

          // Assuming start_date and end_date are Date objects after parsing
          const formattedDob = formatDate(
            this.projectlistedit.start_date,
            'yyyy-MM-dd\'T\'HH:mm:ss.SSSXXX'
          );
          this.projectlistedit.start_date = formattedDob;

          const formattedend_date = formatDate(
            this.projectlistedit.end_date,
            'yyyy-MM-dd\'T\'HH:mm:ss.SSSXXX'
          );
          this.projectlistedit.end_date = formattedend_date;
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          console.error('Error fetching project details', error);
        }
      );
    }
  }

}