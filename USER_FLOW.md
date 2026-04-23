# User Flow Documentation

## Scope
This document explains the complete user flow in this codebase:
- where users are added
- where user lists are fetched
- how UI, component logic, and API calls connect

## Entry Routes
- `organization-management` route: [src/app/app-routing.module.ts#L91](src/app/app-routing.module.ts#L91)
- `user-details` route: [src/app/app-routing.module.ts#L104](src/app/app-routing.module.ts#L104)
- `manage-members/:id` route: [src/app/app-routing.module.ts#L108](src/app/app-routing.module.ts#L108)

`user-details` is the user analytics/details view.
`manage-members/:id` is the user CRUD (add/edit/delete) management view for a company.

## Main Components Involved
- [src/app/views/organization-management/manage-members/manage-members.component.ts](src/app/views/organization-management/manage-members/manage-members.component.ts)
  - Add, edit, delete members
  - Fetch members for management table and dropdowns
- [src/app/views/user-details/user-details.component.ts](src/app/views/user-details/user-details.component.ts)
  - Fetch member list for sidebar
  - Fetch selected user profile + task stats
  - Toggle favorite user
- [src/app/views/user-details/user-list/user-list.component.ts](src/app/views/user-details/user-list/user-list.component.ts)
  - Presentation component for selected user task data (receives data via `@Input()`)

## Authentication & Request Plumbing
- Auth check before page use: `checkLoggedIn()` in [src/app/views/service/common.service.ts#L21](src/app/views/service/common.service.ts#L21)
- Auth header helper: `getAuthHeaders()` in [src/app/views/service/common.service.ts#L64](src/app/views/service/common.service.ts#L64)
- Global HTTP interceptor: `NotificationRefreshInterceptor` in [src/app/interceptors/notification-refresh.interceptor.ts#L13](src/app/interceptors/notification-refresh.interceptor.ts#L13)
- Interceptor registration: [src/app/app.module.ts#L271](src/app/app.module.ts#L271)

The interceptor triggers refresh events for successful mutating APIs (POST/PUT/PATCH/DELETE) except ignored read/auth/notification endpoints.

## Environment API Base
Base API URL is read from `environment.ApiUrl` in [src/environments/environment.ts](src/environments/environment.ts).
Current active local config points to:
- `http://localhost/tasknote_backend_new/api/`

---

## A) Where Users Are Added
Primary method:
- `addmember(information, clearaddform)` in [src/app/views/organization-management/manage-members/manage-members.component.ts#L384](src/app/views/organization-management/manage-members/manage-members.component.ts#L384)

Flow:
1. User opens Manage Members screen (`manage-members/:id`).
2. User fills add-member form (`memberForm`).
3. `addmember(...)` builds `FormData` from form values.
4. DOB is converted to ISO string and appended.
5. `companyID` is appended from route param/company context.
6. POST request is sent to:
  - `${ApiUrl}comapnyMemberAdd` ([src/app/views/organization-management/manage-members/manage-members.component.ts#L406](src/app/views/organization-management/manage-members/manage-members.component.ts#L406))
7. On success (`response.status === true`):
   - reset add form
   - refresh role list
   - refresh member list
   - close modal
   - show success toast
8. On duplicate email (`response.code == 210`):
   - show error toast: "Email is already exist"

### Add User Required Inputs (as used by form)
Declared in `memberForm` setup around [src/app/views/organization-management/manage-members/manage-members.component.ts#L305](src/app/views/organization-management/manage-members/manage-members.component.ts#L305):
- `name`
- `designation`
- `dob`
- `phone_no`
- `email_id`
- `reportingTo`
- `gender`
- `assignRole`
- plus supporting fields: `memberId`, `user_type`, `hour_per_cost`, `is_active`

---

## B) Where User Lists Are Fetched

### 1) User Details Page Sidebar List
Method:
- `getcompanyuser()` in [src/app/views/user-details/user-details.component.ts#L138](src/app/views/user-details/user-details.component.ts#L138)

Triggered by:
- `ngOnInit()` in [src/app/views/user-details/user-details.component.ts#L113](src/app/views/user-details/user-details.component.ts#L113)

Endpoint used:
- GET `${ApiUrl}userMemberList?companyID=${localStorage.usercompanyId}`
- Call location: [src/app/views/user-details/user-details.component.ts#L145](src/app/views/user-details/user-details.component.ts#L145)

What happens after fetch:
- stores response in `memberlistData`
- assigns random avatar colors for default profile placeholders
- auto-selects first user and calls:
  - `showusresdetails(firstUserId)`

### 2) Manage Members Page Grid/List
Method:
- `getmemberlist()` in [src/app/views/organization-management/manage-members/manage-members.component.ts#L598](src/app/views/organization-management/manage-members/manage-members.component.ts#L598)

Endpoint used:
- GET `${ApiUrl}comapnyMemberList?companyID=${this.companyId}`
- Call location: [src/app/views/organization-management/manage-members/manage-members.component.ts#L606](src/app/views/organization-management/manage-members/manage-members.component.ts#L606)

What happens after fetch:
- `memberlistData` and `memberlist` assigned
- grid row data (`memberRowData`) updated

### 3) Manage Members Dropdown List
Method:
- `LoadMemberList()` in [src/app/views/organization-management/manage-members/manage-members.component.ts#L735](src/app/views/organization-management/manage-members/manage-members.component.ts#L735)

Endpoint used:
- GET `${ApiUrl}comapnyMemberList?companyID=${this.companyId}`

What happens after fetch:
- maps users into dropdown format:
  - `{ item_id: id, item_text: name }`
- stored in `team`

---

## C) Selected User Detail + Task Data Flow

On `user-details` page, when a member is selected:

1. `showusresdetails(id)` runs ([src/app/views/user-details/user-details.component.ts#L211](src/app/views/user-details/user-details.component.ts#L211))
2. POST to `${ApiUrl}userDetails?id=${id}` ([src/app/views/user-details/user-details.component.ts#L220](src/app/views/user-details/user-details.component.ts#L220))
3. Request body sent:
   - `{ userID: id, companyID: localStorage.usercompanyId }`
4. On success, stores profile data in `memberdata`
5. Then calls `tasklistusers(id)` ([src/app/views/user-details/user-details.component.ts#L228](src/app/views/user-details/user-details.component.ts#L228))
6. `tasklistusers(id)` POSTs to `${ApiUrl}userTaskList?id=${id}` ([src/app/views/user-details/user-details.component.ts#L246](src/app/views/user-details/user-details.component.ts#L246))
7. Response task arrays are split into:
   - `todayTaskData`
   - `overDueTaskData`
   - `upcomingTaskData`
   - `completedTaskData`
8. These are passed to child component:
  - [src/app/views/user-details/user-details.component.html](src/app/views/user-details/user-details.component.html)
  - consumed by [src/app/views/user-details/user-list/user-list.component.ts](src/app/views/user-details/user-list/user-list.component.ts) via `@Input()`

---

## D) Favorite User Flow
Method:
- `adduserfavourite(id, is_favourite)` in [src/app/views/user-details/user-details.component.ts#L299](src/app/views/user-details/user-details.component.ts#L299)

Endpoint:
- POST `${ApiUrl}userFavorite` ([src/app/views/user-details/user-details.component.ts#L313](src/app/views/user-details/user-details.component.ts#L313))

Body type:
- `FormData` with:
  - `favoriteID`
  - `is_favorite`

On success:
- toast message shown
- user list re-fetched by calling `getcompanyuser()` ([src/app/views/user-details/user-details.component.ts#L320](src/app/views/user-details/user-details.component.ts#L320))

---

## E) Edit and Delete User (Related to Full User Lifecycle)

### Edit User
- Method: `EditMember(id)` loads existing user from:
  - GET `${ApiUrl}comapnyMemberGet?memberId=${id}`
  - [src/app/views/organization-management/manage-members/manage-members.component.ts#L823](src/app/views/organization-management/manage-members/manage-members.component.ts#L823)
- Save method: `UpdateMember(information, formname)`
  - POST `${ApiUrl}comapnyMemberEdit`
  - [src/app/views/organization-management/manage-members/manage-members.component.ts#L862](src/app/views/organization-management/manage-members/manage-members.component.ts#L862)

### Delete User
- Method: `DeleteMember(id)`
- Endpoint: POST `${ApiUrl}comapnyMemberDelete`
- Location: [src/app/views/organization-management/manage-members/manage-members.component.ts#L448](src/app/views/organization-management/manage-members/manage-members.component.ts#L448)
- Success path refreshes member list.

---

## F) End-to-End Sequence (Short)

### Add User Sequence
1. Open `manage-members/:id`
2. Fill form and submit
3. `addmember(...)` -> POST `comapnyMemberAdd`
4. Success -> `getmemberlist()` refresh -> UI table updated

### User List Sequence (Details Screen)
1. Open `user-details`
2. `ngOnInit()` -> `getcompanyuser()` -> GET `userMemberList`
3. Auto-select first user -> `showusresdetails(id)` -> POST `userDetails`
4. Then `tasklistusers(id)` -> POST `userTaskList`
5. Parent passes task arrays to `app-user-list`

---

## G) Quick Endpoint Inventory For User Flow
- `GET userMemberList?companyID=...`
- `GET comapnyMemberList?companyID=...`
- `POST comapnyMemberAdd`
- `GET comapnyMemberGet?memberId=...`
- `POST comapnyMemberEdit`
- `POST comapnyMemberDelete`
- `POST userDetails?id=...`
- `POST userTaskList?id=...`
- `POST userFavorite`

---

## H) Notes
- There is a consistent spelling in backend paths: `comapny...` (not `company...`). This appears intentional in current API contracts.
- Tokens are read from `localStorage.tasklogintoken` and added in `Authorization: Bearer ...` header.
- Company context comes from route param (`manage-members/:id`) and/or `localStorage.usercompanyId` depending on screen.
