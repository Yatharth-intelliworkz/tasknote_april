import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ElementRef, Renderer2, NgModule, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../service/common.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-task-type',
  templateUrl: './task-type.component.html',
  styleUrls: ['./task-type.component.scss']
})
export class TaskTypeComponent {
  @ViewChild('submitForm') submitForm!: NgForm;
  fileForm!: FormGroup;
  servicelistData: any;
  servicelist: any;
  companyId: any;
  private apiUrl = environment.ApiUrl;
  loading: boolean = false;
  editnoteslistData: any;
  noteslistedit: any = {
    title: null,
    serviceID: null,
  };
  selectedServiceId: any;
  userpermission: any;

  constructor(private fb: FormBuilder, private formBuilder: FormBuilder, private http: HttpClient, private commonService: CommonService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router, private elementRef: ElementRef,
    private renderer: Renderer2,
    private spinner: NgxSpinnerService) {
    this.fileForm = this.formBuilder.group({
      multiplefile: ['initialValue'],
    });
  }

  ngOnInit(): void {
    this.usersPermission();
    this.commonService.checkLoggedIn();
    this.route.paramMap.subscribe(params => {
      this.companyId = params.get('id');
      this.getservicelist();
    });
  }

  usersPermission() {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '{}');
    this.userpermission = permissions.organizationPermission;
    if (this.userpermission.add === 0 && this.userpermission.edit === 0 && this.userpermission.delete === 0) {
      this.router.navigate(['/dashboard']);
    }
  }

  editForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    serviceID: new FormControl(null) // Note: Assuming noteID is a number
  });

  insertservice(information: any): void {
    const token = localStorage.getItem('tasklogintoken');
    if (information.title === '') {
      this.toastr.error('Please fill service name');
      return;
    }
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
        const formData = new FormData();
        formData.append('companyId', this.companyId);
        formData.append('title', information.title);
    
      this.http
        .post(`${this.apiUrl}taskTypeAdd`,
          formData,
          { headers }
        )
        .subscribe(
          (response: any) => {
            if (response) {
              this.toastr.success('Task Type Added Successfully.');
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn');
              if (elementToClick) {
                elementToClick.click();
              }
              this.getservicelist();
              this.submitForm.reset(); // Reset the form here
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

  filterItems(event: Event) {
    // Cast the event to InputEvent
    const inputEvent = event as InputEvent;

    // Access the target property to get the input element
    const inputElement = inputEvent.target as HTMLInputElement;

    // Get the value from the input element
    const searchTerm = inputElement.value.toLowerCase(); // Convert to lower case for case-insensitive search

    if (!searchTerm) {
      this.getservicelist(); // Return all projects if search term is empty
    } else {
      this.servicelist = this.servicelist.filter((project: any) =>
        // Check if the properties are not null or undefined before accessing them
        (project.title?.toLowerCase().includes(searchTerm))
      );
    }
  }

  getservicelist() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}taskTypeList?companyID=` + this.companyId, {
          headers,
        })
        .subscribe(
          (noteslistData: any) => {
            this.servicelistData = noteslistData;
            this.servicelist = this.servicelistData?.data;
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
      const serviceID = { typeID: id };

      this.http
        .post(`${this.apiUrl}taskTypeDelete`,
          serviceID,
          { headers }
        )
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_delete_service');
              if (elementToClick) {
                elementToClick.click();
              }
              setTimeout(() => {
                this.toastr.success('Task Type Deleted Successfully.');
              }, 10);
              this.getservicelist();
              this.spinner.hide();
            }
          },
          (error: any) => {
            this.spinner.hide();
            console.error('Error sending data', error);
          }
        )
        .add(() => (this.loading = false));
    }
  }

  serviceedit(id: number) {
    this.loading = true; // Start loader
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Accept', 'application/json');
      this.http.get(`${this.apiUrl}taskTypeGet?typeID=` + id, { headers }).subscribe(
        (editnoteslistData: any) => {
          this.editnoteslistData = editnoteslistData;
          this.noteslistedit = this.editnoteslistData?.data;
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
        }
      )
        .add(() => (this.loading = false));
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }

  updateservice(): void {
    const information = this.editForm.value;

    if (information.title === '') {
      this.toastr.error('Please fill Task Type name');
      return;
    }
    if (this.editForm.invalid) {
      // Form is invalid, show error messages
      this.editForm.markAllAsTouched();
      return;
    }

    const token = localStorage.getItem('tasklogintoken');
    if (!token) {
      console.log('No token found in localStorage.');
      return;
    }
    this.spinner.show();
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    this.http.post(`${this.apiUrl}taskTypeEdit`, this.editForm.value, { headers }).subscribe(
      (response: any) => {
        if (response.status === true) {
          const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_edit');
          if (elementToClick) {
            elementToClick.click();
          }
          this.toastr.success('Task Type Edited Successfully.');
          this.getservicelist();
          this.spinner.hide();
          // Do not dismiss the modal here
        }
      },
      (error: any) => {
        this.spinner.hide();
        console.error('Error sending data', error);
      }
    )
      .add(() => (this.loading = false));
  }
}
