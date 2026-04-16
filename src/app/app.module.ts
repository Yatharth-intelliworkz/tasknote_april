import { Injectable, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QuillModule } from 'ngx-quill';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import {
  RoundProgressModule,
  ROUND_PROGRESS_DEFAULTS,
} from 'angular-svg-round-progressbar';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
// NGX Multi Select
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CdkColumnDef } from '@angular/cdk/table';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ImageModule } from 'primeng/image';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { DragDropModule } from '@angular/cdk/drag-drop';
// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import app component
import { AppComponent } from './app.component';

// Import containers
import {
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
} from './containers';

import {
  AvatarModule,
  ButtonGroupModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  TabsModule,
  UtilitiesModule,
} from '@coreui/angular';

import { IconModule, IconSetService } from '@coreui/icons-angular';
import { CreteNewTaskComponent } from './views/crete-new-task/crete-new-task.component';
import { TasksComponent } from './views/tasks/tasks.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ProjectsComponent } from './views/projects/projects.component';
import { ProjectListComponent } from './views/project-list/project-list.component';
import { DiscussionsComponent } from './views/discussions/discussions.component';
import { DiscussionDetailsComponent } from './views/discussion-details/discussion-details.component';
import { NotesComponent } from './views/notes/notes.component';
import { OrganizationManagementComponent } from './views/organization-management/organization-management.component';
import { ManageManagementComponent } from './views/manage-management/manage-management.component';
import { ManageMemeberComponent } from './views/manage-memeber/manage-memeber.component';
import { LoginComponent } from './views/login/login.component';
import { ColorSketchModule } from 'ngx-color/sketch';
import { DmsScreenTwoComponent } from './views/dms-screen-two/dms-screen-two.component';
import { DmsDetailsComponent } from './views/dms-details/dms-details.component';
import { SubscriptionHistoryComponent } from './views/subscription-history/subscription-history.component';
import { ReportComponent } from './views/report/report.component';
import { UserReportComponent } from './views/user-report/user-report.component';
import { ProjectReportComponent } from './views/project-report/project-report.component';
import { StatusReportComponent } from './views/status-report/status-report.component';
import { UserPerfomanceReportComponent } from './views/user-perfomance-report/user-perfomance-report.component';
import { SubscriptionPlanComponent } from './views/subscription/subscription-plan/subscription-plan.component';
import { SubscriptionFreePlanComponent } from './views/subscription/subscription-free-plan/subscription-free-plan.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ProjectOverviewComponent } from './views/project-list/project-overview/project-overview.component';
import { SignupComponent } from './views/signup/signup.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { UserDetailsComponent } from './views/user-details/user-details.component';
import { UserListComponent } from './views/user-details/user-list/user-list.component';
import { ProfileComponent } from './views/profile/profile.component';
import { CompanyDetailsComponent } from './views/organization-management/company-details/company-details.component';
import { ManageMembersComponent } from './views/organization-management/manage-members/manage-members.component';
import { ManageClientsComponent } from './views/organization-management/manage-clients/manage-clients.component';
import { ManageServiceComponent } from './views/organization-management/manage-service/manage-service.component';
import { ManageStatusComponent } from './views/organization-management/manage-status/manage-status.component';
import { ManageRoleComponent } from './views/organization-management/manage-role/manage-role.component';
import { ToastrModule } from 'ngx-toastr';
import { EditTaskComponent } from './views/tasks/edit-task/edit-task.component';
import { ViewTaskComponent } from './views/tasks/view-task/view-task.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CdTimerModule } from 'angular-cd-timer';
import { TimeSheetReportComponent } from './views/time-sheet-report/time-sheet-report.component';
import { TaskTypeComponent } from './views/organization-management/task-type/task-type.component';
import { AddProjectComponent } from './views/projects/add-project/add-project.component';
import { EditProjectComponent } from './views/projects/edit-project/edit-project.component';
import { WorkflowComponent } from './views/workflow/workflow.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridAngular } from 'ag-grid-angular';
// Column Definition Type Interface
import { ColDef } from 'ag-grid-community';
import { UpdatePasswordComponent } from './views/update-password/update-password.component';
import { PartnerReportComponent } from './views/partner-report/partner-report.component';
import { DelayReportComponent } from './views/delay-report/delay-report.component';
import { LeavesComponent } from './views/leaves/leaves.component';
import { AttendanceReportComponent } from './views/attendance-report/attendance-report.component';
import { AttendanceComponent } from './views/attendance/attendance.component';
import { LeaveConfigurationComponent } from './views/organization-setting/leave-configuration/leave-configuration.component';




const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
];



@NgModule({
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    DiscussionDetailsComponent,
    NotesComponent,
    DmsScreenTwoComponent,
    DmsDetailsComponent,
    SubscriptionHistoryComponent,
    ReportComponent,
    SubscriptionPlanComponent,
    SubscriptionFreePlanComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    ManageClientsComponent,
    ManageServiceComponent,
    ManageRoleComponent,
    TaskTypeComponent,
    UpdatePasswordComponent,
  ],
  imports: [
    LeaveConfigurationComponent,
    AttendanceComponent,
    AttendanceReportComponent,
    LeavesComponent,
    DelayReportComponent,
    PartnerReportComponent,
    DragDropModule,
    MatTableModule,
    MatSortModule,
    AgGridAngular,
    NgSelectModule,
    EditProjectComponent,
    WorkflowComponent,
    AddProjectComponent,
    ManageStatusComponent,
    MatMenuModule,
    NgxSpinnerModule,
    ViewTaskComponent,
    EditTaskComponent,
    ImageModule,
    CompanyDetailsComponent,
    CompanyDetailsComponent,
    ManageMembersComponent,
    OrganizationManagementComponent,
    ProfileComponent,
    UserListComponent,
    UserDetailsComponent,
    SignupComponent,
    LoginComponent,
    ProjectOverviewComponent,
    ProjectListComponent,
    CreteNewTaskComponent,
    TasksComponent,
    UserPerfomanceReportComponent,
    StatusReportComponent,
    ProjectReportComponent,
    UserReportComponent,
    CommonModule,
    ManageMemeberComponent,
    ManageManagementComponent,
    DiscussionsComponent,
    ProjectsComponent,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AvatarModule,
    FooterModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    IconModule,
    NavModule,
    FormModule,
    UtilitiesModule,
    ButtonGroupModule,
    ReactiveFormsModule,
    SidebarModule,
    SharedModule,
    TabsModule,
    ProgressModule,
    NgScrollbarModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    NgbModalModule,
    FontAwesomeModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    QuillModule.forRoot(),
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    NgIf,
    MatIconModule,
    MatButtonModule,
    ColorSketchModule,
    HttpClientModule,
    RoundProgressModule,
    NgCircleProgressModule.forRoot(),
    MatAutocompleteModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatCheckboxModule,
    NgxDaterangepickerMd.forRoot(),
    ToastrModule.forRoot(), // Add this line
    MatCardModule,
    MatDividerModule,
    PickerComponent,
    NgxPaginationModule,
    NgxDocViewerModule,
    FullCalendarModule,
    CdTimerModule,
    TimeSheetReportComponent,
    MatDatepickerModule,
    MatNativeDateModule,
  ],

  // exports: [ColorPickerModule],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    IconSetService,
    Title,
    CdkColumnDef,
    DatePipe
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
