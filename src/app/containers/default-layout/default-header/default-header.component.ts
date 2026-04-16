import { Component, Input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import * as $ from 'jquery';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../../views/service/common.service';
import { Location } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from '../../../views/service/notification.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.scss'],
})
export class DefaultHeaderComponent extends HeaderComponent {
  @Input() sidebarId: string = "sidebar";
  backgroundColor: string = 'lightblue';
  color: string = 'white';
  fontColor: string = 'black';
  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)
  private apiUrl = environment.ApiUrl;
  currentRate = 0;
  companylistData: any;
  sessioncompany = localStorage.getItem('usercompanyId');
  companylist: any[] = [];
  memberlist: any;
  memberlistData: any;

  notificationlistData: any;
  notificationlist: any;
  userpermission: any;

  public uname = localStorage.getItem('username');
  transformedNotifications: any[] = [];

  constructor(private notificationService:NotificationService,private classToggler: ClassToggleService, private renderer: Renderer2, private route: Router,
    private http: HttpClient,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private location: Location) {
    super();

  }
  username: any;
  shortusername: any;
  notres: any;
  ngOnInit() {
    this.usersPermission();
    this.checktoken();
    this.loadCompanyList();
    this.commonService.checkLoggedIn();
    this.spinner.show();
    this.username = localStorage.getItem('username');
    this.shortusername = this.getusernmae(this.username);
    this.getnotification();
    this.getmemberlist();
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 3000);
  }

  usersPermission() {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '{}');
    this.userpermission = permissions.organizationPermission;
    if (this.userpermission.add === 0 && this.userpermission.edit === 0 && this.userpermission.delete === 0) {
      this.route.navigate(['/dashboard']);
    }
  }

  // date

  today: number = Date.now();

  isLightTheme = true;

  getmemberlist() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}profile`, {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.memberlistData = clientslistData;
            this.memberlist = this.memberlistData?.data;
          },
          (error) => { }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  toggleTheme() {

    const cardElements = document.querySelectorAll('.card');

    this.color = this.color === 'white' ? 'black' : 'white';
    this.backgroundColor = this.backgroundColor === '#fff' ? '#000' : '#fff';
    this.renderer.setStyle(document.body, 'background-color', this.backgroundColor);
    this.renderer.setStyle(document.body, 'color', this.color);
    cardElements.forEach((card) => {
      this.renderer.setStyle(card, 'background-color', this.backgroundColor);
      this.renderer.setStyle(card, 'color', this.color);
    });
  }

  // logout() {
  //   localStorage.removeItem('tasklogintoken');
  //   localStorage.removeItem('userid');
  //   localStorage.removeItem('username');
  //   localStorage.removeItem('useremail');
  //   localStorage.removeItem('usercompanyId');
  //   localStorage.removeItem('permissions');
  //   localStorage.removeItem('usertype');
  //   this.route.navigate(['/login']);
  // }


  logout() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
  
      this.http.post(`${this.apiUrl}logout`, {}, { headers })
        .subscribe(
          (response: any) => {
            // Remove all user-related data from local storage
            localStorage.removeItem('tasklogintoken');
            localStorage.removeItem('userid');
            localStorage.removeItem('username');
            localStorage.removeItem('useremail');
            localStorage.removeItem('usercompanyId');
            localStorage.removeItem('permissions');
            localStorage.removeItem('usertype');
            
            // Navigate to the login page
            this.route.navigate(['/login']);
          },
          (error: any) => {
            console.error('Error during logout', error);
          }
        );
    }
  }
  


  checktoken() {
    if (!localStorage.getItem('tasklogintoken')) {
      this.route.navigate(['/login']);
    }
  }

  loadCompanyList() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(`${this.apiUrl}companyList`, { headers })
        .subscribe(
          (companylistData: any) => {
            this.companylistData = companylistData;
            this.companylist = companylistData?.data;

            const sessionId = Number(this.sessioncompany);

            const index = this.companylist.findIndex(company => company.id === sessionId);

            if (index !== -1) {
              this.sessioncompany = this.companylist[index].id;
            } else {
              this.sessioncompany = null;
            }
          },
          (error) => {
            console.error('Error loading company list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }



  onCompanySelect(companyID: any) {

    const token = localStorage.getItem('tasklogintoken');
    if (!token) {
      console.log('No token found in localStorage.');
      return;
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    const requestData = {
      companyID: companyID,
    };

    this.http.post(`${this.apiUrl}comapnyChange`, requestData, { headers }).subscribe(
      (response: any) => {
        if (response.status === true) {
          localStorage.removeItem('usercompanyId');
          localStorage.setItem('usercompanyId', response.companyID);
          const currentUrl = this.location.path();
          if (currentUrl === '/dashboard') {
            window.location.reload();
          } else {
            this.route.navigate(['/dashboard']);
          }
        }
      },
      (error: any) => {
        console.error('Error sending data', error);
      }
    );
  }

  getusernmae(name: any) {
    return name.split(' ').map((name: string) => name.charAt(0)).join('');
  }

  getnotification() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(`${this.apiUrl}notificationList?companyID=` + this.sessioncompany, { headers })
        .subscribe(
          (companylistData: any) => {
            this.notificationlistData = companylistData;
            this.notificationlist = this.notificationlistData;
            const transformed = this.transformNotifications();

            this.notificationService.pushNotify(transformed);
          },
          (error) => {
            console.error('Error loading Notification list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  transformNotifications() {
    if (!this.notificationlist?.data || !Array.isArray(this.notificationlist.data)) {
      return [];
    }

    this.transformedNotifications = this.notificationlist.data.map((notification: { userName: any; message: any; massage?: any; taskTitle: any; is_setModule: any; }) => {
      const message = notification.message || notification.massage || 'You have a new notification.';
      const is_setModule = notification.is_setModule || 'Notification';

      return {
        title: `${is_setModule} Update`,
        body: `${message}`,
        icon: 'https://app.tasknote.in/assets/tasknote_Favicon.svg',
        url: 'https://app.tasknote.in/',
        status: true,
        message: 'Notification list successfully',
      };
    });

    return this.transformedNotifications;
  }
}
