import { Component, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import {
  UntypedFormControl,
  FormControl,
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  NgModel,
  Validators
} from '@angular/forms';
import { CommonService } from '../service/common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { id } from 'date-fns/locale';
import { NgIf } from '@angular/common';
import { DefaultHeaderComponent } from '../../containers/default-layout/default-header/default-header.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf
  ],
})
export class ProfileComponent {
  noteslistData: any;
  noteslist: any;
  private apiUrl = environment.ApiUrl;
  selectedImage: File | null = null;
  imageUrl: any;
  fileToUpload: any;

  constructor(
    // private notelistApi: NoteslistService,
    private http: HttpClient,
    private route: Router,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private elementRef: ElementRef,
    private commonService: CommonService,
    private spinner: NgxSpinnerService
  ) {
    this.spinner.show();}
  ngOnInit() {
    this.commonService.checkLoggedIn();
    this.getprofile();
    this.cdr.detectChanges();
  }
  email = new FormControl();

  getprofile() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}profile`, {
          headers,
        })
        .subscribe(
          (noteslistData: any) => {
            this.noteslistData = noteslistData;
            this.noteslist = this.noteslistData?.data;
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

  onFileChange(event: any) {
  const files: FileList = event.target.files;

  if (files && files.length > 0) {
    const file: File = files[0];

    // Check if file size is less than or equal to 5 MB
    if (file.size <= 2 * 1024 * 1024) { // 5 MB in bytes
      this.selectedImage = file;

      let reader = new FileReader();
      reader.onload = (readerEvent: any) => {
        this.imageUrl = readerEvent.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.toastr.error('File size exceeds the limit of 2 MB.');
      (event.target as HTMLInputElement).value = ''; // Reset the input field
      this.fileToUpload = null;
      this.imageUrl = null;
    }
  } else {
    // Handle the case when no file is selected
    this.fileToUpload = null;
    this.imageUrl = null;
  }
}


  updateuser(information: any): void {
    this.spinner.show();
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
        const formData = new FormData();
        formData.append('profile', this.selectedImage!);
        Object.keys(information).forEach((key) => {
          formData.append(key, information[key]);
        });
      this.http
        .post(`${this.apiUrl}updateProfile`, formData, {
          headers,
        })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_profile');
        if (elementToClick) {
          elementToClick.click();
        }
        setTimeout(() => {
          this.toastr.success('Profile Detail Updated Successfully.');
        }, 10);
              this.getprofile();
              this.spinner.hide();
              window.location.reload();
            }
          },
          (error: any) => {
            this.spinner.hide();
            console.error('Error sending data', error);
          }
        );
    }
  }

  updateuserbilling(information: any): void {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
        // gst validation
        // if(information.gst_no !== ''){
        //   const gstRegex = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;
        //   if (!gstRegex.test(information.gst_no)) {
        //     this.toastr.error('Please Enter Valid GST No.');
        //     return;
        //   }
        // }
        this.spinner.show();
      this.http
        .post(`${this.apiUrl}updateBilling`, information, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_billing');
        if (elementToClick) {
          elementToClick.click();
        }
        setTimeout(() => {
          this.toastr.success('Billing Detail Updated Successfully.');
        }, 10);
              this.getprofile();
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
  getInitials(name: string): string {
    return name.split(' ').map(name => name.charAt(0)).join('');
    }


    removeprofilepic(){
      this.spinner.show();
      const token = localStorage.getItem('tasklogintoken');
      if (token) {
        const headers = new HttpHeaders()
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json');
        this.http
          .get(`${this.apiUrl}profileremove`, {
            headers,
          })
          .subscribe(
            (response: any) => {
              if (response.status === true) {
                const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_remove_profile');

                if (elementToClick) {
                  elementToClick.click();
                }

                setTimeout(() => {
                  this.toastr.success('Profile Picture Remove Successfully.');
                }, 10);

                this.getprofile();
                this.spinner.hide();
              }
            },
            (error) => {
              this.spinner.hide();
              if (error.status === 401) {
                this.commonService.logout();
              }
              console.error('Error during profile removal:', error);
            }
          );
      } else {
        console.log('No token found in localStorage.');
      }
    }


}
