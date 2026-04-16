import { set } from 'firebase/database';
import { ColorEvent } from 'ngx-color';
import { event } from 'jquery';
import {
  Component,
  TemplateRef,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { CommonService } from '../service/common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  UntypedFormControl,
  FormBuilder,
  FormGroup,
  NgModel,
  FormArray,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { FullCalendarModule } from '@fullcalendar/angular';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { signal } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgMultiSelectDropDownModule,
    FullCalendarModule,
  ],
})
export class AttendanceComponent {
  private apiUrl = environment.ApiUrl;
  companyId: any;
  attendanceData: any;
  events_data: any = [];
  isowner: any;
  memberlistData: any;
  team1: any;
  filteredTeam1: Array<{ item_id: number; item_text: string }> = [];
  loggedInUserId: any;
  taskForm!: FormGroup;
  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    events: this.events_data,
    eventBackgroundColor: '#e6e6f8',
    eventBorderColor: '#e6e6f8',
    eventTextColor: '#2c384af2',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
  });
  username: any;

  constructor(private http: HttpClient, private commonService: CommonService) {
    this.isowner = localStorage.getItem('ownerChceck');
    this.getmemberlist();
  }

  ngOnInit() {
    this.userAttendance();
  }

  userAttendance() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(
          `${this.apiUrl}myAttendanceList?companyID=` +
            localStorage.getItem('usercompanyId'),
          { headers }
        )
        .pipe(
          catchError((error) => {
            if (error.status === 401) {
              this.commonService.logout();
            }
            console.error('Error loading company list:', error);
            return of(null);
          })
        )
        .subscribe((attendanceData: any) => {
          this.attendanceData = attendanceData.data;
          this.updateCalendarEvents();
        });
    } else {
      console.log('No token found in localStorage.');
    }
  }

  updateCalendarEvents() {
    this.events_data = this.attendanceData.flatMap((attendance: any) => {
      return [
        {
          title: `Login Time: ${attendance.login_time || '00'}`,
          date: attendance.date,
        },
        {
          title: `Logout Time: ${attendance.logout_time || '00'}`,
          date: attendance.date,
        },
        {
          title: `Total Time : ${attendance.total_time || '00'}`,
          date: attendance.date,
        },
      ];
    });

    this.calendarOptions.update((options) => ({
      ...options,
      events: this.events_data,
    }));
  }

  getmemberlist() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(
          `${this.apiUrl}comapnyMemberList?companyID=` +
            localStorage.getItem('usercompanyId'),
          {
            headers,
          }
        )
        .subscribe(
          (clientslistData: any) => {
            this.memberlistData = clientslistData;
            this.team1 = this.memberlistData.data.map(
              (item: { id: any; name: any }) => ({
                item_id: item.id,
                item_text: item.name,
              })
            );
            this.filteredTeam1 = this.team1.filter(
              (user: { item_id: any; item_text: any }) =>
                user.item_id != this.loggedInUserId
            );
          },
          (error) => {}
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  ownerAttendanceList(userID: any) {
    this.events_data = '';
    this.companyId = localStorage.getItem('usercompanyId');
    const information = { userID: userID?.item_id, companyID: this.companyId };
    console.log(information, 'information');
    const token = localStorage.getItem('tasklogintoken');
    this.username = userID?.item_text;
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .post(`${this.apiUrl}ownerAttendanceList`, information, {
          headers,
        })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              this.events_data = response.data;
              this.attendanceData = this.events_data;
              this.updateCalendarEvents();
              console.log('this.events_data', this.events_data);
            }
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        );
    }
  }
}
