# Notification Flow (End-to-End)

This document explains the full notification flow currently implemented in this project, from backend API data to UI badge updates, read/unread tabs, mark all, clear all, and desktop push.

## 1) Main Components Involved

- Header badge + desktop push:
  - src/app/containers/default-layout/default-header/default-header.component.ts
  - src/app/views/service/notification.service.ts
- Notification page (Unread/Read tabs + pagination + actions):
  - src/app/views/notiifcations/notiifcations.component.ts
  - src/app/views/notiifcations/notiifcations.component.html
- Event emitters from task screens:
  - src/app/views/crete-new-task/crete-new-task.component.ts
  - src/app/views/tasks/view-task/view-task.component.ts

## 2) API Endpoints Used

### Header (count + desktop push data)
- GET notificationList?companyID=<companyId>

### Notification page (tab data)
- GET notificationAllList?companyID=<companyId>
- Fallback GET notificationList?companyID=<companyId>

### Notification actions
- POST notificationView (payload: { notificationId })
- GET notificationDeleteAll?companyID=<companyId>

## 3) Header Flow (Bell Count + Desktop Notification)

File: src/app/containers/default-layout/default-header/default-header.component.ts

1. On init, header calls getnotification().
2. getnotification() calls notificationList API.
3. Response is stored in notificationlist.
4. transformNotifications() converts API objects into browser Notification objects:
   - title: "<module> Update"
   - body: message/massage
   - icon/url defaults set
5. Transformed data is sent to NotificationService.pushNotify().
6. NotificationService checks browser permission and shows desktop notifications.

Result:
- Header bell count is sourced from notificationList API response.
- Browser-level desktop notifications are triggered from the same data.

## 4) Header Real-Time Sync via Custom Event

File: src/app/containers/default-layout/default-header/default-header.component.ts

- Header subscribes to window event: notifications-updated.
- On receiving this event:
  1. If unreadCount is provided in event detail, header updates local count immediately.
  2. Header also calls getnotification() again for server-synced refresh.

Event name:
- notifications-updated

Why this matters:
- Notification page can notify header instantly without full page reload.

## 5) Notification Page Initial Load Flow

File: src/app/views/notiifcations/notiifcations.component.ts

1. Constructor calls getNotifications().
2. getNotifications() calls notificationAllList API.
3. assignNotificationsFromResponse() normalizes response into:
   - notificationlistUnRead
   - notificationlistRead
4. If notificationAllList returns empty/unsupported shape, fallback to notificationList (unread-only shape).
5. Pagination state resets to page 1 for both tabs after load.

Response shape handling in assignNotificationsFromResponse():

- Shape A:
  - data: { unRead: [], read: [] }
- Shape B:
  - data: [] (treated as unread list)
- Shape C:
  - empty/unknown (clears lists safely)

## 6) Unread/Read Tabs and Pagination

Files:
- src/app/views/notiifcations/notiifcations.component.ts
- src/app/views/notiifcations/notiifcations.component.html

Behavior:
- activeTab controls which tab is visible:
  - General => Unread
  - Task => Read
- itemsPerPage is 10.
- Computed lists:
  - pagedUnreadNotifications
  - pagedReadNotifications
- Controls:
  - prevUnreadPage / nextUnreadPage
  - prevReadPage / nextReadPage

Result:
- Both tabs show paginated data without reloading the page.

## 7) Mark All Flow (Unread tab action)

File: src/app/views/notiifcations/notiifcations.component.ts
Method: notificationMarkAll()

1. Gets current page unread items only (pagedUnreadNotifications).
2. Extracts their IDs.
3. For each ID, calls POST notificationView.
4. Uses forkJoin to process all mark requests.
5. On success:
   - Moves those items from unread list to read list in UI.
   - Resets tab pagination to page 1.
   - Dispatches notifications-updated event with new unread count.
   - Calls getNotifications(true) to sync with server while preserving existing read tab data.

Important detail:
- Mark All currently operates on the current unread page items, not all unread items across all pages.

## 8) Clear All Flow (Read tab action)

File: src/app/views/notiifcations/notiifcations.component.ts
Method: notificationclearAll()

1. Calls GET notificationDeleteAll.
2. On success:
   - Clears local read list immediately (notificationlistRead = []).
   - Resets read page to 1.
   - Dispatches notifications-updated event.

Result:
- Read tab updates instantly in UI.

## 9) Auto-Refresh and Data-Change Event Flow

File: src/app/views/notiifcations/notiifcations.component.ts

