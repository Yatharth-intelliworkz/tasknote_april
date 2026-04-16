import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../service/common.service';
import { environment } from 'src/environments/environment';
import {
  ActivatedRoute,
  RouterLink,
  RouterModule,
  Router,
} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    RouterLink,
  ],
})
export class SignupComponent {
  private apiUrl = environment.ApiUrl;
  @ViewChild('clearaddform') clearaddform: any;
  registerForm!: FormGroup;
  hide = true;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  confirmPasswordControl = new FormControl('', [Validators.required]);


  constructor(
    private formBuilder: FormBuilder,
    private fb: FormBuilder,
    private http: HttpClient,
    private commonService: CommonService,
    private toastr: ToastrService,
    private elementRef: ElementRef,
    private route: Router
  ) {

    this.registerForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phone_no: [null, [Validators.required]],
      password: [null, [Validators.required]],
      confirmPassword: this.confirmPasswordControl,
    });

  }

  ngOnInit() {
    this.checkLoggedIn();
  }

  checkLoggedIn() {
    if (localStorage.getItem('tasklogintoken')) {
      this.route.navigate(['/dashboard']);
    }
  }

  UseRegister(information: any, clearaddform: any) {
    const formData = new FormData();
    Object.keys(this.registerForm.value).forEach((key) => {
      formData.append(key, this.registerForm.value[key]);
    });
    information = this.registerForm.value;
    if(information.name == null || information.phone_no == null || information.email == '' || information.confirmPassword == ''){
      this.toastr.error('Please Fill All The Fields.');
      return
    }

    this.http.post(`${this.apiUrl}register`, formData).subscribe(
      (response: any) => {
        if (response.status === true) {
          this.clearaddform.resetForm();
          this.toastr.success('Register Successfully.');
          this.route.navigate(['/login']);
        }else{
          this.toastr.error(response.message);
        }
      },
      (error: any) => {
        
        console.error('Error sending data', error);
      }
    );
  }
}
