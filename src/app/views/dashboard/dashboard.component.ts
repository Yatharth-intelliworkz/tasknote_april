import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  Renderer2,
  NgModule
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  FormBuilder,
  FormsModule,
  NgControl,
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  Validators,
  NgForm
} from '@angular/forms';

import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonService } from '../service/common.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { MatDatepickerModule, MatYearView } from '@angular/material/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import Chart from 'chart.js/auto';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Injectable, ViewChild } from '@angular/core';
import { NoteslistService } from '../../views/service/noteslist.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Note } from '../../notes';
import { QuillConfigModule, QuillModule } from 'ngx-quill';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { left } from '@popperjs/core';
import Pusher from 'pusher-js';
import { NotificationService } from '../service/notification.service';
declare var introJs: any;
import { MatSlideToggleModule } from '@angular/material/slide-toggle';



interface Memeber {
  item_id: any;
  item_text: string;
  image: string;
  isDisabled?: boolean;
}
interface Client {
  item_id: any;
  item_text: string;
}
interface Reference {
  item_id: any;
  item_text: string;
  item_type: string;
}



@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [
    MatDatepickerModule,
    NgMultiSelectDropDownModule,
    MatFormFieldModule,
    MatSelectModule,
    SlickCarouselModule,
    FormsModule,
    MatInputModule,
    RouterLink,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    QuillModule,
    MatProgressBarModule,
    MatListModule,
    MatMenuModule,
    MatSlideToggleModule,
    TitleCasePipe
  ],
})



export class DashboardComponent implements OnInit {
  intro: any;
  introJS = introJs();
  private pushID = environment.pushID;
  private apiUrl = environment.ApiUrl;
  public domainName = environment.domainName;
  noteslistData: any;
  servicelistData: any;
  noteslist: any;
  dropdownList: any = [];
  selectedItems = [];
  editorContent = '';
  clientslistData: any;
  clientlist: any;
  information = {
    title: '',
    description: '',
    task: '',
    is_expiry: '',
    expiry_date: ''
  };
  dashboardprojectData: any;
  dashboardproject: any;
  clientlistProjectData: any;
  dashboardData: any;
  dashboardDatalist: any;
  dashboardDatalists: any;
  dashboardDataPermission: any;
  dropdownSettings: any = {};
  color: string | undefined;
  loading: boolean = false;
  submitForm!: FormGroup;
  filteredMembers: Array<Client> = [];
  filteredclients: Array<Client> = [];
  title = 'ng-chart';
  statisticschart: any = [];
  taskchart: any = [];
  projects: any;
  projectForm: any;
  selectedImage: any;
  team: Array<Client> = [];
  team1: Array<Client> = [];
  team4: Array<Client> = [];
  team3: Array<Reference> = [];
  clients: Array<Client> = [];
  memberlistData: any;
  clientlistData: any;
  dropdownSettings1: any = {};
  dropdownSettings2: any = {};
  dropdownSettings3: any = {};
  namesArray: string[] = [];
  completedArray: number[] = [];
  incompletedArray: number[] = [];
  companyId: any;
  submitForms: any;
  clientForm: any;
  fileToUpload: any;
  imageUrl: any;
  checklistOpened: boolean | undefined;
  opened!: boolean;
  reminderOpen!: boolean;
  selectedManagerckl: any;
  selectedMembersckl: any;
  referencelistData: any;
  checkListselected!: Date | null;
  mergedArray: any;
  usertypedata: any;
  taskListAll: any;
  dropdownSettings5: any = {};
  responsibletasklist:any;
  checklisttask:any;
  clientslistedit: any = {
    company_name: null,
    name: null,
    phone_no: null,
    email: null,
    address: null,
    gender: null,
    clientId: null,
    is_active: null,
    clinet_code: null
  };

