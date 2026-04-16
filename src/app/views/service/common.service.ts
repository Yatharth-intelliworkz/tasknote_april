import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  companylistData: any;
  sessioncompany = localStorage.getItem('usercompanyId');
  companylist: any[] = [];
  UsersDataforsubscription: any[] = [];
  private apiUrl = environment.ApiUrl;

  constructor(private router: Router, private http: HttpClient) {
    this.checkPalnValid();
  }

  checkLoggedIn() {
    if (!localStorage.getItem('tasklogintoken')) {
      this.router.navigate(['/login']);
    }
  }
  checkLoginStatus() {
    const loginTime = this.getCookie('loginTime');
    if (loginTime) {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - parseInt(loginTime);

      // 2 days in milliseconds = 2 * 24 * 60 * 60 * 1000
      const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;

      if (timeDiff > twoDaysInMilliseconds) {
        this.clearCookies();
        this.router.navigate(['/login']); // Redirect to login
      }
    }
  }

  getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift();
    }
    return undefined;
  }

  clearCookies() {
    document.cookie = 'loginTime=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Clear other cookies if necessary
  }
  logout() {
    localStorage.removeItem('tasklogintoken');
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
    localStorage.removeItem('useremail');
    localStorage.removeItem('usercompanyId');
    this.router.navigate(['/login']);
  }

  getAuthHeaders(token: string) {
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
  }

  getTaskRequestPayload(requireUserId = false) {
    const companyID = localStorage.getItem('usercompanyId');
    const userID = localStorage.getItem('userid');

    if (!companyID) {
      console.error('No company ID found in localStorage.');
      return null;
    }

    if (requireUserId && !userID) {
      console.error('No user ID found in localStorage.');
      return null;
    }

    return userID ? { companyID, userID } : { companyID };
  }

  checkPalnValid(): Observable<any> {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = this.getAuthHeaders(token);
      return this.http.get(`${this.apiUrl}checkPalnValid`, { headers });
    } else {
      return throwError('No token found');
    }
  }
}
