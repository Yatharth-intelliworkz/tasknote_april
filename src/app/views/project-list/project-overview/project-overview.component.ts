import { Component,AfterViewInit, ViewChild, ElementRef,NgModule } from '@angular/core';
import Chart from 'chart.js/auto';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UntypedFormControl, FormControl, ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, NgModel } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonService } from '../../service/common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgFor,NgIf,DatePipe } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import {  MatExpansionModule } from '@angular/material/expansion';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { format as formatDate, parse as parseDate } from 'date-fns';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
declare var bootstrap: any;
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';


interface ICountry {
  item_id: any;
  item_text: string;
  image: string;
  isDisabled?: boolean;
}
interface Client {
  item_id: any;
  item_text: string;
}

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

export interface PeriodicElement {
  hour_per_cost: number;
  toatal_money: number;
  user_hour: number;
  user_minute: number;
  remark: string;
  userName: string;
  track_time:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { hour_per_cost: 3, remark: 'H', toatal_money: 2000, userName: 'thaker', user_hour: 54, user_minute: 2, track_time:'00:00:00'},
];


@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss'],
  standalone: true,
  imports: [MatTabsModule,MatFormFieldModule, MatInputModule, MatSlideToggleModule,MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, FormsModule, ReactiveFormsModule, NgMultiSelectDropDownModule, NgIf, NgFor,  MatExpansionModule,MatTableModule, MatSortModule, MatPaginatorModule,DatePipe,MatSelectModule,CommonModule,NgSelectModule],

})
export class ProjectOverviewComponent {
  @ViewChild('slideToggle') slideToggle!: MatSlideToggle;
  @ViewChild('checklistModal') checklistModal!: ElementRef;
  displayedColumns: string[] = [
   'userName', 
   'remark', 
   'hour_per_cost', 
   'toatal_money', 
   'user_hour', 
   'user_minute',
   'track_time',
   'action'
  ];

  dataSource = new MatTableDataSource<any>();

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
managerName: { id: number; name: string }[] = [];

clientslistData:any;
  dropdownSettings1: any = {};
  dropdownSettings2: any = {};
  user: any;
  team3:any= [];
  team1: Array<Client> = [];
  currentChecklistIndex:any;
  filteredChecklistArray:any;
  tasktypeData: any;
  tasktypelist: any;
  title = 'ng-chart';
  chart: any = [];
  projectId:any;
  datanotfound: any;
  servicelistData:any;
  fileForm!: FormGroup;
  addprojectForm!: FormGroup;
  selectedItems2: ICountry[] = [];
  form: FormGroup;
  projectFormchecklist: FormGroup;
  countries: Array<ICountry> = [];
  private apiUrl = environment.ApiUrl;
  public domainName = environment.domainName;
  memberlistData:any;
  memberlist:any;
  managerlist:any;
  mamberlist:any;
  clientlist:any;
  statusarray:any;
  statuscount:any;
  statusname:any;
  resultdata:any;
  ngOnInit() {    
    this.route.paramMap.subscribe(params => {

      this.projectId = params.get('id');
    });
    this.projectDetail();
    this.commonService.checkLoggedIn();

  }
  getInitials(name: string): string {
    return name.split(' ').map(name => name.charAt(0)).join('');
    }


  constructor(private formBuilder: FormBuilder,  private fb: FormBuilder,
    private http: HttpClient,
    private commonService: CommonService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService) {
this.ClientList();
this.getmemberlist();
this.gettasktype();
this.serviceList();
    this.fileForm = this.formBuilder.group({
      multiplefile: ['initialValue'],
    });
    this.addprojectForm = this.fb.group({
      name: [null],
      manager_id: [null],
      members_id: [null],
      start_date: [null],
      end_date: [null],
      description: [null],
      projectID: '',
      servic_id: '',
      total_cost: '',
      tasktypedata: this.fb.array([]),
      remark: [''],
      tasktype: [null],
      hours: [null],
      cost: [''],
      tasktypechecklistarrayDisplay: [''],
      tasktypechecklistarray: [''],
      tasktypechecklistarraystore: [''],
    });

    this.form = this.fb.group({
      selectedItems2: [[]], // Initialize as an empty array
      // attech file
      yourFormControlName: ['initialValue'],
      // attech file
    });

    this.projectFormchecklist = this.fb.group({
      tasktypechecklist: [''],
      tasktyperemark: [''],
      is_documentupload: [],
      taskinchecklist: [''],
    });

    this.dropdownSettings1 = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection:true,
    };

