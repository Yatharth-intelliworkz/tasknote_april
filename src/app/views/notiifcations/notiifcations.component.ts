import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UntypedFormControl, FormControl, ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, NgModel } from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Router } from '@angular/router';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import * as $ from 'jquery';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../views/service/common.service';
import { Location, NgFor, NgIf } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of, interval, Subscription } from 'rxjs';
import { catchError, switchMap, startWith } from 'rxjs/operators';

interface users {
  item_id: any;
  item_text: string;
  image: string;
  isDisabled?: boolean;
}
interface Module {
  item_id: any;
  item_text: string;
  isDisabled?: boolean;
}

@Component({
  selector: 'app-notiifcations',
  templateUrl: './notiifcations.component.html',
  styleUrls: ['./notiifcations.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, NgMultiSelectDropDownModule, ReactiveFormsModule, FormsModule,MatFormFieldModule, MatDatepickerModule, MatNativeDateModule,NgFor,NgIf],
})
export class NotiifcationsComponent implements OnInit, OnDestroy {

  // multiselect dd.
  fileForm!: FormGroup;
  private apiUrl = environment.ApiUrl;
  notificationlistData:any;
  notificationlist:any;
  notificationlistRead:any[] = [];
  notificationlistUnRead:any[] = [];
  selectedItems2: users[] = [];
  selectModule: Module[] = [];
  form: FormGroup;
  user: Array<users> = [];
  task: Array<Module> = [];
  sessioncompany = localStorage.getItem('usercompanyId');
  dropdownSettings2: any = {};

  activeTab: string = 'General'; // Default active tab is General
  unreadCurrentPage = 1;
  readCurrentPage = 1;
  readonly itemsPerPage = 10;

  // Auto-refresh subscription
  private autoRefreshSubscription: Subscription | null = null;
  private readonly AUTO_REFRESH_INTERVAL = 30000; // 30 seconds - adjust as needed
  private lastUnreadCount = 0;
  private readonly dataChangeEvents: string[] = [
    'task-created',
    'task-updated',
    'task-deleted',
    'project-created',
    'project-updated',
    'project-deleted',
    'client-created',
    'client-updated',
    'client-deleted',
    'note-created',
    'note-updated',
    'note-deleted',
    'data-changed',
  ];
  private readonly onDataChanged = () => this.handleDataChangeEvent();

  constructor(private fb: FormBuilder, private formBuilder: FormBuilder,private route: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService) {


    this.fileForm = this.formBuilder.group({
      multiplefile: ['initialValue'],
    });


    this.form = this.fb.group({
      selectModule: [[]], // Initialize as an empty array
      // attech file
      yourFormControlName: ['initialValue'],
      // attech file
    });

    this.dropdownSettings2 = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 5,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };


    this.user = [
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
        item_id: 4,
        item_text: 'Yamini Patel',
        image: 'url_to_image3.jpg',
      },
    ];

    this.task = [
      {
        item_id: 1,
        item_text: 'Task',
      },
      {
        item_id: 2,
        item_text: 'Project',
      },
      {
        item_id: 3,
        item_text: 'Discussion',
      },
      {
        item_id: 4,
        item_text: 'DMS',
      },
      {
        item_id: 5,
        item_text: 'Note',
      },
    ];

    this.getNotifications();   // Fixed call
  }

  ngOnInit(): void {
    // Setup auto-refresh for notifications
    this.setupAutoRefresh();
    
    // Listen for app-wide events when data is created/updated
    this.setupEventListeners();
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
    }
    
    // Remove event listeners using the same bound handler reference.
    this.dataChangeEvents.forEach((eventName) => {
      window.removeEventListener(eventName, this.onDataChanged);
    });
  }

  private getCurrentCompanyId(): string | null {
    const companyID = localStorage.getItem('usercompanyId');
    this.sessioncompany = companyID;
    return companyID;
  }

  /**
   * Setup auto-refresh to check for new notifications every 30 seconds
   */
  private setupAutoRefresh(): void {
    this.autoRefreshSubscription = interval(this.AUTO_REFRESH_INTERVAL)
      .pipe(
        startWith(0), // Start immediately
        switchMap(() => {
          const token = localStorage.getItem('tasklogintoken');
          const companyID = this.getCurrentCompanyId();
          
          if (!token || !companyID) {
            return of(null);
          }
          
          const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json');
          
          return this.http.get(`${this.apiUrl}notificationAllList?companyID=${companyID}`, { headers });
        })
      )
      .subscribe({
        next: (response: any) => {
          if (response) {
            this.assignNotificationsFromResponse(response, true); // preserveRead=true
            const currentUnreadCount = this.notificationlistUnRead?.length || 0;
            
            // Update notification count if changed
            if (currentUnreadCount !== this.lastUnreadCount) {
              this.lastUnreadCount = currentUnreadCount;
              window.dispatchEvent(new CustomEvent('notifications-updated', { 
                detail: { unreadCount: currentUnreadCount } 
              }));
            }
          }
        },
        error: (error) => {
          console.error('Error in auto-refresh notifications:', error);
          if (error?.status === 401) {
            this.commonService.logout();
          }
        }
      });
  }

  /**
   * Listen for app-wide events when data is created/updated
   */
  private setupEventListeners(): void {
    this.dataChangeEvents.forEach((eventName) => {
      window.addEventListener(eventName, this.onDataChanged);
    });
  }

  /**
   * Handle data change events - refresh notifications immediately
   */
  private handleDataChangeEvent(): void {
    // Add a small delay to ensure API has processed the change
    setTimeout(() => {
      this.getNotifications(true); // preserveRead=true
    }, 500);
  }

  private getUnreadNotificationKey(item: any): string {
    if (item?.id !== undefined && item?.id !== null && item?.id !== '') {
      return `id:${item.id}`;
    }
    const moduleName = item?.is_setModule ?? '';
    const commonId = item?.common_id ?? '';
    const message = item?.message || item?.massage || '';
    const date = item?.date ?? '';
    const time = item?.time ?? '';
    return `${moduleName}|${commonId}|${message}|${date}|${time}`;
  }

  private dedupeUnreadNotifications(list: any[]): any[] {
    if (!Array.isArray(list)) {
      return [];
    }

    const seen = new Set<string>();
    return list.filter((item: any) => {
      const key = this.getUnreadNotificationKey(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private getReadMergeKey(item: any): string {
    if (item?.id !== undefined && item?.id !== null && item?.id !== '') {
      return `id:${item.id}`;
    }
    const id = item?.id ?? '';
    const moduleName = item?.is_setModule ?? '';
    const commonId = item?.common_id ?? '';
    const message = item?.message || item?.massage || '';
    const date = item?.date ?? '';
    const time = item?.time ?? '';
    return `${id}|${moduleName}|${commonId}|${message}|${date}|${time}`;
  }

  private mergeReadNotifications(existing: any[], incoming: any[]): any[] {
    const merged = [...(Array.isArray(existing) ? existing : []), ...(Array.isArray(incoming) ? incoming : [])];
    const seen = new Set<string>();

    return merged.filter((item: any) => {
      const key = this.getReadMergeKey(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // ==================== FIXED & IMPROVED NOTIFICATION LOADING ====================
  getNotifications(preserveRead = false) {
    const token = localStorage.getItem('tasklogintoken');
    const companyID = this.getCurrentCompanyId();

    if (!token || !companyID) {
      console.log('Token or Company ID is missing');
      return;
    }

    this.spinner.show();

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    this.http
      .get(`${this.apiUrl}notificationAllList?companyID=${companyID}`, { headers })
      .subscribe({
        next: (response: any) => {
          this.notificationlistData = response;
          this.assignNotificationsFromResponse(response, preserveRead);

          // Fallback for deployments where notificationAllList returns no grouped data.
          if (this.notificationlistUnRead.length === 0 && this.notificationlistRead.length === 0) {
            this.http
              .get(`${this.apiUrl}notificationList?companyID=${companyID}`, { headers })
              .subscribe({
                next: (fallbackResponse: any) => {
                  this.notificationlistData = fallbackResponse;
                  const fallbackUnread = Array.isArray(fallbackResponse?.data) ? fallbackResponse.data : [];
                  this.notificationlistUnRead = this.dedupeUnreadNotifications(fallbackUnread);
                  this.unreadCurrentPage = 1;
                  if (!Array.isArray(this.notificationlistRead)) {
                    this.notificationlistRead = [];
                  }
                  if (this.readCurrentPage > this.readTotalPages) {
                    this.readCurrentPage = this.readTotalPages;
                  }
                  this.spinner.hide();
                },
                error: (fallbackError) => {
                  this.spinner.hide();
                  console.error('Error loading fallback Notification list:', fallbackError);
                  if (fallbackError.status === 401) {
                    this.commonService.logout();
                  }
                }
              });
            return;
          }

          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          console.error('Error loading Notification list:', error);
          if (error.status === 401) {
            this.commonService.logout();
          }
        }
      });
  }
  // ===================================================================

  private assignNotificationsFromResponse(response: any, preserveRead = false): void {
    const responseData = response?.data;

    // Shape A: { data: { unRead: [], read: [] } }
    if (responseData && !Array.isArray(responseData)) {
      const unread = Array.isArray(responseData.unRead) ? responseData.unRead : [];
      const read = Array.isArray(responseData.read) ? responseData.read : [];
      this.notificationlistUnRead = this.dedupeUnreadNotifications(unread);
      if (preserveRead) {
        // Keep read list unchanged for real server count in read tab.
        if (read.length > 0) {
          this.notificationlistRead = this.mergeReadNotifications(this.notificationlistRead || [], read);
        }
      } else {
        this.notificationlistRead = read;
      }
    }

    // Shape B: { data: [] } - unread-only payload, preserve existing read list.
    if (Array.isArray(responseData)) {
      this.notificationlistUnRead = this.dedupeUnreadNotifications(responseData);
      if (!Array.isArray(this.notificationlistRead)) {
        this.notificationlistRead = [];
      }
    }

    // Shape C: unknown/empty
    if (!responseData) {
      this.notificationlistUnRead = [];
      if (!preserveRead) {
        this.notificationlistRead = [];
      }
    }

    this.unreadCurrentPage = 1;
    this.readCurrentPage = 1;
  }

  notificationMarkAll(){
    const token = localStorage.getItem('tasklogintoken');
    const companyID = this.getCurrentCompanyId();

    if (!token || !companyID) return;

    const unreadPageNotifications = this.pagedUnreadNotifications || [];
    const unreadIds = unreadPageNotifications
      .map((item: any) => item?.id)
      .filter((id: any) => !!id);

    if (unreadIds.length === 0) {
      window.dispatchEvent(new CustomEvent('notifications-updated', { detail: { unreadCount: this.notificationlistUnRead?.length || 0 } }));
      return;
    }

    this.spinner.show();

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    const markRequests = unreadIds.map((notificationId: number) =>
      this.http.post(
        `${this.apiUrl}notificationView`,
        { notificationId },
        { headers }
      ).pipe(catchError(() => of(null)))
    );

    forkJoin(markRequests)
      .subscribe({
        next: () => {
          setTimeout(() => {
            this.toastr.success('Notification Mark All Successfully.');
          }, 10);

          // Move only current unread page notifications to read immediately in UI.
          const unreadPageIds = new Set(unreadPageNotifications.map((item: any) => item?.id));
          this.notificationlistRead = this.mergeReadNotifications(this.notificationlistRead, [
            ...unreadPageNotifications,
          ]);
          this.notificationlistUnRead = this.dedupeUnreadNotifications(
            (this.notificationlistUnRead || []).filter((item: any) => !unreadPageIds.has(item?.id))
          );
          this.unreadCurrentPage = 1;
          this.readCurrentPage = 1;

          window.dispatchEvent(new CustomEvent('notifications-updated', { detail: { unreadCount: this.notificationlistUnRead?.length || 0 } }));
          this.getNotifications(true);  // preserveRead=true: keep items already in read tab
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          if (error.status === 401) {
            this.commonService.logout();
          }
          console.error('Error loading Notification list:', error);
        }
      });
  }

  notificationclearAll(){
    const token = localStorage.getItem('tasklogintoken');
    const companyID = this.getCurrentCompanyId();

    if (!token || !companyID) return;

    this.spinner.show();

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    this.http
      .get(`${this.apiUrl}notificationDeleteAll?companyID=${companyID}`, { headers })
      .subscribe({
        next: (response: any) => {
          if(response.status == true){
            setTimeout(() => {
              this.toastr.success('Notification Clear All Successfully.')
            },10);
            // Keep tab stable and re-sync lists from server after clear all.
            this.readCurrentPage = 1;
            this.activeTab = 'Task';
            this.getNotifications(false);
          }
          window.dispatchEvent(new CustomEvent('notifications-updated', { detail: { unreadCount: this.notificationlistUnRead?.length || 0 } }));
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          if (error.status === 401) {
            this.commonService.logout();
          }
          console.error('Error loading Notification list:', error);
        }
      });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  get unreadTotalPages(): number {
    return Math.max(1, Math.ceil((this.notificationlistUnRead?.length || 0) / this.itemsPerPage));
  }

  get readTotalPages(): number {
    return Math.max(1, Math.ceil((this.notificationlistRead?.length || 0) / this.itemsPerPage));
  }

  get pagedUnreadNotifications(): any[] {
    const list = this.notificationlistUnRead || [];
    const start = (this.unreadCurrentPage - 1) * this.itemsPerPage;
    return list.slice(start, start + this.itemsPerPage);
  }

  get pagedReadNotifications(): any[] {
    const list = this.notificationlistRead || [];
    const start = (this.readCurrentPage - 1) * this.itemsPerPage;
    return list.slice(start, start + this.itemsPerPage);
  }

  nextUnreadPage(): void {
    if (this.unreadCurrentPage < this.unreadTotalPages) {
      this.unreadCurrentPage++;
    }
  }

  prevUnreadPage(): void {
    if (this.unreadCurrentPage > 1) {
      this.unreadCurrentPage--;
    }
  }

  nextReadPage(): void {
    if (this.readCurrentPage < this.readTotalPages) {
      this.readCurrentPage++;
    }
  }

  prevReadPage(): void {
    if (this.readCurrentPage > 1) {
      this.readCurrentPage--;
    }
  }
}