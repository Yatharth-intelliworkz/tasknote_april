import { Component,Pipe, PipeTransform } from '@angular/core';
import { CommonService } from '../service/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NgFor, NgIf, DatePipe } from '@angular/common';


@Component({
  selector: 'app-subscription-history',
  templateUrl: './subscription-history.component.html',
  styleUrls: ['./subscription-history.component.scss'],
 
})
export class SubscriptionHistoryComponent {
    private apiUrl = environment.ApiUrl;
  PlanData:any;
  constructor(private commonService: CommonService,private spinner: NgxSpinnerService,private http: HttpClient,
  
  ) {}
  ngOnInit(){
  this.commonService.checkLoggedIn();
  this.getyourplan();
  
}

getyourplan(){
   const token = localStorage.getItem('tasklogintoken');
      if (token) {
        this.spinner.show();
        const headers = new HttpHeaders()
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json');
        this.http
          .get(`${this.apiUrl}yourPlan`, { headers })
          .subscribe(
            (PlanDetails: any) => {
              this.PlanData =PlanDetails.data;
              this.spinner.hide();
            },
            (error) => {
              this.spinner.hide();
              console.error('Error loading projects list:', error);
            }
          );
      } else {
        this.spinner.hide();
        console.log('No token found in localStorage.');
      }
}

}
