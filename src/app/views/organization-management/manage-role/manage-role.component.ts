import { Component, NgModule } from '@angular/core';
import { NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../service/common.service';
import { environment } from 'src/environments/environment';

import { ColorSketchModule } from 'ngx-color/sketch';
import { ColorEvent } from 'ngx-color';
import { OnInit, ElementRef, Renderer2 } from '@angular/core';
import { FormControl, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { th } from 'date-fns/locale';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';


interface Task {
  name: string;
  completed: boolean;
  subtasks: Array<{ name: string; completed: boolean }>;
}



@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.scss'],
})
export class ManageRoleComponent {

  getcompanyId: any;
  rolelist: any;
  roleslistData: any;
  editroleslistData: any;
  rolelistProjects: any;
  editForm: FormGroup;
  selectedRoleId: any;

  roleslistedit: any = {
    name: null,
    roleId: null,
    add: null,
    edit: null,
    delete: null,
  }
  userpermission: any;

  //   editForm = new FormGroup({
  //     name: new FormControl('', [Validators.required]),
  //     add: new FormControl('', [Validators.required]),
  //     edit: new FormControl('', [Validators.required]),
  //     delete: new FormControl('', [Validators.required]),
  //     deleteDiscussion: new FormControl('', [Validators.required]),
  //     roleId: new FormControl(null) // Note: Assuming roleID is a number
  //  });

  tasks = [
    { name: 'Projects', operations: { add: false, edit: false, delete: false } },
    { name: 'Tasks', operations: { add: false, edit: false, delete: false } },
    { name: 'Discussion', operations: { add: false, edit: false, delete: false } },
    { name: 'Note', operations: { add: false, edit: false, delete: false } },
    { name: 'Organization Management', operations: { add: false, edit: false, delete: false } },
    // Add more tasks as needed
  ];
  editTask = [
    { name: 'Projects', permission: { add: false, edit: false, delete: false } },
    { name: 'Tasks', permission: { add: false, edit: false, delete: false } },
    { name: 'Discussion', permission: { add: false, edit: false, delete: false } },
    { name: 'Note', permission: { add: false, edit: false, delete: false } },
    { name: 'Organization Management', permission: { add: false, edit: false, delete: false } },
  ];



