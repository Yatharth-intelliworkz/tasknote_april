import { LeaveConfigurationComponent } from './views/organization-setting/leave-configuration/leave-configuration.component';
import { AttendanceComponent } from './views/attendance/attendance.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './containers';
import { LoginComponent } from './views/login/login.component';
import { CreteNewTaskComponent } from './views/crete-new-task/crete-new-task.component';
import { TasksComponent } from './views/tasks/tasks.component';
import { ProjectsComponent } from './views/projects/projects.component';
import { ProjectListComponent } from './views/project-list/project-list.component';
import { DiscussionsComponent } from './views/discussions/discussions.component';
import { DiscussionDetailsComponent } from './views/discussion-details/discussion-details.component';
import { NotesComponent } from './views/notes/notes.component';
import { OrganizationManagementComponent } from './views/organization-management/organization-management.component';
import { ManageManagementComponent } from './views/manage-management/manage-management.component';
import { DmsComponent } from './views/dms/dms.component';
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
import { ManageRoleComponent } from './views/organization-management/manage-role/manage-role.component';
import { TaskTypeComponent } from './views/organization-management/task-type/task-type.component';
import { ManageStatusComponent } from './views/organization-management/manage-status/manage-status.component';
import { NotiifcationsComponent } from './views/notiifcations/notiifcations.component';
import { EditTaskComponent } from './views/tasks/edit-task/edit-task.component';
import { ViewTaskComponent } from './views/tasks/view-task/view-task.component';
import { TimeSheetReportComponent } from './views/time-sheet-report/time-sheet-report.component';
import { AddProjectComponent } from './views/projects/add-project/add-project.component';
import { EditProjectComponent } from './views/projects/edit-project/edit-project.component';
import { WorkflowComponent } from './views/workflow/workflow.component';
import { UpdatePasswordComponent } from './views/update-password/update-password.component';
import { PartnerReportComponent } from './views/partner-report/partner-report.component';
import { DelayReportComponent } from './views/delay-report/delay-report.component';
import { LeavesComponent } from './views/leaves/leaves.component';
import { AttendanceReportComponent } from './views/attendance-report/attendance-report.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: SignupComponent },
  { path: 'reset-password', component: ForgotPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'update-password', component: UpdatePasswordComponent },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      { path: 'tasks', component: TasksComponent },
      { path: 'create-task', component: CreteNewTaskComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'projects-detail/:id', component: ProjectListComponent },


      //  {
      //   path: 'projects',
      //   component: ProjectsComponent,
      //   children: [
      //     {
      //       path: 'project-list',
      //       component: ProjectListComponent
      //     },
      //     // Add more children routes if needed
      //   ]
      // },

      { path: 'discusssion', component: DiscussionsComponent },
      { path: 'discusssion-details', component: DiscussionDetailsComponent },
      { path: 'notes', component: NotesComponent },
      { path: 'organization-management', component: OrganizationManagementComponent },
      { path: 'manage-management', component: ManageManagementComponent },
      { path: 'dms', component: DmsComponent },
      { path: 'dms-list', component: DmsScreenTwoComponent },
      { path: 'dms-details', component: DmsDetailsComponent },
      { path: 'subscription-history', component: SubscriptionHistoryComponent },
      { path: 'report', component: ReportComponent },
      { path: 'user-report', component: UserReportComponent },
      { path: 'project-report', component: ProjectReportComponent },
      { path: 'status-report', component: StatusReportComponent },
      { path: 'user-perfomance-report', component: UserPerfomanceReportComponent },
      { path: 'subscription-plan', component: SubscriptionPlanComponent },
      { path: 'subscription-free-plan', component: SubscriptionFreePlanComponent },
      { path: 'user-details', component: UserDetailsComponent },
      { path: 'user-list', component: UserListComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'company-details/:id', component: CompanyDetailsComponent },
      { path: 'manage-members/:id', component: ManageMembersComponent }, /* new components in oraganization management */
      { path: 'manage-clients/:id', component: ManageClientsComponent },
      { path: 'manage-service/:id', component: ManageServiceComponent },
      { path: 'manage-status/:id', component: ManageStatusComponent },
      { path: 'manage-roles/:id', component: ManageRoleComponent },
      { path: 'task-type/:id', component: TaskTypeComponent },
      { path: 'notifications', component: NotiifcationsComponent },
      { path: 'edit-task', component: EditTaskComponent },
      { path: 'time-sheet-report', component: TimeSheetReportComponent },
      { path: 'workflow', component: WorkflowComponent },
      { path: 'view-task/:id', component: ViewTaskComponent },
      { path: 'add-project', component: AddProjectComponent },
      { path: 'edit-project/:id', component: EditProjectComponent },
      { path: 'partner-report', component: PartnerReportComponent },
      { path: 'delay-report', component: DelayReportComponent },
      { path: 'leave', component: LeavesComponent },
      { path: 'attendance-report', component: AttendanceReportComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'organization-setting/leave-configuration', component:LeaveConfigurationComponent },

      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },

    ]
  },
  // { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [

    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'

    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
