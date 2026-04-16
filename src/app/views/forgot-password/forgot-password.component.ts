import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

interface ApiResponse {
  data: any; // You can specify the actual data type you expect here
  // Add other properties as needed based on the response structure
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  private apiUrl = environment.ApiUrl;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  matcher = new MyErrorStateMatcher()
  groupForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private route: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
  ) {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
    this.groupForm = this.fb.group({
      email: ['', Validators.required],
    });
  }
  ngOnInit() { }
  onSubmit(information: any) {
    //console.log(information);
    if (information.email == '') {
      this.toastr.error('Please enter the email.');
      return
    }
    this.spinner.show();

    this.http
      .post(`${this.apiUrl}forgotPassword`, information)
      .subscribe(
        (response: any) => {
          if (response.status == true) {
            this.toastr.success('Mail Send Successfully');
            this.groupForm.reset();
            this.spinner.hide();
          }
          else if (response.status == false){
            if(response.message == 'Email not current'){
              this.toastr.error('Account & Information You Provided is Not Found.');
              this.spinner.hide();
            }
          }
        },
        (error) => {
          this.spinner.hide();
          console.error('Error loading projects list:', error);
        }
      );
  }

}
