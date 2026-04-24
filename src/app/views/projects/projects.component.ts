import { Component, ViewChild, TemplateRef, ElementRef, Renderer2, OnInit } from '@angular/core';
import { NgbRatingModule, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonService } from '../service/common.service';
import { ProjectlistService } from '../service/projectlist.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { format as formatDate, parse as parseDate } from 'date-fns';
import { FormatWidth } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../service/notification.service';
import Pusher from 'pusher-js';
import { DateAdapter } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';

interface Memeber {
  item_id: any;
  item_text: string;
  image: string;
  isDisabled?: boolean;
}
interface Client {
  item_id: any;
  item_text: string;
}
interface Reference {
  item_id: any;
  item_text: string;
  item_type: string;
}


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  standalone: true,
  imports: [NgbRatingModule, CdkDropList, CdkDrag, MatSlideToggleModule, RouterModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, NgFor, NgMultiSelectDropDownModule, ReactiveFormsModule, NgIf, NgxSpinnerModule, MatMenuModule, DatePipe,ReactiveFormsModule],
  styles: [
    `
			i {
				font-size: 1.5rem;
				/* padding-right: 0.1rem; */
				color: #b0c4de;
			}
			.filled {
				color: #1e90ff;
			}
			.low {
				color: #deb0b0;
			}
			.filled.low {
				color: #ff1e1e;
			}
		`,
  ],

})
export class ProjectsComponent implements OnInit {
  @ViewChild('checklistData', { static: true }) checklistData!: ElementRef;
  @ViewChild('listChecklistData', { static: true }) listChecklistData!: ElementRef;
  [x: string]: any;
  private pushID = environment.pushID
  private apiUrl = environment.ApiUrl;
  currentRate = 0;
  projectslistData: any;
  projectslistcreated: any;
  projectslistassigned: any;
  clientlistData: any;
  managerlistData: any;
  servicelistData: any;
  tasktypelist: any;
  tasktypeData: any;
  memberlist: any;
  memberlistData: any;
  data = [];
  selectedProjectId: any;
  selectedManagerckl: any;
  selectedMembersckl: any;
  projectlistedit: any = {
    name: null,
    cost: null,
    manager_id: null,
    members_id: null,
    start_date: null,
    end_date: null,
    description: null,
  }

  // peoject masnager list
  searchForm!: FormGroup;

  fileForm!: FormGroup;
  managerName: { id: number; name: string }[] = [];

  membersName: { id: number; name: string }[] = [];
  selectedItems2: Memeber[] = [];
  team: Array<Client> = [];
  team1: Array<Client> = [];
  team3: Array<Reference> = [];
  clients: Array<Client> = [];
  selectedImage: File | null = null;
  addprojectForm!: FormGroup;
  projectForm: FormGroup;
  editprojectlistData: any;
  dropdownSettings1: any = {};
  dropdownSettings2: any = {};
  dropdownSettings3: any = {};
  filteredMembers: Array<Client> = [];
  filteredclients: Array<Client> = [];
  loading = false; // Start loader
  selected!: Date | null;
  checkListselected!: Date | null;
  mergedArray: any;
  referencelistData: any;
  // peoject masnager list

