import { Component } from '@angular/core';
import { CommonService } from '../service/common.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../service/notification.service';
import Pusher from 'pusher-js';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {
  private pushID = environment.pushID;
 
  constructor(private router:Router,private commonService: CommonService, private spinner: NgxSpinnerService, private notificationService: NotificationService) {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);

    this.commonService.checkPalnValid().subscribe(
      (usersubscriptiondata) => {
        if(usersubscriptiondata.totalDay >= 0 && usersubscriptiondata.status == false){
           this.router.navigate(['/subscription-plan']);
         }
        },
      (error) => {
        console.error('Error fetching subscription data:', error);
      }
    );
  }
  ngOnInit() {
    this.commonService.checkLoggedIn();
    if (localStorage.getItem('userid') !== null) {
      Pusher.logToConsole = false;

      const pusher = new Pusher(`${this.pushID}`, {
        cluster: 'ap2'
      });

      const userId = parseInt(localStorage.getItem('userid') || '0', 10);
      let channel3 = pusher.subscribe(`pushnotification.${userId}`);

      channel3.bind('push-notification', (data: any) => {
        console.log('Push notification received:', data);
        if (userId === data.message?.userId || parseInt(data.message?.userId || '0' || '0', 10) === userId) {
          this.notificationService.pushNotify(data.message);
        }

      });
    }
  }
}
