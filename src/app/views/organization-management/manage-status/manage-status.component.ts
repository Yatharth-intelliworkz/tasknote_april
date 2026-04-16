import { ColorSketchModule } from 'ngx-color/sketch';
import { ColorEvent } from 'ngx-color';
import { Component, OnInit, ElementRef, Renderer2, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, NgForm, } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../service/common.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'app-manage-status',
  templateUrl: './manage-status.component.html',
  styleUrls: ['./manage-status.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [ColorSketchModule, NgIf, ReactiveFormsModule, FormsModule, RouterLink, NgFor, MatInputModule, MatFormFieldModule, MatMenuModule]
})
export class ManageStatusComponent {
  public state: string = '';

  selectedColor: string = '';
  colorcode: any;
  statuslistData: any;
  statuslist: any;
  companyId: any;
  editstatuslistData: any;
  userpermission: any;
  selectedServiceId:any;
  statuslistedit: any = {
    status: null,
    code: null,
    statusId: null,
  };

  editForm = new FormGroup({
    status: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    statusId: new FormControl('', [Validators.required]),
  });

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
    
  }
  private apiUrl = environment.ApiUrl;

  ngOnInit() {
    this.usersPermission();
    this.commonService.checkLoggedIn();
    this.route.paramMap.subscribe(params => {
      this.companyId = params.get('id');
    });
    this.loadStatusList();
  }

  usersPermission() {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '{}');
    this.userpermission = permissions.organizationPermission;
    if (this.userpermission.add === 0 && this.userpermission.edit === 0 && this.userpermission.delete === 0) {
      this.router.navigate(['/dashboard']);
    }
  }

  selectStatus(statusId: any, isactive: any) {
    console.log(isactive);

    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      const dataArray = { statusId: statusId, isActive: isactive };
      this.http
        .post(`${this.apiUrl}statusActive`, dataArray, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              setTimeout(() => {
                this.toastr.success('Status Updated Successfully.');
              }, 10);
              this.loadStatusList();
            }
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        );
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
      this.loadStatusList(); // Return all projects if search term is empty
    } else {
      this.statuslist = this.statuslist.filter((project: any) =>
        // Check if the properties are not null or undefined before accessing them
        (project.status?.toLowerCase().includes(searchTerm))
      );
    }
  }

  loadStatusList() {
    if (!this.companyId) {
      console.log('Company ID is undefined.');
      return;
    }
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(`${this.apiUrl}mainStatusList?companyID=` + this.companyId, { headers })
        .subscribe(
          (companylistData: any) => {
            this.statuslistData = companylistData;
            this.statuslist = companylistData?.data;
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
            if (error.status === 401) {
              this.commonService.logout();
            }
            console.error('Error loading company list:', error);
          }
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }

  handleChange($event: ColorEvent) {

    this.state = $event.color.hex;
    this.selectedColor = $event.color.hex;
    this.colorcode = this.selectedColor;
  }

  insertstatus(information: any, submitForm: NgForm) {
    const token = localStorage.getItem('tasklogintoken');

    if (information.status === '' || this.colorcode === undefined || this.companyId === '') {
      this.toastr.error('Please fill in all required fields');
      return;
    }
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      information.code = this.colorcode;
      information.companyId = this.companyId;

      this.http.post(`${this.apiUrl}statusAdd`, information, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_client_add');
              if (elementToClick) {
                elementToClick.click();
              }
              submitForm.resetForm();
              this.toastr.success('Status Added Successfully.');
              this.loadStatusList();
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

  editStatus(id: number) {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Accept', 'application/json');
      this.http.get(`${this.apiUrl}statusGet?statusId=` + id, { headers }).subscribe(
        (editstatuslistData: any) => {
          this.editstatuslistData = editstatuslistData;
          this.statuslistedit = this.editstatuslistData?.data;
          this.state = this.statuslistedit.code;
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

  UpdateStatus() {
    const token = localStorage.getItem('tasklogintoken');

    const information = this.editForm.value;

    if (information.status === '' || information.code === undefined || information.statusId === '') {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      if (this.editForm.valid) {
        this.http.post(`${this.apiUrl}statusEdit`, this.editForm.value, { headers })
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
                this.spinner.hide();
                this.loadStatusList();
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

  deleteservicesopendialogue(id: any) {
    this.selectedServiceId = id;
    const modal = document.getElementById('deleteprojectModal');
  }

  confirmDelete(): void {
    if (this.selectedServiceId) {
      this.servicedelete(this.selectedServiceId);
    }
  }

  servicedelete(id: any) {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const statusId = { statusId: id };

      this.http
        .post(`${this.apiUrl}statusDelete`,
          statusId,
          { headers }
        )
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_status_update');
              if (elementToClick) {
                elementToClick.click();
              }
              setTimeout(() => {
                this.toastr.success('Status Deleted Successfully.');
              }, 10);
              this.loadStatusList();
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