### Polling refresh
- setupAutoRefresh() runs every 30 seconds via RxJS interval.
- Calls notificationAllList.
- Updates unread/read lists.
- If unread count changed, dispatches notifications-updated.

### Event-based refresh
- setupEventListeners() subscribes to these window events:
  - task-created, task-updated, task-deleted
  - project-created, project-updated, project-deleted
  - client-created, client-updated, client-deleted
  - note-created, note-updated, note-deleted
  - data-changed
- On any event, handleDataChangeEvent() waits 500ms then calls getNotifications(true).

Result:
- Notification page can refresh automatically after data changes.

## 10) Current Event Emitters Implemented

Currently emitted in code:

- task-created
  - src/app/views/crete-new-task/crete-new-task.component.ts
- task-updated
  - src/app/views/tasks/view-task/view-task.component.ts
- notifications-updated
  - src/app/views/notiifcations/notiifcations.component.ts

Note:
- Notification page listens for many event names (project/client/note/etc.), but only task-created/task-updated are currently emitted in this repository code.
- Polling (30s) still ensures eventual updates for all cases.

## 11) Desktop Notification Flow

File: src/app/views/service/notification.service.ts

1. Header transforms notificationList data.
2. NotificationService.pushNotify(data) checks browser support and permission.
3. For each item, creates Notification object.
4. Auto-closes each desktop notification after 5 seconds.
5. On click, opens configured URL in new tab.

## 12) Full Sequence (Short Version)

1. Backend creates notification on business action.
2. Header fetches notificationList and updates bell badge.
3. Notification page fetches notificationAllList and shows unread/read tabs.
4. User clicks Mark All / Clear All.
5. Notification page updates UI state immediately.
6. Notification page dispatches notifications-updated.
7. Header receives event and refreshes count without page reload.
8. Polling + event listeners keep page auto-synced over time.

## 13) Storage and Cache Behavior

Notification records are not stored in localStorage by this frontend.

- Stored in localStorage:
  - tasklogintoken
  - usercompanyId
- Not stored in localStorage:
  - notification unread/read arrays
  - notification count history
  - notification payload cache

Where notification data lives:
- In-memory component state only (header and notification page variables).
- Browser Notification permission is managed by the browser, not app localStorage.

## 14) Verification Status (Current Code)

1. Verify token and companyID exist in localStorage.
  - Status: PASS with guard handling.
  - Evidence: Both header and notification page now read token/companyID before API call and safely exit if missing.

2. Verify notification APIs return expected shape.
  - Status: PASS (defensive handling present).
  - Evidence: notification page supports grouped shape (data.unRead/data.read), array shape (data: []), and empty shape fallback.

3. Check browser console for 401 errors (auto-logout path).
  - Status: PASS in code path.
  - Evidence: 401 now triggers logout handling in notification page and header fetch flow.

4. Check that notifications-updated is dispatched after actions.
  - Status: PASS.
  - Evidence: Event is dispatched after mark all, clear all, and polling unread-count changes.

5. Confirm header is mounted and listening to notifications-updated.
  - Status: PASS.
  - Evidence: Header adds listener in ngOnInit and removes it in ngOnDestroy.

6. Confirm polling is running (30s interval).
  - Status: PASS.
  - Evidence: setupAutoRefresh uses RxJS interval(30000) with startWith(0).

## 15) Root Issues Found and Fixed

1. Event listener cleanup bug in notification page.
  - Problem: removeEventListener used new anonymous callbacks, so listeners were never removed.
  - Fix: switched to a single bound handler reference and removed listeners correctly.

2. Stale company ID usage.
  - Problem: company ID was read once and reused, leading to mismatch after company change.
  - Fix: company ID is now read from localStorage at call time in header and notification page.

3. Repeated desktop notification spam on every refresh.
  - Problem: header pushed all notifications repeatedly.
  - Fix: added de-duplication key tracking so only new notifications trigger desktop push.

4. Inconsistent 401 handling in header notification fetch.
  - Problem: header logged error only.
  - Fix: added logout handling for 401 in header notification fetch.

## 16) Troubleshooting Checklist

If count or list does not update:

1. Verify token and companyID exist in localStorage.
2. Verify notification APIs return expected shape.
3. Check browser console for 401 errors (auto-logout path).
4. Check that notifications-updated is dispatched after actions.
5. Confirm header is mounted and listening to notifications-updated.
6. Confirm polling is running (30s interval).

## 17) Legacy Component Note

There is an older notification module at:
- src/app/views/0ldnotiifcations/notiifcations.component.ts

Current active flow uses:
- src/app/views/notiifcations/notiifcations.component.ts

Use the new component for all future enhancements.
