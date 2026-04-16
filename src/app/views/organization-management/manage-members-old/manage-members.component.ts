import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, NgForm, AbstractControl } from '@angular/forms';
import { NgFor } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ColorSketchModule } from 'ngx-color/sketch';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { environment } from 'src/environments/environment';
import { MatRadioModule } from '@angular/material/radio';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../service/common.service';
import { format as formatDate, parse as parseDate } from 'date-fns';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { tr } from 'date-fns/locale';


interface ICountry {
  item_id: any;
  item_text: string;
  image: string;
  isDisabled?: boolean;
}


@Component({
  selector: 'app-manage-members',
  templateUrl: './manage-members.component.html',
  styleUrls: ['./manage-members.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, NgFor, FormsModule, NgIf, ColorSketchModule, RouterModule, RouterLink, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule, NgMultiSelectDropDownModule, MatRadioModule, NgxSpinnerModule],
})
export class ManageMembersComponent {
  @ViewChild('clearaddform') clearaddform: any;
  activeTabId: string = 'nav-My-Members-tab'; // Set the default active tab ID
  companyId: any;
  
  rolelistData: any;
  rolelist: any;
  usertypelistData: any;
  usertypelist: any;
  memberlistData: any;
  memberlist: any;
  editmemberlist: any;
  companyForm!: FormGroup;
  editcompanylistData: any;
  companylistedit: any;
  email = new FormControl('', [Validators.required, Validators.email]);
  private apiUrl = environment.ApiUrl;
  public domainName = environment.domainName;
  loading: boolean = false;
  editForm!: FormGroup;
  selectedItems2: ICountry[] = [];
  memberForm: FormGroup;
  permission: Array<ICountry> = [];
  team: Array<ICountry> = [];
  editmembers_id: Array<ICountry> = [];
  selectedImage: File | null = null;
  dropdownSettings2: any = {};
  fileForm!: FormGroup;
  clearaddteamform!: FormGroup;
  projectlistData: any;
  projectlist: any;
  teamlistData: any;
  teamlist: any;
  submitForm!: FormGroup;
  editTeamForm!: FormGroup;
  editmemberData: any;
  fileToUploadadd: any;
  imageUrladd: any;
  fileToUpload: any;
  imageUrl: any;
  userpermission: any;

  memberedit: any = {
    name: null,
    designation: null,
    dob: null,
    phone_no: null,
    email_id: null,
    memberId: null
  }
  editteamgroupData: any;
  editteamgroups: any = {
    name: null,
    projectId: null,
  }
  selectedMemberId: any;
  selectedTeamId: any;
  ownerChceck:any;
  // add role popup

  constructor(private formBuilder: FormBuilder, private fb: FormBuilder,
    private http: HttpClient,
    private commonService: CommonService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private spinner: NgxSpinnerService) {
    this.spinner.show();
    this.ownerChceck= localStorage.getItem('ownerChceck');
    this.fileForm = this.formBuilder.group({
      multiplefile: ['initialValue'],
    });

    this.clearaddteamform = this.fb.group({
      name: ['', [Validators.required]],
      projectId: ['', [Validators.required]],
      selectedItems2: ['']
    });

    this.memberForm = this.fb.group({
      name: ['', [Validators.required]],
      email_id: ['', [Validators.required]],
      assignRole: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      reportingTo: ['', [Validators.required]],
      phone_no: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      admin_rights_yes: [''],
      admin_rights_no: [''],
      companyID: [''],
      profile: [''],
      dob: [''],
      memberId: [''],
      is_active: [''],
      hour_per_cost: [''],
      // attech file
    });

    this.dropdownSettings2 = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 7,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };


    this.permission = [
      {
        item_id: 1,
        item_text: 'Client',
        image: '',
      },
      {
        item_id: 2,
        item_text: 'Member',
        image: '',
      },
      {
        item_id: 3,
        item_text: 'Role',
        image: '',
      },
      {
        item_id: 4,
        item_text: 'Service',
        image: '',
      },
      {
        item_id: 5,
        item_text: 'Status',
        image: '',
      },
    ];
  }

  ngOnInit(): void {
    this.usersPermission();
    this.route.paramMap.subscribe(params => {
      this.companyId = params.get('id');
      this.commonService.checkLoggedIn();
      this.memberForm.patchValue({
        companyID: this.companyId,
      });
      this.memberForm = this.fb.group({
        name: ['', Validators.required],
        designation: ['', Validators.required], // Use appropriate default value
        dob: [''], // Use appropriate default value
        phone_no: ['', Validators.required], // Use appropriate default value
        email_id: ['', Validators.required], // Use appropriate default value
        reportingTo: ['', Validators.required], // Use appropriate default value
        gender: ['', Validators.required], // Use appropriate default value
        assignRole: ['', this.adminRightsValidator()],
        memberId: [''],
        user_type: [''],
        hour_per_cost: [''],
      });

      this.submitForm = this.fb.group({
        name: ['', Validators.required],
        companyId: ['', Validators.required], // Use appropriate default value
        projectId: ['', Validators.required], // Use appropriate default value
        members_id: [[], Validators.required], // Assuming it's an array, adjust as needed
      });

      this.editTeamForm = this.fb.group({
        name: ['', Validators.required], // Name is required
        companyId: ['', Validators.required], // Company ID is required
        projectId: ['', Validators.required], // Project ID is required
        teamId: ['', Validators.required], // Team ID is required
        members_id: [[], Validators.required], // Members ID is required and must be an array
      });

      this.getrolelist();
      this.getusertypelist();
      this.getmemberlist();
      this.LoadProjectList();
      this.LoadTeamList();
      this.LoadMemberList();
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(name => name.charAt(0)).join('');
  }

  usersPermission() {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '{}');
    this.userpermission = permissions.organizationPermission;
    if (this.userpermission.add === 0 && this.userpermission.edit === 0 && this.userpermission.delete === 0) {
      this.router.navigate(['/dashboard']);
    }
  }

  adminRightsValidator() {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const adminRightsValue = this.memberForm.get('admin_rights')?.value;

      if (adminRightsValue === 'optionNo' && !control.value) {
        return { 'required': true };
      }

      return null;
    };
  }
  // administreter permision dropdown
  addmember(information: any, clearaddform: any) {
    const formData = new FormData();
    formData.append('profile', this.selectedImage!);

    const currentDate = information.dob;
    const formattedDate = currentDate.toISOString();

    // Append other form data properties to formData
    Object.keys(information).forEach((key) => {
      formData.append(key, information[key]);
    });

    formData.append('dob', formattedDate);
    formData.append('companyID', this.companyId);

    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http.post(`${this.apiUrl}comapnyMemberAdd`, formData, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              this.clearaddform.resetForm();
              this.getrolelist();
              this.getmemberlist();
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_member_add');
              if (elementToClick) {
                elementToClick.click();
              }
              this.toastr.success('Member Added Successfully.');
              this.spinner.hide();
              // this.ClientList();
            }
            if (response.code == 210) {
              this.spinner.hide();
              this.toastr.error('Email is already exist');
            }
          },
          (error: any) => {
            this.spinner.hide();
            console.error('Error sending data', error);
          }
        );
    }
  }

  deletememberopendialogue(id: any) {
    this.selectedMemberId = id;
    const modal = document.getElementById('deleteprojectModal');
  }

  confirmDeleteMember(): void {
    if (this.selectedMemberId) {
      this.DeleteMember(this.selectedMemberId);
    }
  }

  DeleteMember(id: number) {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const memberId = { memberId: id };

      this.http
        .post(`${this.apiUrl}comapnyMemberDelete`,
          memberId,
          { headers }
        )
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_delete_member');
              if (elementToClick) {
                elementToClick.click();
              }
              setTimeout(() => {
                this.toastr.success('Member Deleted Successfully.');
              }, 10);
              this.getrolelist();
              this.getmemberlist();
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

  onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.item(0);
    if (file) {
      this.selectedImage = file;
    }
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      this.fileToUploadadd = files.item(0);
      let reader = new FileReader();
      reader.onload = (readerEvent: any) => {
        this.imageUrladd = readerEvent.target.result;
      };
      reader.readAsDataURL(this.fileToUploadadd);
    } else {
      // Handle the case when no file is selected
      this.fileToUploadadd = null;
      this.imageUrladd = null;
    }
  }

  onFileChangeEdit(event: any) {
    const file = (event.target as HTMLInputElement).files?.item(0);
    if (file) {
      this.selectedImage = file;
    }
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      this.fileToUpload = files.item(0);
      let reader = new FileReader();
      reader.onload = (readerEvent: any) => {
        this.imageUrl = readerEvent.target.result;
      };
      reader.readAsDataURL(this.fileToUpload);
    } else {
      // Handle the case when no file is selected
      this.fileToUpload = null;
      this.imageUrl = null;
    }
  }

  getrolelist() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}roleList?companyID=` + this.companyId, {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.rolelistData = clientslistData;
            this.rolelist = this.rolelistData?.data;
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
  getusertypelist() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}userTypeList`, {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.usertypelistData = clientslistData;
            this.usertypelist = this.usertypelistData?.data;
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

  filterItems(event: Event) {
    // Cast the event to InputEvent
   const inputEvent = event as InputEvent;
   const inputElement = inputEvent.target as HTMLInputElement;
   const searchTerm = inputElement.value.toLowerCase(); // Convert to lower case for case-insensitive search

    if (!searchTerm) {
      this.getmemberlist(); // Return all projects if search term is empty
    } else {
      this.memberlist = this.memberlist.filter((project: any) =>
       (project.name?.toLowerCase().includes(searchTerm) ||
        project.designation?.toLowerCase().includes(searchTerm) ||
        project.email?.toLowerCase().includes(searchTerm) ||
        project.reportingTo?.toLowerCase().includes(searchTerm) ||
        project.phone_no?.toLowerCase().includes(searchTerm))
      );
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
        .get(`${this.apiUrl}comapnyMemberList?companyID=` + this.companyId, {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.memberlistData = clientslistData;
            this.memberlist = this.memberlistData?.data;
            this.editmemberlist = this.memberlistData?.data;
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
  // popup checkbox toggle
  Mastersetuppermission: boolean = false;
  permissionallcheck() {
    this.Mastersetuppermission = false;
  }
  permissioncheckbox() {
    this.Mastersetuppermission = true;
  }
  // popup checkbox toggle

  setActiveTab(tabId: string): void {
    this.activeTabId = tabId;
  }
  task: Task = {
    name: 'Select All',
    completed: false,
    subtasks: [
      { name: 'Projects', completed: false },
      { name: 'Tasks', completed: false },
      { name: 'Discussion', completed: false },
      { name: 'DMS', completed: false },
    ],
  };

  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete = this.task.subtasks && this.task.subtasks.every(subtask => subtask.completed);
  }

  someComplete(): boolean {
    return this.task.subtasks && this.task.subtasks.some(subtask => subtask.completed);
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach((t) => (t.completed = completed));
  }


  LoadProjectList() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(`${this.apiUrl}taskProjectList?companyID=${this.companyId}`, { headers })
        .subscribe(
          (projectlistData: any) => {
            this.projectlistData = projectlistData;
            this.projectlist = projectlistData?.data;
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
            console.error('Error loading company list:', error);
          }
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }

  LoadTeamList() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(`${this.apiUrl}teamList?companyID=${this.companyId}`, { headers })
        .subscribe(
          (teamlistData: any) => {
            this.teamlistData = teamlistData;
            this.teamlist = teamlistData?.data;
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
            console.error('Error loading company list:', error);
          }
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }

  LoadMemberList() {
    const token = localStorage.getItem('tasklogintoken');
    
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(`${this.apiUrl}comapnyMemberList?companyID=${this.companyId}`, { headers })
        .subscribe(
          (teamlistData: any) => {
            this.team = teamlistData.data.map((item: { id: any; name: any; }) => ({
              item_id: item.id,
              item_text: item.name,
            }));
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
            console.error('Error loading company list:', error);
          }
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }

  addTeam(): void {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');


      const information = this.submitForm.value;

      if (information.name === '' || information.members_id === '' || information.projectId === '') {
        this.toastr.error('Please fill in all required fields');
        return;
      }
      this.spinner.show();

      const membersIds = this.submitForm.value.members_id.map((item: any) => item.item_id).join(', ');

      const payload = {
        companyId: this.companyId,
        name: this.submitForm.value.name,
        projectId: this.submitForm.value.projectId,
        members_id: membersIds,
      };

      this.http.post(`${this.apiUrl}teamAdd`, payload, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_team_add');
              if (elementToClick) {
                elementToClick.click();
              }
              this.submitForm.reset();
              this.toastr.success('Team Added Successfully.');
              this.LoadTeamList();
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

  EditMember(id: any): void {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Accept', 'application/json');
      this.http.get(`${this.apiUrl}comapnyMemberGet?memberId=${id}`, { headers }).subscribe(
        (editmemberData: any) => {
          this.editmemberData = editmemberData;
          this.memberedit = this.editmemberData?.data;
          let userids = id;
          this.editmemberlist = this.editmemberlist.filter((users: { id: string | null; }) => users.id != userids);

          this.memberForm.controls['reportingTo'].setValue(this.memberedit.reportingTo);
          const formattedDob = formatDate(
            parseDate(this.memberedit.dob, 'dd-MM-yyyy', new Date()),
            'yyyy-MM-dd'
          );
          this.memberedit.dob = formattedDob;
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


  UpdateMember(information: any, formname: any): void {
    const formData = new FormData();
    formData.append('profile', this.selectedImage!);

    if (information.name === '' || information.dob === null || information.phone_no === '' || information.email_id === '' || information.gender === '' || information.memberId === '') {
      this.toastr.error('Please fill in all required fields');
      return;
    }

  if(information.dob !== ''){
    const currentDate = information.dob;
    const formattedDate = currentDate.toISOString();
    formData.append('dob', formattedDate);
  }
   Object.keys(information).forEach((key) => {
      formData.append(key, information[key]);
    });

   
    formData.append('companyID', this.companyId);
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http.post(`${this.apiUrl}comapnyMemberEdit`, formData, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              this.clearaddform.resetForm();
              this.getrolelist();
              this.getusertypelist();
              this.getmemberlist();
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_member_edit');
              if (elementToClick) {
                elementToClick.click();
              }
              this.toastr.success('Member Updated Successfully.');
              this.spinner.hide();
            }
            if (response.code == 210) {
              this.spinner.hide();
              this.toastr.error('Email is already exist');
            }
          },
          (error: any) => {
            this.spinner.hide();
            console.error('Error sending data', error);
          }
        );
    }
  }



  editTeamGroup(id: number): void {
    const token = localStorage.getItem('tasklogintoken');

    if (!token) {
      console.log('No token found in localStorage.');
      return;
    }
    this.spinner.show();

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    this.http.get(`${this.apiUrl}teamGet?teamId=${id}`, { headers }).subscribe(
      (editteamgroupData: any) => {
        this.editteamgroupData = editteamgroupData;
        this.editteamgroups = this.editteamgroupData?.data;

        this.editmembers_id = (this.editteamgroups.members_id ?? []).map((item: { id: any; name: any }) => ({
          item_id: item.id,
          item_text: item.name,
        }));
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        console.error('Error fetching team data:', error);
      }
    );
  }

  deleteteamopendialogue(id: any) {
    this.selectedTeamId = id;
    const modal = document.getElementById('deleteprojectModal');
  }

  confirmDeleteTeam(): void {
    if (this.selectedTeamId) {
      this.deleteTeamGroup(this.selectedTeamId);
    }
  }


  deleteTeamGroup(id: number) {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const teamId = { teamId: id };

      this.http
        .post(`${this.apiUrl}teamDelete`,
          teamId,
          { headers }
        )
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_delete_team');
              if (elementToClick) {
                elementToClick.click();
              }
              setTimeout(() => {
                this.toastr.success('Team Deleted Successfully.');
              }, 10);
              this.LoadTeamList();
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

  updateTeam(): void {
    const token = localStorage.getItem('tasklogintoken');
    const information = this.editTeamForm.value;
    // return;


    if (
      information.name === '' ||
      information.teamId === '' ||
      information.projectId === '' ||
      !(information.members_id && information.members_id.length > 0)
    ) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      const membersIds = this.editTeamForm.value.members_id.map((item: any) => item.item_id).join(', ');

      const payload = {
        name: this.editTeamForm.value.name,
        projectId: this.editTeamForm.value.projectId,
        members_id: membersIds,
        teamId: this.editTeamForm.value.teamId,
      };

      this.http.post(`${this.apiUrl}teamEdit`, payload, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_team_edit');
              if (elementToClick) {
                elementToClick.click();
              }
              this.submitForm.reset();
              this.toastr.success('Team Updated Successfully.');
              this.LoadTeamList();
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
}

// add role popup

interface Task {
  name: string;
  completed: boolean;
  subtasks: { name: string; completed: boolean }[];
}


