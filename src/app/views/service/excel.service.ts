import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  private apiUrl = environment.ApiUrl;
  constructor(private http: HttpClient) {}

  readExcel(file: File): Observable<any[]> {
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        observer.next(data);
        observer.complete();
      };
      reader.readAsBinaryString(file);
    });
  }

  sendData(data: any[],companyId:any): Observable<any> {
    const token = localStorage.getItem('tasklogintoken');
  
  
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('Accept', 'application/json');
// console.log(data);

    const apiUrl = this.apiUrl+'importclinet';  // Replace with your API endpoint
    const body = {
      datas: data,
      companyid:companyId
    };
    return this.http.post(apiUrl, body ,{headers});
  }
}