  checkboxStatus: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private commonService: CommonService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private spinner: NgxSpinnerService
  ) {
    this.spinner.show();
    this.editForm = this.fb.group({
      addProjects: [false],
      editProjects: [false],
      deleteProjects: [false],
      addTasks: [false],
      editTasks: [false],
      deleteTasks: [false],
      addDiscussion: [false],
      editDiscussion: [false],
      deleteDiscussion: [false],
      addNote: [false],
      editNote: [false],
      deleteNote: [false],
      'addOrganization Management': [false],
      'editOrganization Management': [false],
      'deleteOrganization Management': [false],
      name: [''],
      roleId: [''],
    });

  }
  private apiUrl = environment.ApiUrl;

  ngOnInit() {
    this.usersPermission();
    this.commonService.checkLoggedIn();
    this.route.paramMap.subscribe(params => {
      this.getcompanyId = params.get('id');
    });
    this.RolesList();
  }
  usersPermission() {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '{}');
    this.userpermission = permissions.organizationPermission;
    if (this.userpermission.add === 0 && this.userpermission.edit === 0 && this.userpermission.delete === 0) {
      this.router.navigate(['/dashboard']);
    }
  }

  filterItems(event: Event) {
    // Cast the event to InputEvent
    const inputEvent = event as InputEvent;

    // Access the target property to get the input element
    const inputElement = inputEvent.target as HTMLInputElement;

    // Get the value from the input element
    const searchTerm = inputElement.value.toLowerCase(); // Convert to lower case for case-insensitive search

    if (!searchTerm) {
      this.RolesList(); // Return all projects if search term is empty
    } else {
      this.rolelist = this.rolelist.filter((project: any) =>
        // Check if the properties are not null or undefined before accessing them
        (project.name?.toLowerCase().includes(searchTerm))
      );
    }
  }

  RolesList() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}roleList?companyID=` + this.getcompanyId, {
          headers,
        })
        .subscribe(
          (roleslistData: any) => {
            this.roleslistData = roleslistData;
            this.rolelist = this.roleslistData?.data;
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

  task: Task = {
    name: 'Select All',
    completed: false,
    subtasks: []
  };

  allComplete: boolean = false;

  setAll(checked: boolean): void {
    this.allComplete = checked;
    this.task.completed = checked;

    // Loop through each row and update the checkboxes
    const rows = document.querySelectorAll('.role_table tbody tr');

    if (rows) {
      rows.forEach((row: any) => {
        const addCheckbox = row.cells[1]?.querySelector('mat-checkbox');
        const editCheckbox = row.cells[2]?.querySelector('mat-checkbox');
        const deleteCheckbox = row.cells[3]?.querySelector('mat-checkbox');

        if (addCheckbox) {
          addCheckbox.checked = checked;
        }

        if (editCheckbox) {
          editCheckbox.checked = checked;
        }

        if (deleteCheckbox) {
          deleteCheckbox.checked = checked;
        }
      });
    }
  }

  addrole(formData: any, submitForm: any): void {
    const permission: any = {};

    if (formData.name === '') {
      this.toastr.error('Please fill in all required fields');
      return;
    }
    this.spinner.show();

    this.tasks.forEach((task, index) => {
      permission[index + 1] = [
        {
          add: task.operations.add ? '1' : '0',
          edit: task.operations.edit ? '1' : '0',
          delete: task.operations.delete ? '1' : '0',
        },
      ];
    });

    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      const requestData = {
        name: formData.name,
        permission,
        companyId: this.getcompanyId, // Add companyId to the request data
      };

      this.http.post(`${this.apiUrl}roleAdd`, requestData, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_role_add');
              if (elementToClick) {
                elementToClick.click();
              }
              submitForm.resetForm();
              this.RolesList();
              this.spinner.hide();
              this.toastr.success('Role Added Successfully.');
            }
          },
          (error: any) => {
            this.spinner.hide();
            console.error('Error sending data', error);
          }
        );
    }
  }

  editroles(id: any) {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Accept', 'application/json');
      this.http.get(`${this.apiUrl}roleGet?roleId=` + id, { headers }).subscribe(
        (editroleslistData: any) => {
          this.editroleslistData = editroleslistData;
          this.roleslistedit = this.editroleslistData?.data;

          if (this.roleslistedit && this.roleslistedit.permission) {
            this.editTask = Object.keys(this.roleslistedit.permission).map((key: string) => {
              const permissionIndex = Number(key); // Convert key to a number
              return {
                name: ['Projects', 'Tasks', 'Discussion', 'Note', 'Organization Management'][permissionIndex],
                permission: {
                  add: this.roleslistedit.permission[key].add === 1,
                  edit: this.roleslistedit.permission[key].edit === 1,
                  delete: this.roleslistedit.permission[key].delete === 1,
                }
              };
            });
            this.spinner.hide();
          } else {
            this.spinner.hide();
            console.error('Invalid roleslistedit structure:', this.roleslistedit);
          }
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

  deleteroleopendialogue(id: any) {
    this.selectedRoleId = id;
    const modal = document.getElementById('deleteprojectModal');
  }

  confirmDelete(): void {
    if (this.selectedRoleId) {
      this.deleteroles(this.selectedRoleId);
    }
  }

  deleteroles(id: any) {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const roleId = { roleId: id };

      this.http
        .post(`${this.apiUrl}roleDelete`,
          roleId,
          { headers }
        )
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_delete_role');
              if (elementToClick) {
                elementToClick.click();
              }
              setTimeout(() => {
                this.toastr.success('Role Deleted Successfully.');
              }, 10);
              this.RolesList();
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

  UpdateRoles() {
    const formData = this.editForm.value;

    if (formData.name === '') {
      this.toastr.error('Please fill in all required fields');
      return;
    }
    this.spinner.show();

    const permission: any = {};
    this.editTask.forEach((task, index) => {
      permission[index + 1] = [
        {
          add: task.permission.add ? '1' : '0',
          edit: task.permission.edit ? '1' : '0',
          delete: task.permission.delete ? '1' : '0',
        },
      ];
    });


    const requestData = {
      name: formData.name,
      permission,
      roleId: formData.roleId,
    };
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http.post(`${this.apiUrl}roleEdit`, requestData, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_edit');
              if (elementToClick) {
                elementToClick.click();
              }
              this.RolesList();
              this.spinner.hide();
              this.toastr.success('Role Updated Successfully.');
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

