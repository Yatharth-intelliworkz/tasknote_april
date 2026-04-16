import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { Observable, throwError, map } from 'rxjs';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Location, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
interface ApiResponse {
  data: any; // You can specify the actual data type you expect here
  // Add other properties as needed based on the response structure
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
    NgxSpinnerModule,
  ],
})
export class LoginComponent {
  hide = true;
  private apiUrl = environment.ApiUrl;
  userpermission: any;
  projectPermission: any;
  permissions: any;
  tokenStore: string | undefined;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passwordFormControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();
  email: string = '';
  password: string = '';
  router: any;
  location_city:any;  

  constructor(
    private http: HttpClient,
    private route: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private location:Location
  ) {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }
  ngOnInit() {
    this.checkLoggedIn();
    this.getUserLocation();
  }

  private getUserCityFromCoordinates(
    latitude: number,
    longitude: number
  ): Observable<string> {
    return this.http
      .get<any>(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
      )
      .pipe(map((response) => response.address.city || 'Ahmedabad'));
  }

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.getUserCityFromCoordinates(latitude, longitude).subscribe(
            (city) => {
              this.location_city = city;
              console.log('User city:', city);
            }
          );
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  login() {
    this.spinner.show();
    this.http
      .post<ApiResponse>(`${this.apiUrl}login`, {
        email: this.email,
        password: this.password,
        location: this.location_city,
      })
      .pipe(
        catchError((error) => {
          this.spinner.hide();
          console.error('API Error:', error);
          this.route.navigate(['/login']);
          this.toastr.error('Email & Password do not match.');
          return throwError(error);
        })
      )
      .subscribe((response: ApiResponse) => {
        const responseData = response.data;
        if (responseData) {
          setTimeout(() => {
            this.toastr.success('Logged in successfully.');
          }, 10);
          this.tokenStore = responseData.token;
          this.usersPermission();
          localStorage.setItem('tasklogintoken', responseData.token);
          localStorage.setItem('userid', responseData.id);
          localStorage.setItem('username', responseData.name);
          localStorage.setItem('useremail', responseData.email);
          localStorage.setItem('usercompanyId', responseData.company_id);
          localStorage.setItem('usertype', responseData.user_type);
          localStorage.setItem('ownerChceck', responseData.ownerChceck);
          const loginTime = new Date().getTime();
          document.cookie = `loginTime=${loginTime}; path=/;`;
        } else {
          this.spinner.hide();
          this.route.navigate(['/login']);
          setTimeout(() => {
            this.toastr.error('Email & Password do not match.');
          }, 10);
        }
      });
  }

  usersPermission() {
    const token = this.tokenStore;
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http.get(`${this.apiUrl}userAllPermission`, { headers }).subscribe(
        (response: any) => {
          this.permissions = response.data;
          localStorage.setItem('permissions', JSON.stringify(this.permissions));
          // console.log('Permissions stored:', this.permissions);
          this.route.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Permission Error:', error);
        }
      );
    } else {
      console.log('No token found.');
    }
  }

  checkLoggedIn() {
    if (localStorage.getItem('tasklogintoken')) {
      this.route.navigate(['/dashboard']);
    }
  }
}