  editForm = new FormGroup({
    company_name: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    phone_no: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    clientId: new FormControl(null),
    is_active: new FormControl(null),
    clinet_code: new FormControl(null) // Note: Assuming noteID is a number
  });
  notificationlistData: any;
  notificationlist: any;
  usersubscriptiondata:any;
  constructor(
    private chartsData: DashboardChartsData,
    private fb: FormBuilder,
    private http: HttpClient,
    private commonService: CommonService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private notificationService: NotificationService,
    private router: Router
  ) {

    this.spinner.show();
    this.submitForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      is_expiry: new FormControl('false', []),
      expiry_date: new FormControl('', []),
      task: new FormControl('', [])
    });

    this.dropdownSettings5 = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    this.projectForm = this.fb.group({
      name: [null],
      manager_id: [null],
      members_id: [null],
      start_date: [null],
      end_date: [null],
      description: [null],
      projectID: '',
      servic_id: '',
      cost: '',
      remark: [''],
      // ckluser_id: [''],
      hours: [''],
      minutes: [''],
    });

    this.dropdownSettings2 = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 7,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };
    this.dropdownSettings3 = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 2,
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };
    this.dropdownSettings1 = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 7,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };

    this.commonService.checkLoginStatus();
    this.commonService.checkPalnValid().subscribe(
      (usersubscriptiondata) => {
        if(usersubscriptiondata.totalDay >= 0 && usersubscriptiondata.status == false){
           this.router.navigate(['/subscription-plan']);
         }
        if(usersubscriptiondata.totalDay <= 5 && usersubscriptiondata.status == true){
          this.usersubscriptiondata = usersubscriptiondata.message;
        }
      },
      (error) => {
        console.error('Error fetching subscription data:', error);
      }
    );
    
  }


  ngOnInit() {


    this.introJS.start();

    this.loadNotesList();
    this.gettask();
    this.getnotification();
    this.getmemberlist();
     this.dashboardCounts();
    this.dashboardusertypereport();
    this.dashboardDitails();
    this.getresponsibletask();
    this.color = '#2889e9';

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true,
    };

    if (localStorage.getItem('userid') !== null) {
      Pusher.logToConsole = false;
      const pusher = new Pusher(`${this.pushID}`, {
        cluster: 'ap2'
      });

      const userId = parseInt(localStorage.getItem('userid') || '0', 10);

      let channel = pusher.subscribe(`pushnotification.${userId}`);

      channel.bind('push-notification', (data: any) => {
        console.log('Push notification received:', data);
        if (userId === data.message?.userId || parseInt(data.message?.userId || '0' || '0', 10) === userId) {
          this.notificationService.pushNotify(data.message);
        }
      });
    }
  }

  gettask() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = this.commonService.getAuthHeaders(token);
      const body = this.commonService.getTaskRequestPayload();

      if (!body) {
        return;
      }

      this.http.post(`${this.apiUrl}taskListAll`, body, { headers }).subscribe(
        (response: any) => {
          this.taskListAll = response;

          this.team4 = this.taskListAll.data.map(
            (item: { task_id: any; title: any }) => ({
              item_id: item.task_id,
              item_text: item.title,
            })
          );

        },
        (error) => {
          // Handle errors, for example, display an error message
          console.error('Error fetching task list:', error);
        }
      );
    } else {
      console.error('No token found in localStorage.');
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(name => name.charAt(0)).join('');
  }




  onclientsSelect(selectedClient: any) {
    this.filteredclients = this.clients.filter(client => client.item_id !== selectedClient.item_id);
  }

  // Create Project modal api

  getmemberlist() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}comapnyMemberList?companyID=` + localStorage.getItem('usercompanyId'), {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.memberlistData = clientslistData;
            this.team1 = this.memberlistData.data.map((item: { id: any; name: any; }) => ({
              item_id: item.id,
              item_text: item.name,
            }));
          },
          (error) => { }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  onContentChange(event: any) {
    this.editorContent = event.html;
  }

  insertusernotes(information: any): void {

    const token = localStorage.getItem('tasklogintoken');

    if (information.title === '' || information.description === '') {
      this.toastr.error('Please fill title & description');
      return;
    }


    if (!token) {
      console.log('No token found in localStorage.');
      return;
    }
    this.spinner.show();

    information.companyID = localStorage.getItem('usercompanyId');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    this.http.post(`${this.apiUrl}noteAdd`, information, { headers }).subscribe(
      (response: any) => {
        if (response.status === true) {
          const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_add');
          if (elementToClick) {
            elementToClick.click();
          }
          setTimeout(() => {
            this.toastr.success('Note Added Successfully.');
          }, 10);
          this.loadNotesList();
          this.spinner.hide();
        }
      },
      (error: any) => {
        console.error('Error sending data', error);
      }
    );
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  // multiselect dropdown start


  public trafficRadioGroup = new UntypedFormGroup({
    trafficRadio: new UntypedFormControl('Month'),
  });



  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });

  }

  ngAfterViewInit(): void {
    // this.initIntroJs();
    const slider = $('.your-slider-selector');
    this.dashboardDitails();
  }

  // dashboard project slider script
  project_slider = {
    slidesToShow: 2.3,
    slidesToScroll: 1,
    dots: false,
    arrows: true,
    infinite: false,
    autoplay: false,
    vertical: true,
    draggable: true,
    focusOnSelect: true,
    cssEase: 'linear',
    prevArrow:
      "<img class='a-left control-c prev slick-prev' src='../../../assets/img/dashboard/up-arrow.svg'>",
    nextArrow:
      "<img class='a-right control-c next slick-next' src='../../../assets/img/dashboard/down-arrow.svg'>",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // dashboard note slider
  note_slideConfig = {
    slidesToShow: 2.3,
    slidesToScroll: 1,
    dots: false,
    arrows: true,
    infinite: false,
    autoplay: false,
    vertical: true,
    prevArrow:
      "<img class='a-left control-c prev slick-prev' src='../../../assets/img/dashboard/up-arrow.svg'>",
    nextArrow:
      "<img class='a-right control-c next slick-next' src='../../../assets/img/dashboard/down-arrow.svg'>",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  loadNotesList() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http.get(`${this.apiUrl}notesList?companyID=` + localStorage.getItem('usercompanyId'), { headers }).subscribe(
        (noteslistData: any) => {
          this.noteslistData = noteslistData;
          this.noteslist = this.noteslistData?.data;
        },
        (error) => {
          // Handle errors here
        }
      );
    } else {
      // Handle the case where no token is found
      console.log('No token found in localStorage.');
    }
  }

  dashboardDitails() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http.get(`${this.apiUrl}dashboard?companyID=` + localStorage.getItem('usercompanyId'), { headers }).subscribe(
        (noteslistData: any) => {
          this.dashboardData = noteslistData;
          this.dashboardDatalist = this.dashboardData?.data;
          this.dashboardDataPermission = this.dashboardData?.permissions;


        },
        (error) => {
          this.spinner.hide();
          if (error.status === 401) {
            this.commonService.logout();
          }
          // Handle errors here
        }

      );
      this.spinner.hide();
    } else {
      // Handle the case where no token is found
      console.log('No token found in localStorage.');
    }
  }


  dashboardCounts() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http.get(`${this.apiUrl}dashboardCount?companyID=` + localStorage.getItem('usercompanyId'), { headers }).subscribe(
        (noteslistData: any) => {
          this.dashboardData = noteslistData;


          this.dashboardDatalists = this.dashboardData?.data;
          this.dashboardDatalists.statisticsData.forEach((monthData: { name: string; completed: number; incompleted: number; }) => {
            // Extract values and push them into respective arrays
            this.namesArray.push(monthData.name);
            this.completedArray.push(monthData.completed);
            this.incompletedArray.push(monthData.incompleted);
          });
          // this.loaddashboardprioritychart();
          this.loaddashboardmonthlyreport();
        },
        (error) => {
          this.spinner.hide();
          if (error.status === 401) {
            this.commonService.logout();
          }
          // Handle errors here
        }

      );
      this.spinner.hide();
    } else {
      // Handle the case where no token is found
      console.log('No token found in localStorage.');
    }
  }

  loaddashboardmonthlyreport() {
    const data = {
      labels: this.namesArray,
      datasets: [{
        label: 'Complete',
        data: this.completedArray,
        fill: false,
        borderColor: '#8BD878',
        backgroundColor: '#8BD878',
        tension: 0.1
      },
      {
        label: 'Incomplete',
        data: this.incompletedArray,
        fill: false,
        borderColor: '#FF5656',
        backgroundColor: '#FF5656',
        tension: 0.1
      },
      ]
    };

    let statisticschart = new Chart('statistics', {
      type: 'line',
      data: data,
      options: {
        aspectRatio: 3,
        animations: {
          tension: {
            duration: 1000,
            easing: 'linear',
            from: 1,
            to: 0,
            loop: true
          }
        },
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              boxWidth: 7,
              boxHeight: 7,
            },
            onClick: () => { }, // Disable click on legend labels
          },
        },
      }
    });
  }


  initIntroJs(): void {
    introJs()
      .setOptions({
        tooltipClass: 'customTooltip',
        highlightClass: 'customHighlight',
        exitOnOverlayClick: false,
        disableInteraction: false,
        showBullets: true,
        prevLabel: '<i class="fa-regular fa-arrow-left"></i>',
        steps: [


          {
            element: document.getElementById('step1'),
            intro: 'Material Card Component',
            position: 'right'
          },
          {
            element: document.getElementById('step2'),
            intro: 'Material Grid Component',
            position: 'right'
          },

        ]
      })
      .start();
  }

  clickOutside() {
    this.opened = !this.opened;
  }
  reminder() {
    this.opened = !this.opened;
  }

  dashboardusertypereport() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}dashboardUserByCount?companyID=` + localStorage.getItem('usercompanyId'), { headers })
        .subscribe(
          (projectslistData: any) => {
            this.usertypedata = projectslistData?.data;

          },
          (error) => {
            console.error('Error loading projects list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }


  getnotification() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(`${this.apiUrl}notificationList?companyID=` + localStorage.getItem('usercompanyId'), { headers })
        .subscribe(
          (companylistData: any) => {
            this.notificationlistData = companylistData;
            this.notificationlist = this.notificationlistData.data;
            // console.log(this.notificationlist);

            // this.notificationService.pushNotify(this.transformNotifications());
          },
          (error) => {
            console.error('Error loading Notification list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  getresponsibletask(){
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      const body = { companyID: localStorage.getItem('usercompanyId'),userID: localStorage.getItem('userid')};

      this.http.post(`${this.apiUrl}responsiblePersonTaskList`, body, { headers }).subscribe(
        (response: any) => {
          this.responsibletasklist = response?.data;
        },
        (error) => {
          // Handle errors, for example, display an error message
          console.error('Error fetching task list:', error);
        }
      );
    } else {
      console.error('No token found in localStorage.');
    }
  }

  getchecklist(checklistdata:any){
    this.checklisttask = checklistdata;
  }
}
