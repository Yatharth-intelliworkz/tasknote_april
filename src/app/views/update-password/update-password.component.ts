import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../service/common.service';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent {
  private apiUrl = environment.ApiUrl;

  hide = true;
  token: string | null = null;
  constructor(private route: ActivatedRoute,  private toastr: ToastrService,
    private commonService: CommonService,    private http: HttpClient,private router: Router,

    private spinner: NgxSpinnerService) {}
  ngOnInit(): void {
    // Get the token from query parameters
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
    });
  }

  updateuserpassword(information: any){
      const headers = new HttpHeaders()
        .set('Accept', 'application/json');

        if (information.password !== information.confirmpassword) {
          this.toastr.error('Passwords do not match.');
          return;
        }
        information.token = this.token;

        // // Validate password strength
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/;
        if (!passwordRegex.test(information.password)) {
          this.toastr.error('Password must be 8-16 characters long, contain at least one uppercase letter, one digit, and one special character.');
          return;
        }
        this.spinner.show();

      this.http
        .post(`${this.apiUrl}forgotPasswordUpdate `, information, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              setTimeout(() => {
                this.toastr.success('Password Updated Successfully.');
              }, 10);
              this.spinner.hide();

            this.router.navigate(['/dashboard']);
            }
            else if (response.status === false) {
              setTimeout(() => {
                this.spinner.hide();
                this.toastr.error(response.message);
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
