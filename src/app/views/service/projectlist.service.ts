import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProjectlistService {
  private apiUrl = environment.ApiUrl + 'projectList';
  [x: string]: any;

  constructor(private httpClient: HttpClient) {}

  getprojectslist(): Observable<any> {
    return this.httpClient.get<any>(this.apiUrl).pipe(
      catchError(this.errorHandler)
    );
  }

  private errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}