    this.dropdownSettings2 = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 2,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };


    this.countries = [
      {
        item_id: 1,
        item_text: 'Arvind Rajput',
        image: 'url_to_image1.jpg',
      },
      {
        item_id: 2,
        item_text: 'Nikunj Sojitra',
        image: 'url_to_image2.jpg',
      },
      {
        item_id: 3,
        item_text: 'Mital Gandhi',
        image: 'url_to_image3.jpg',
      },
      {
        item_id: 3,
        item_text: 'Yamini Patel',
        image: 'url_to_image3.jpg',
      },
    ];
  }

  gettasktype() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}taskTypeList?companyID=` + localStorage.getItem('usercompanyId'), {
          headers,
        })
        .subscribe(
          (noteslistData: any) => {
            this.tasktypeData = noteslistData;
            this.tasktypelist = this.tasktypeData?.data;
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
            if (error.status === 401) {
              this.commonService.logout();
            }
          }
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }

  projectDetail(){
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}projectDetail?projectID=`+this.projectId, {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.memberlistData = clientslistData;
            this.memberlist = this.memberlistData?.data; 
            this.managerName = this.memberlist.projectDtail.manager_id.map(
              (member: { item_id: any }) => member.item_id
            );
              
          this.memberlist.projectDtail.start_date = parseDate(this.memberlist.projectDtail.start_date, 'dd-MM-yyyy', new Date());
          this.memberlist.projectDtail.end_date = parseDate(this.memberlist.projectDtail.end_date, 'dd-MM-yyyy', new Date());
            this.dataSource.data = this.memberlist.taskList.flatMap((task: { checkList: any; }) => task.checkList);      
            
          },
          (error) => {
            if (error.status === 401) {
              this.commonService.logout();
            }
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }


ngAfterViewInit() {
  // this.dataSource = this.memberlist.taskList.checkList;
  // console.log("new data",this.dataSource);
  
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}
deletechecklist(checklistid:any){
  // checklistid;
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      // this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const clientId = { checkListID: checklistid };

      this.http
        .post(`${this.apiUrl}taskCheckListDelete`,
          clientId,
          { headers }
        )
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              setTimeout(() => {
                this.toastr.success('CheckList Deleted Successfully.');
              }, 10);
              // this.spinner.hide();
            }
          },
          (error: any) => {
            // this.spinner.hide();
            console.error('Error sending data', error);
          }
        );
  }
}

markingofchecklit(val:any,id:any){
  const token = localStorage.getItem('tasklogintoken');
//  console.log(val);

  if (token) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
      let value = (val == false) ? true : false;
      const formData = new FormData();
      formData.append('checkListID', id!);
      formData.append('completed', value.toString());
    
    this.http
      .post(`${this.apiUrl}taskCheckListInCompleted`, formData, {
        headers,
      })
      .subscribe(
        (response: any) => {
      //     if (response.status === true) {
      //       const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_profile');
      // if (elementToClick) {
      //   elementToClick.click();
      // }
      setTimeout(() => {
        this.toastr.success('Checklist Status Has Been Updated Successfully.');
      }, 10);
            // this.getprofile();
            // this.spinner.hide();
            window.location.reload();
          // }
        },
        (error: any) => {
          // this.spinner.hide();
          console.error('Error sending data', error);
        }
      );
  }

}


ClientList() {
 
  const token = localStorage.getItem('tasklogintoken');
  if (token) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    this.http
      .get(`${this.apiUrl}clientList?companyID=` + localStorage.getItem('usercompanyId'), {
        headers,
      })
      .subscribe(
        (clientslistData: any) => {
          this.clientslistData = clientslistData;
          this.clientlist = this.clientslistData?.data;
          this.team3 = this.clientslistData?.data.map((item: { id: any; name: any; }) => ({
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

onClientSelect(event: any){
  const selectedClientId = event.item_id;
  const token = localStorage.getItem('tasklogintoken');
  if (token) {
    // this.spinner.show();
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    const clientId = { clientID: selectedClientId , projectID:this.projectId };
    this.http
      .post(`${this.apiUrl}projectByTaskDetail`,
        clientId,
        { headers }
      )
      .subscribe(
        (response: any) => {
          if (response.status === true) {
           this.resultdata = response.data;
          }
        },
        (error: any) => {
          console.error('Error sending data', error);
        }
      );
}
}

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
        (error) => {
          }
      );
  } else {
  
    console.log('No token found in localStorage.');
  }
}


serviceList() {
  const token = localStorage.getItem('tasklogintoken');
  if (token) {
    this.spinner.show();
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    this.http
      .get(`${this.apiUrl}serviceList?companyID=` + localStorage.getItem('usercompanyId'), {
        headers,
      })
      .subscribe(
        (serviceListData: any) => {
          this.servicelistData = serviceListData.data;
          this.spinner.hide();
        },
        (error: any) => {
          this.spinner.hide();
        }
      );
  } else {
    this.spinner.hide();
    console.log('No token found in localStorage.');
  }
}
openModal(tasktypeid: any): void {
  this.currentChecklistIndex = tasktypeid;
  
  this.filteredChecklistArray = this.memberlist.checkListData.filter((item: { taskTypeId: number }) => item.taskTypeId == tasktypeid);


  const modalElement = this.checklistModal.nativeElement;
  const modal = new bootstrap.Modal(modalElement);

  modal.show();

  modalElement.addEventListener('hidden.bs.modal', () => {
    this.resetToggle();
  });

  
}

resetToggle(): void {
  this.currentChecklistIndex = null;
  // this.tasktypechecklistarray = [];
  if (this.slideToggle) {
    this.slideToggle.checked = false;
  }
}
}
