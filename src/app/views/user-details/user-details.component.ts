import { Component, Input, Output, EventEmitter, ChangeDetectorRef,AfterViewInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; 
import { ColDef } from 'ag-grid-community';
import { MatIcon } from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { UserListComponent } from './user-list/user-list.component';
import { CommonService } from '../service/common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgFor, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../service/notification.service';
import Pusher from 'pusher-js';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  standalone: true,
  imports: [MatListModule, NgbRatingModule, UserListComponent,NgFor,NgIf],
  styles: [
		`
			i {
				font-size: 1.5rem;
				padding-right: 0.1rem;
				color: #b0c4de;
			}
			.filled {
				color: #1e90ff;
			}
			.low {
				color: #deb0b0;
			}
			.filled.low {
				color: #ff1e1e;
			}
		`,
	],

})
export class UserDetailsComponent {
	@Input() memberdata: any;
  @Input() rowData: any; 
  @Input() rowOverDueData: any; 
  @Input() rowUpcomingData: any; 
  @Input() rowCompletedData: any; 

	@Output() memberDataChange: EventEmitter<any> = new EventEmitter<any>();
  private pushID = environment.pushID;
  public domainName = environment.domainName;
  currentRate = 1;
  memberlistData: any;
  randomcolor:any;
  colors:any;
  loading: boolean = false;
  activedUser:any;
  private apiUrl = environment.ApiUrl;
  taskListData:any;
  taskListDatas:any;
  editbutton:any;
  addbutton:any;
  companyId:any;
  statuslistData:any;
  public columnDefs: ColDef[] = [
    { field: "createdName", headerName: "Created By" },
    { field: "description",
      cellRenderer: (params: any) => {
        return `<a class="table_link" href="/view-task/${params.data.task_id}">${params.value}</a>`;
      },
      headerName: "Task Name", },
    { valueGetter: (params:any) => {
      return params.data.memberData.map((member:any) => member.name).join(', ');
    }, headerName: "Assignees" },
    { field: "created_at", headerName: "Create Date" },
    { field: "due_date", headerName: "Due Date" },
    { field: "status", headerName: "Status" },
    { field: "clientName", headerName: "Client Name" },
    { field: "projectName", headerName: "Project Name" },
  ];
  public defaultColDef: ColDef = {
    editable: true,
    filter: true,
  };
  public themeClass: string =
    "ag-theme-quartz";
  
    pagination = true;
   paginationPageSize = 20;
   paginationPageSizeSelector = [20, 50, 100];

