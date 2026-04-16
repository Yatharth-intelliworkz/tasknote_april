import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubmittimeService {
  private apiUrl = environment.ApiUrl; // Corrected variable name
  constructor(private http: HttpClient) { }

  updatetime(information: any) {
    console.log('Received information:', information);

    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .post(`${this.apiUrl}actualTimeUpdate`, information, { headers }) // Fixing interpolation
        .subscribe(
          (companylistData: any) => {
            // Handle successful response
          },
          (error) => {
            console.error('Error loading company list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }
}
