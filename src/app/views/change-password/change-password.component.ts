import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../service/common.service';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  hide = true;
  private apiUrl = environment.ApiUrl;
  passwordMatchError: boolean = false;
  submitFormbilling!: FormGroup;

  ngOnInit() {
    this.submitFormbilling = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/)]),
      confirmpassword: new FormControl('', [Validators.required]),
    });
  }

  constructor(
    // private notelistApi: NoteslistService,
    private http: HttpClient,
    private route: Router,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService
  ) {}

  updateuserpassword(information: any): void {

    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

        if (information.oldPassword === '' || information.confirmpassword === '' || information.confirmpassword === null) {
          this.toastr.error('All fields are required.');
          return;
        }

        if (information.password !== information.confirmpassword) {
          this.toastr.error('Passwords do not match.');
          return;
        }


        // Validate password strength
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/;
        if (!passwordRegex.test(information.password)) {
          this.toastr.error('Password must be 8-16 characters long, contain at least one uppercase letter, one digit, and one special character.');
          return;
        }
        this.spinner.show();

      this.http
        .post(`${this.apiUrl}changePassword`, information, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              setTimeout(() => {
                this.toastr.success('Password Updated Successfully.');
              }, 10);
              this.spinner.hide();

            this.route.navigate(['/dashboard']);
            }
            else if (response.status === false) {
              setTimeout(() => {
                this.spinner.hide();
                this.toastr.error('Old Password Does Not Match.');
              }, 30);

            }
          },
          (error: any) => {
            if (error.status === 401) {
              this.commonService.logout();
            }
            console.error('Error sending data', error);
          }
        );
    }
  }
}