  constructor(
	private commonService: CommonService,
	private http: HttpClient,
	private spinner: NgxSpinnerService,
  private notificationService: NotificationService,
    private toastr: ToastrService,private cdr: ChangeDetectorRef,private router:Router) {
      this.spinner.show();
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
  ngOnInit():void{
  this.commonService.checkLoggedIn();
  this.getcompanyuser();
  this.randomcolor = this.getRandomColor();
  this.companyId = localStorage.getItem('usercompanyId');

  if(localStorage.getItem('userid') !== null){
  Pusher.logToConsole = false;    
    
  const pusher = new Pusher(`${this.pushID}`, {
    cluster: 'ap2'
  });

  const userId = parseInt(localStorage.getItem('userid') || '0', 10);
  let channel3 = pusher.subscribe(`pushnotification.${userId}`);

  channel3.bind('push-notification', (data: any) => {
    console.log('Push notification received:', data);
    if(userId === data.message?.userId || parseInt(data.message?.userId || '0' || '0', 10) === userId){
      this.notificationService.pushNotify(data.message);
    }
  });
}
}

getcompanyuser(){
	const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}userMemberList?companyID=`+localStorage.getItem('usercompanyId'), {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.memberlistData = clientslistData?.data;
			this.colors = this.memberlistData.map(() => this.getRandomColor());
			this.memberdata = this.showusresdetails(this.memberlistData[0].id);
			this.memberDataChange.emit(this.memberdata);
			this.cdr.detectChanges();
      this.spinner.hide();
          },
          (error) => {}
        );
    } else {
      console.log('No token found in localStorage.');
    }
}

selectStatus(statuses:string, todaytask:any): void {
  this.spinner.show();

    this.loading = true; // Start loader

    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      const dataArray = { taskID: todaytask, status: statuses };
      this.http
        .post(`${this.apiUrl}taskStatusUpdate`, dataArray, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
                setTimeout(() => {
                  this.toastr.success('Status Updated Successfully.');
                }, 10);
            }
            this.spinner.hide();
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        )
        .add(() => (this.loading = false)); // Stop loader on completion (success or error)
    }
  }

getInitials(name: string): string {
	return name.split(' ').map(name => name.charAt(0)).join('');
  }



  getRandomColor(): string {
	// Generate a random color using hexadecimal values
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
  }

  showusresdetails(id: any) {
    this.spinner.show();
	this.activedUser = id;
	const token = localStorage.getItem('tasklogintoken');
	if (token) {
	  this.loading = true; // Start loader
	  const headers = new HttpHeaders()
		.set('Authorization', `Bearer ${token}`)
		.set('Accept', 'application/json');
 	  const url = `${this.apiUrl}userDetails?id=${id}`;
      const requestBody = { userID: id,companyID:localStorage.getItem('usercompanyId') };

	  this.http
	  .post(url, requestBody, { headers })
		.subscribe(
		  (clientslistData: any) => {
			this.memberdata = clientslistData?.data;
			this.tasklistusers(id);
      this.spinner.hide();
		},
		  (error) => {}
		).add(() => (this.loading = false));
	} else {
	  console.log('No token found in localStorage.');
	}
  }

  tasklistusers(id:any){
    this.spinner.show();
	const token = localStorage.getItem('tasklogintoken');
	if (token) {
	  this.loading = true; // Start loader
	  const headers = new HttpHeaders()
		.set('Authorization', `Bearer ${token}`)
		.set('Accept', 'application/json');
 	  const url = `${this.apiUrl}userTaskList?id=${id}`;
      const requestBody = { userID: id,companyID:localStorage.getItem('usercompanyId') };

	  this.http
	  .post(url, requestBody, { headers })
		.subscribe(
			(response: any) => {
				this.taskListDatas = response;
				this.memberdata['tasklist'] = this.taskListDatas?.data;
        this.rowData = this.taskListDatas?.data.todayTaskData;
        this.rowOverDueData = this.taskListDatas?.data.overDueTaskData;
        this.rowUpcomingData = this.taskListDatas?.data.upcomingTaskData;
        this.rowCompletedData = this.taskListDatas?.data.completedTaskData;

				this.memberdata['addbutton'] = response.add;
				this.memberdata['editbutton'] = response.edit;
        this.spinner.hide();
			  },
		  (error) => {}
		).add(() => (this.loading = false));
	} else {
	  console.log('No token found in localStorage.');
	}
  }

  statusList(){
    this.spinner.show();
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(`${this.apiUrl}statusList?companyID=` + this.companyId, { headers })
        .subscribe(
          (companylistData: any) => {
            this.statuslistData = companylistData;
            this.memberdata['statuslist']  = companylistData?.data;
            this.spinner.hide();
          },
          (error) => {
            console.error('Error loading company list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }



  adduserfavourite(id:any,is_favourite:any){
    this.spinner.show();
	const clickedValue = is_favourite;
	const favoriteID = id;
	const token = localStorage.getItem('tasklogintoken');

	if (token) {
	  const headers = new HttpHeaders()
		.set('Authorization', `Bearer ${token}`)
		.set('Accept', 'application/json');
		const formData = new FormData();
		formData.append('favoriteID', favoriteID);
		formData.append('is_favorite', clickedValue);

		this.http.post(`${this.apiUrl}userFavorite`,formData , { headers })
		  .subscribe(
			(response: any) => {
			  if (response.status === true) {
				setTimeout(() => {
				  this.toastr.success('Favourite Updated Successfully.');
				}, 10);
				this.getcompanyuser();
			  }
        this.spinner.hide();
			},
			(error: any) => {
			  console.error('Error sending data', error);
			}
		  );

	}

  }
}