  constructor(
    private offcanvasService: NgbOffcanvas,
    private router: Router,
    private commonService: CommonService,
    private projectListService: ProjectlistService,
    private http: HttpClient,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private notificationService: NotificationService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-In');
    this.spinner.show();
    this.loadProjectsList();
    this.getmanager();
    this.getmemberlist();
    // this.referenceByList();
    this.serviceList();
    this.gettasktype();
    // project manager list

    this.searchForm = this.formBuilder.group({
      searchQueryControl: [''] // Initialize with empty string
    });

    this.fileForm = this.formBuilder.group({
      multiplefile: ['initialValue'],
    });


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
      remark: [''],
      tasktype: [null, Validators.required],
      hours: [null, Validators.required],

    });

    this.projectForm = this.fb.group({
      name: [null, Validators.required],
      manager_id: [null, Validators.required],
      members_id: [null, Validators.required],
      start_date: [null, Validators.required],
      end_date: [null, Validators.required],
      description: [null, Validators.required],
      projectID: '',
      servic_id: [null, Validators.required],
      total_cost: [null, Validators.required],
      remark: [''],
      tasktype: [null, Validators.required],
      hours: [null, Validators.required],

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
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 2,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };

    this.commonService.checkPalnValid().subscribe(
      (usersubscriptiondata) => {
        if(usersubscriptiondata.totalDay >= 0 && usersubscriptiondata.status == false){
           this.router.navigate(['/subscription-plan']);
         }
        },
      (error) => {
        console.error('Error fetching subscription data:', error);
      }
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
  }

  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;


  openStaticBackdrop(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { backdrop: 'static', position: 'end' });
  }

  ngOnInit() {

    this.commonService.checkLoggedIn();
    Pusher.logToConsole = false;

    if (localStorage.getItem('userid') !== null) {
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
            // console.log(this.projectslistData.add);
            
          },
          (error) => {
            this.spinner.hide();
            // Handle errors appropriately
            console.error('Error loading projects list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  clearprojectform() {
    this.addprojectForm.reset();
  }



  deleteprojectsopendialogue(id: any) {
    this.selectedProjectId = id;
    const modal = document.getElementById('deleteprojectModal');
  }

  confirmDelete(): void {
    if (this.selectedProjectId) {
      this.deleteprojects(this.selectedProjectId);
    }
  }

  deleteprojects(id: any) {
    this.spinner.show();
    this.loading = true; // Start loader
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const projectID = { projectID: id };

      this.http
        .post(`${this.apiUrl}projectDelete`,
          projectID,
          { headers }
        )
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_delete_project');
              if (elementToClick) {
                elementToClick.click();
              }
              setTimeout(() => {
                this.toastr.success('Project Deleted Successfully.');
              }, 10);
              this.loadProjectsList();
              this.spinner.hide();
            }
          },
          (error: any) => {
            this.spinner.hide();
            console.error('Error sending data', error);
          }
        );
      // .add(() => (this.loading = false));
    }
  }

  getmanager() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}managerGet`, { headers })
        .subscribe(
          (projectslistData: any) => {
            this.team = projectslistData.data.map((item: { id: any; name: any; }) => ({
              item_id: item.id,
              item_text: item.name,
            }));
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
            console.error('Error loading projects list:', error);
          }
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
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
          (error) => {
            this.spinner.hide();
          }
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }

  onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.item(0);
    if (file) {
      this.selectedImage = file;
    }
  }

  addproject(information: any) {
    if (this.addprojectForm.invalid) {
      // Mark all fields as touched to display error messages
      Object.keys(this.addprojectForm.controls).forEach(key => {
        this.addprojectForm.get(key)?.markAsTouched();
      });
      return;
    }
    this.spinner.show();


    const formData = new FormData();
    const companyID = localStorage.getItem('usercompanyId');
    const selectedMembers = this.addprojectForm.get('members_id')?.value;
    const selectedmanager = this.addprojectForm.get('manager_id')?.value;
    const selectedClient = this.addprojectForm.get('client_id')?.value;

    if (companyID) {
      formData.append('companyId', companyID);
    }
    if (this.checklistarray) {
      const selectedcheckList = this.checklistarray;
      formData.set('checkList', JSON.stringify(selectedcheckList));
    }
    if (this.selectedImage) {
      formData.append('profile', this.selectedImage);

      Object.keys(information).forEach((key) => {
        formData.append(key, information[key]);
      });

    } else {

      Object.keys(information).forEach((key) => {
        formData.append(key, information[key]);
      });
    }

    formData.set('total_cost', this.addprojectForm.get('cost')?.value);
    formData.set('members_id', JSON.stringify(selectedMembers));
    formData.set('manager_id', JSON.stringify(selectedmanager));
    formData.set('client_id', JSON.stringify(selectedClient));
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


  editproject(id: number) {
    this.spinner.show();
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Accept', 'application/json');

      this.http.get(`${this.apiUrl}projectGet?projectID=${id}`, { headers }).subscribe(
        (editstatuslistData: any) => {
          this.editprojectlistData = editstatuslistData;
          this.projectlistedit = this.editprojectlistData?.data;


          // Assuming start_date and end_date are in 'dd-MM-yyyy' format
          this.projectlistedit.start_date = parseDate(this.projectlistedit.start_date, 'dd-MM-yyyy', new Date());
          this.projectlistedit.end_date = parseDate(this.projectlistedit.end_date, 'dd-MM-yyyy', new Date());

          // Assuming managerName is an array
          this.managerName = this.projectlistedit.managerName || [];
          this.membersName = this.projectlistedit.membersName || [];
          this.checklistarray = this.projectlistedit.checkList || [];

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

  updateproject() {
    const companyID = localStorage.getItem('usercompanyId');
    const selectedMembers = this.projectForm.get('members_id')?.value;
    const selectedManager = this.projectForm.get('manager_id')?.value;
    const name = this.projectForm.get('name')?.value;
    const description = this.projectForm.get('description')?.value;
    const start_date = this.projectForm.get('start_date')?.value;
    const end_date = this.projectForm.get('end_date')?.value;
    // const client_id = this.projectForm.get('client_id')?.value;
    const projectID = this.projectForm.get('projectID')?.value;
    const formData = new FormData();


    formData.set('members_id', JSON.stringify(selectedMembers));
    formData.set('manager_id', JSON.stringify(selectedManager));

    const token = localStorage.getItem('tasklogintoken');
    formData.set('name', name);
    formData.set('description', description);
    formData.set('projectID', projectID);
    formData.set('start_date', start_date);
    formData.set('end_date', end_date);
    if (this.checklistarray) {
      const selectedcheckList = this.checklistarray;
      formData.set('checkList', JSON.stringify(selectedcheckList));
    }
    formData.set('total_cost', this.projectForm.get('total_cost')?.value);
    formData.set('servic_id', this.projectForm.get('servic_id')?.value);


    if (this.projectForm.invalid) {
      this.toastr.error('Please fill in all required fields');
      return;
    }
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http.post(`${this.apiUrl}projectEdit`, formData, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_edit');
              if (elementToClick) {
                elementToClick.click();
              }
              this.toastr.success('Project Updated Successfully.');
              this.loadProjectsList();
            }
            if (response.status === false && response.code == 210) {
              this.toastr.error('Project name already exist.')
            }
            this.spinner.hide();
          },
          (error: any) => {
            this.spinner.hide();
            console.error('Error sending data', error);
          }
        );
    }
  }

  onStarClick(id: any, event: any) {
    const clickedValue = event;
    const projectID = id;
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const formData = new FormData();
      formData.append('projectID', id);
      formData.append('is_favorite', clickedValue);

      this.http.post(`${this.apiUrl}projectFavorite`, formData, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_status_update');
              if (elementToClick) {
                elementToClick.click();
              }
              setTimeout(() => {
                this.toastr.success('Status Updated Successfully.');
              }, 10);
              this.loadProjectsList();
              this.spinner.hide();
            }
          },
          (error: any) => {
            this.spinner.hide();
            if (error.status === 401) {
              this.commonService.logout();
            }
            console.error('Error sending data', error);
          }
        );

    }
  }
  onManagerSelect(selectedManager: any) {
    this.filteredMembers = this.team1.filter(member => member.item_id !== selectedManager.item_id);
  }

  filterItems(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    if (!searchTerm) {
      this.loadProjectsList(); // Return all projects if search term is empty
    } else {
      this.projectslistcreated = this.projectslistcreated.filter((project: any) =>
        project.name.toLowerCase().includes(searchTerm) ||
        project.createdName.toLowerCase().includes(searchTerm)
      );
    }
  }

  filterItemsAssign(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    if (!searchTerm) {
      this.loadProjectsList(); // Return all projects if search term is empty
    } else {
      this.projectslistassigned = this.projectslistassigned.filter((project: any) =>
        project.name.toLowerCase().includes(searchTerm) ||
        project.createdName.toLowerCase().includes(searchTerm)
      );
    }
  }
  checklistarray: {
    remark: '';
    hours: '';
    tasktype: '';
    // minutes: '';
  }[] = [];
  addchecklist(type: any) {
    // console.log();

    if (type == 'edit') {
      if (this.projectForm?.value.remark == '') {
        this.toastr.error('Please add Title');
        return;
      }
    } else {
      if (this.addprojectForm?.value.remark == '') {
        this.toastr.error('Please add Title');
        return;
      }
    }


    if (type == 'edit') {
      // ckluser_id: this.projectForm?.value.ckluser_id[0].item_text,
      const newchecklist = { remark: this.projectForm?.value.remark, hours: this.projectForm?.value.hours, tasktype: this.projectForm?.value.tasktype };
      this.checklistarray.push(newchecklist);
      this.projectForm?.get('remark')?.setValue('');
      this.projectForm?.get('tasktype')?.setValue('');
      this.projectForm?.get('hours')?.setValue('');
      // this.projectForm?.get('minutes')?.setValue('');
    } else {
      // ckluser_id: this.addprojectForm?.value.ckluser_id[0].item_text,
      const newchecklist = { remark: this.addprojectForm?.value.remark, hours: this.addprojectForm?.value.hours, tasktype: this.addprojectForm?.value.tasktype };
      this.checklistarray.push(newchecklist);
      this.addprojectForm?.get('remark')?.setValue('');
      this.addprojectForm?.get('tasktype')?.setValue('');
      this.addprojectForm?.get('hours')?.setValue('');
      // this.addprojectForm?.get('minutes')?.setValue('');
    }
  }
  removechecklist(index: number) {
    this.checklistarray.splice(index, 1);
  }

  // getuserchecklist(type:any) {
  //   if(type == 'add'){
  //       this.selectedMembersckl = this.addprojectForm.get('members_id')?.value || [];
  //       this.selectedManagerckl = this.addprojectForm.get('manager_id')?.value || [];
  //   }else{
  //       this.selectedMembersckl = this.projectForm.get('members_id')?.value || [];
  //       this.selectedManagerckl = this.projectForm.get('manager_id')?.value || [];
  //   }

  //   // Ensure both selectedMembers and selectedManager are arrays
  //   const membersArray = Array.isArray(this.selectedMembersckl) ? this.selectedMembersckl : [this.selectedMembersckl];
  //   const managerArray = Array.isArray(this.selectedManagerckl) ? this.selectedManagerckl : [this.selectedManagerckl];

  //   // Merge the arrays
  //   this.mergedArray = [...membersArray, ...managerArray];

  //   this.mergedArray; 
  // }
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
}