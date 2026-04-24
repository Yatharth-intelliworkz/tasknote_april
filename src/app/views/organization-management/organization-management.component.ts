import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../service/common.service';
import { environment } from 'src/environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgFor, NgIf } from '@angular/common';
import { DefaultHeaderComponent } from '../../containers/default-layout/default-header/default-header.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-organization-management',
  templateUrl: './organization-management.component.html',
  styleUrls: ['./organization-management.component.scss'],
  standalone: true,
  imports: [MatDividerModule, RouterLink, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, NgIf, NgFor, NgxSpinnerModule],
})
export class OrganizationManagementComponent implements OnInit {
  // private companyheader = def

  companylistData: any;
  companylist: any;
  companyForm!: FormGroup;
  editcompanylistData: any;
  companylistedit: any;
  email = new FormControl('', [Validators.required, Validators.email]);
  private apiUrl = environment.ApiUrl;
  loading: boolean = false;
  editForm: FormGroup;
  selectedImage: File | null = null;
  selectedEditImage: File | null = null;
  clearaddform: any;
  selectedCompanyId: any;
  fileToUpload: any;
  imageUrl: any;
  fileToUploadadd: any;
  imageUrladd: any;
  permissions: any;
  submitted = false;
  editSubmitted = false;

  getErrorMessage(controlName: string) {
    const control = this.companyForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required.';
      return 'This field is required.';
    }
    if (control?.hasError('email_id')) {
      return 'Invalid email address.';
    }
    if (control?.hasError('name')) {
      return 'Invalid name.';
    }
    if (control?.hasError('address')) {
      return 'Invalid address address.';
    }
    if (control?.hasError('phone_no')) {
      return 'Invalid Phone No.';
    }
    if (control?.hasError('description')) {
      return 'Invalid Description.';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.companyForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  isEditFieldInvalid(fieldName: string): boolean {
    const field = this.editForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.editSubmitted));
  }
  constructor(
    // private notelistApi: NoteslistService,
    private http: HttpClient,
    private route: Router,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private elementRef: ElementRef,
    private spinner: NgxSpinnerService,
    private router:Router
    // public defaultHeaderComponent: DefaultHeaderComponent,
  ) {
    this.spinner.show();
    this.initForm();
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', Validators.required],
      phone_no: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(10), Validators.maxLength(10)]],
      email_id: ['', [Validators.required, Validators.email]],
      description: ['', Validators.required],
      companyID: ['', Validators.required],
    });

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

  ngOnInit() {
    this.commonService.checkLoggedIn();
    this.permission();
    this.loadCompanyList();
    this.cdr.detectChanges();
  }

  permission() {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '{}');
    this.permissions = permissions.organizationPermission;
    if (this.permissions.add === 0 && this.permissions.edit === 0 && this.permissions.delete === 0) {
      this.route.navigate(['/dashboard']);
    }
  }
  initForm(): void {

    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone_no: ['', Validators.required],
      email_id: ['', [Validators.required, Validators.email]],
      description: [''],
    });
  }

  loadCompanyList() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(`${this.apiUrl}companyFounderList`, { headers })
        .subscribe(
          (companylistData: any) => {
            this.companylistData = companylistData;
            this.companylist = companylistData?.data;
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

  onFileChange(event: any) {

    const file = (event.target as HTMLInputElement).files?.item(0);
    if (file) {
      this.selectedImage = file;
    }
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      this.fileToUploadadd = files.item(0);
      let readers = new FileReader();
      readers.onload = (readerEvents: any) => {
        this.imageUrladd = readerEvents.target.result;
      };
      readers.readAsDataURL(this.fileToUploadadd);
    } else {
      // Handle the case when no file is selected
      this.fileToUploadadd = null;
      this.imageUrladd = null;
    }
  }

  addCompany(clearaddform: any): void {
    const token = localStorage.getItem('tasklogintoken');

    // Validate form before submission
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      this.submitted = true;
      return;
    }

    const formData = new FormData();
    formData.append('logo', this.selectedImage!);

    // Assuming information is an object containing additional form data
    const information = this.companyForm.value;

    // Append other form data properties to formData
    Object.keys(information).forEach((key) => {
      formData.append(key, information[key]);
    });

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      if (this.companyForm.valid) {
        this.spinner.show();
        this.http.post(`${this.apiUrl}companyAdd`, formData, { headers })
          .subscribe(
            (response: any) => {
              if (response.status === true) {
                const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_company_add');
                if (elementToClick) {
                  elementToClick.click();
                }
                clearaddform.resetForm();
                this.submitted = false;
                this.companyForm.reset();
                this.selectedImage = null;
                this.imageUrladd = null;
                this.loadCompanyList();
                this.spinner.hide();
                // this.defaultHeaderComponent.loadCompanyList();
                setTimeout(() => {
                  this.toastr.success('Company Added Successfully.');
                }, 10);
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


  editcompany(id: number) {
    this.loading = true; // Start loader

    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Accept', 'application/json');
      this.http.get(`${this.apiUrl}companyGet?companyID=` + id, { headers }).subscribe(
        (editcompanylistData: any) => {
          this.editcompanylistData = editcompanylistData;
          this.companylistedit = this.editcompanylistData?.data;

          // Update the form values with the received data
          this.editForm.patchValue({
            name: this.companylistedit.name,
            address: this.companylistedit.address,
            phone_no: this.companylistedit.phone_no,
            email_id: this.companylistedit.email_id,
            description: this.companylistedit.description,
            companyID: this.companylistedit.id,
            logo: this.companylistedit.logo,
          });
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          if (error.status === 401) {
            this.commonService.logout();
          }
        }
      )
        .add(() => (this.loading = false));
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }

  onEditFileChange(event: any) {

    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.selectedEditImage = file;
    }
    const filesedit: FileList = event.target.files;

    if (filesedit && filesedit.length > 0) {
      this.fileToUpload = filesedit.item(0);
      let readeredit = new FileReader();
      readeredit.onload = (readerEventedit: any) => {
        this.imageUrl = readerEventedit.target.result;
      };
      readeredit.readAsDataURL(this.fileToUpload);
    } else {
      // Handle the case when no file is selected
      this.fileToUpload = null;
      this.imageUrl = null;
    }
  }


  UpdateCompany() {
    const token = localStorage.getItem('tasklogintoken');

    // Validate form before submission
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.editSubmitted = true;
      return;
    }

    const formData = new FormData();
    formData.append('logo', this.selectedEditImage!);

    // Assuming information is an object containing additional form data
    const information = this.editForm.value;

    // Append other form data properties to formData
    Object.keys(information).forEach((key) => {
      formData.append(key, information[key]);
    });

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      if (this.editForm.valid) {
        this.spinner.show();
        this.http.post(`${this.apiUrl}companyEdit`, formData, { headers })
          .subscribe(
            (response: any) => {
              if (response.status === true) {
                const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_company_update');
                if (elementToClick) {
                  elementToClick.click();
                }
                this.editSubmitted = false;
                setTimeout(() => {
                  this.toastr.success('Company Updated Successfully.');
                }, 10);
                this.loadCompanyList();
                this.spinner.hide();
                // this.defaultHeaderComponent.loadCompanyList();
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

  deletecompanyopendialogue(id: any) {
    this.selectedCompanyId = id;
    const modal = document.getElementById('deleteprojectModal');
  }

  confirmDelete(): void {
    if (this.selectedCompanyId) {
      this.deletecompany(this.selectedCompanyId);
    }
  }


  deletecompany(id: any) {
    this.loading = true; // Start loader
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const companyID = { companyID: id };

      this.http
        .post(`${this.apiUrl}companyDelete`,
          companyID,
          { headers }
        )
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_delete_company');
              if (elementToClick) {
                elementToClick.click();
              }
              setTimeout(() => {
                this.toastr.success('Company Deleted Successfully.');
              }, 10);
              this.loadCompanyList();
              this.spinner.hide();
              // this.defaultHeaderComponent.loadCompanyList();
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
}
