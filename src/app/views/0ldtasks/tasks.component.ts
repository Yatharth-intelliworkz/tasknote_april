import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  ElementRef,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  HostListener,
  ChangeDetectorRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import {
  Observable,
  ReplaySubject,
  Subject,
  take,
  takeUntil,
  timer,
} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventColor } from 'calendar-utils';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSelect } from '@angular/material/select';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, NgSwitch, NgSwitchCase, NgStyle } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter } from 'angular-calendar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import dayjs from 'dayjs/esm';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {
  UntypedFormControl,
  FormControl,
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  NgModel,Validators 
} from '@angular/forms';
import { CommonService } from '../service/common.service';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { MatListModule } from '@angular/material/list';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import * as RecordRTC from 'recordrtc';
declare var $: any;
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { TimerService } from '../service/timer.service';
import { NotificationService } from '../service/notification.service';
import Pusher from 'pusher-js';
import { MatInputModule } from '@angular/material/input';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { MatMenuTrigger } from '@angular/material/menu';
import { ColDef } from 'ag-grid-community';

interface FormValue {
  rangestart: Date | null;
  rangeend: Date | null;
}

const counter = timer(0, 1000);

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

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

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [ 
    AgGridAngular,
    FullCalendarModule,
    NgbDatepickerModule,
    CdkDropList,
    CdkDrag,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    MatIconModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    RouterLink,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxDaterangepickerMd,
    NgMultiSelectDropDownModule,
    MatMenuModule,
    MatListModule,
    CommonModule,
    NgxPaginationModule,
    MatInputModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ],
})
export class TasksComponent {
  @ViewChild('reasonInput') reasonInput!: ElementRef;
  @ViewChild('timerhour') timerhour!: ElementRef;

  public pinColumnDefs: ColDef[] = [
    {
      field: '',
      width: 70,
      cellRenderer: (params: any) => {
        const img = document.createElement('img');
        img.src = '../../../assets/img/dashboard/pin-icon.svg';
        img.alt = '';
        img.style.cursor = 'pointer';

        // Add a click event listener to the image element
        img.addEventListener('click', () => {
          this.updatepinstatus(params.data.task_id, '0'); // Call your Angular method here
        });

        return img;
      },
    },
    {
      field: 'statusIcons',
      headerName: '',
      width: 70,
      cellRenderer: (params: any) => {
        const taskId = params.data.task_id;
        const status = params.data.status;

        // Create an image element dynamically
        const img = document.createElement('img');
        img.src = '../../../assets/img/dashboard/table_mark_icon.svg';
        img.alt = '';
        img.style.cursor = 'pointer';
        if(params.data.allCheckListCompleted){
          img.setAttribute('disabled', 'true');
        }
        
        // Check if status is 'Closed'
        if (status === 'Closed') {
          
          if(params.data.allCheckListCompleted === 0){
            img.style.cursor = 'not-allowed';
             img.addEventListener('click', () => 
              this.checklistchecked(`${taskId}`)
            );
          }else{
            img.style.cursor = 'pointer';
            img.setAttribute('data-bs-toggle', 'modal');
            img.setAttribute('data-bs-target', '#completeTaskModal');

            // Add event listener to trigger modal programmatically
            img.addEventListener('click', () => {
              this.openModal(taskId);
            });
          }
        }
        else{
          img.addEventListener('click', () => {
            console.log('Task not closed, triggering toastr'); // Debugging line
            this.checkstatusclosed(`${taskId}`);
          });
        }

        return img;
      },
    },
   

    { field: 'projectName', headerName: 'Project Name' },
    {
      field: 'description',
      cellRenderer: (params: any) => {
        return `<a class="table_link" href="/view-task/${params.data.task_id}">${params.value}</a>`;
      },
      cellClass: params => {
        return params.data.tastDelayFlag  === 1 ? 'delay-bg' : '  ';
    },
      headerName: 'Task Name',
    },

    {
      field: '',
      headerName: '',
      cellRenderer: (params: any) => {
        // Create a wrapper div for both images
        const wrapper = document.createElement('div');

        // Timer Image
        const timerImg = document.createElement('img');
        timerImg.src = '../../../assets/img/dashboard/timer.svg';
        timerImg.alt = 'Timer';
        timerImg.setAttribute('data-bs-toggle', 'modal');
        timerImg.setAttribute('data-bs-target', '#timeModal');
        timerImg.style.cursor = 'pointer'; // Add pointer cursor for better UX
        timerImg.classList.add('mx-2'); // Add pointer cursor for better UX

    
        timerImg.addEventListener('click', () => {
          const pinTaskData = params.data; ;
  
          if (pinTaskData && pinTaskData.task_id && pinTaskData.checkList) {
              this.timerform(pinTaskData.task_id, pinTaskData.checkList);
              this.timerhour.nativeElement.click();
          } else {
              console.error('overDueTaskData or its properties are missing', params.data);
          }
        });

        // Append Timer Image to the wrapper
        wrapper.appendChild(timerImg);

        // Add space between images (Optional)
        const space = document.createTextNode(' ');
        wrapper.appendChild(space);

        // Chat Icon Image
        const chatImg = document.createElement('img');
        chatImg.src = '../../../assets/img/dashboard/table_chat_icon.svg';
        chatImg.alt = 'Chat';
        chatImg.setAttribute('data-bs-toggle', 'offcanvas');
        chatImg.setAttribute('data-bs-target', '#offcanvasTaskchat');
        chatImg.setAttribute('aria-controls', 'offcanvasRight');
        chatImg.style.cursor = 'pointer';

        // ✅ FIXED — params.data IS the task object, use task_id directly
          chatImg.addEventListener('click', () => {
            this.commenttask(params.data.task_id);
          });
        // Append Chat Icon to the wrapper
        wrapper.appendChild(chatImg);



      // file icon image

       // Append Timer Image to the wrapper
       wrapper.appendChild(timerImg);

      

       if (params.data.isDocument === 1) {
        // Chat Icon Image
        const fileImg = document.createElement('img');
        fileImg.src = '../../../assets/img/dashboard/file-icon.png';
        fileImg.alt = 'file';
        fileImg.style.cursor = 'pointer';
        fileImg.setAttribute('data-bs-toggle', 'modal');
        fileImg.setAttribute('data-bs-target', '#fileModals');
        // Add click event for the file icon
        fileImg.addEventListener('click', () => {
          // Fetch documents for the given task_id and show the modal
          this.getdocument(params.data.task_id);
         
         });
      
        // Append the file image to the wrapper
        wrapper.appendChild(fileImg);
      }


        // Return the wrapper
        return wrapper;
      },
    },
    { field: 'clientName', headerName: 'Client Name' },
    {
      valueGetter: (params) => {
        return params.data.memberData
          .map((member: any) => {
            const initials = this.getInitials(member.name);
            return `<span class="user_short_name rounded" title="${member.name}">${initials}</span>`;
          })
          .join(' ');
      },
      headerName: 'Assignees',
      cellRenderer: (params: { value: any }) => {
        return params.value;
      },
    },
   
    
    {
      headerName: 'Priority',
      field: 'priority',
      cellRenderer: (params: any) => {
        const eDiv = document.createElement('div');
        // Safeguard if overDueTaskData or priority is undefined
        if (params.data?.priority !== undefined) {
          const priorityImageSrc = this.selectPriority(params.data.priority.toString());
          const taskId = params.data.task_id;
    
          // Use Bootstrap select element
          eDiv.innerHTML = `
            <div class="priority_wrapper">
              <select class="form-select priority-select border-0">
                <option value="1">High</option>
                <option value="2">Medium</option>
                <option value="0">Low</option>
              </select>
            </div>
          `;
    
          // Add event listener for the select element
          const selectElement = eDiv.querySelector('.priority-select') as HTMLSelectElement;
          selectElement.value = params.data.priority.toString(); // Set the current priority
    
          selectElement.addEventListener('change', () => {
            const selectedValue = selectElement.value;
            this.taskPriorityUpdate(selectedValue, taskId); // Call your taskPriorityUpdate function
          });
    
        } else {
          eDiv.innerHTML = `<span>No priority data available</span>`;
        }
    
        return eDiv;
      },
      width: 150
    },
    { field: 'due_date', headerName: 'Due Date' },
    {
      field: 'status',
      cellRenderer: (params: any) => {
        // Access `statuslist` from the component
        const statusList = this.statuslist; // Accessing from component context
    
        
        const taskId = params.data.task_id;
        const status = params.data.status || 'No Status';
        const checkupdate = params.data.allCheckListCompleted;
        const eDiv = document.createElement('div');
        eDiv.innerHTML = `
          <div class="priority_wrapper">
            <select class="status-dropdown border-0">
              ${statusList.map((item: any) => `
                <option value="${item.id}" ${item.status === status ? 'selected' : ''} ${checkupdate === 0 && item.status === 'Closed' ? 'disabled' : ''}>
                  ${item.status}
                </option>`).join('')}
            </select>
          </div>
        `;
    
        const dropdown = eDiv.querySelector('.status-dropdown') as HTMLSelectElement;
        dropdown.addEventListener('change', () => {
          const newStatus = dropdown.value;
          this.selectStatus(newStatus, taskId); // Now this refers to the component
        });
    
        return eDiv;
      },
      headerName: 'Status'
    },
    
    {
      field: 'createdName',
      headerName: 'Created By',
      cellRenderer: (params: any) => {
        return `<span class="user_short_name rounded"  title="${
          params.value
        }">${this.getInitials(params.value)}</span>`;
      },
    },
    {
      field: '',
      headerName: 'Delay',
      width: 100,
      cellRenderer: (params: any) => {
        const taskId = params.data.task_id;
        const status = params.data.status;

        // Create an image element dynamically
        const img = document.createElement('img');
        img.src = '../../../assets/img/dashboard/delay-icon.svg';
        img.alt = '';
        img.style.cursor = 'pointer';
        img.style.width = '29px';
        // Check if status is 'Closed'
       
          img.setAttribute('data-bs-toggle', 'modal');
          img.setAttribute('data-bs-target', '#delayTaskModal');

          // Add event listener to trigger modal programmatically
          img.addEventListener('click', () => {
            this.openModalDelay(taskId);
          });
       

        return img;
      },
    },
    {
      field: '',
      headerName: 'Action',
      width: 100,
      cellRenderer: (params: any) => {
        const taskId = params.data.task_id;
      
        // Create an image element dynamically
        const img = document.createElement('img');
        img.src = '../../../assets/img/dashboard/table-delete-icon.svg';
        img.alt = '';
        img.style.cursor = 'pointer';
        img.style.width = '29px';
        // Check if status is 'Closed'
       
        img.addEventListener('click', () => {
          // Show confirmation dialog
          const confirmed = confirm('Are you sure you want to delete this task?');
          
          if (confirmed) {
          this.deletetaskAPI(taskId);  
            // Call the function if confirmed
            // this.openModalDelay(taskId);
          }
        });
        return img;
      },
    },
  ]
  public todayColumnDefs: ColDef[] = [
    {
      field: '',
      width: 70,
      cellRenderer: (params: any) => {
        const img = document.createElement('img');
        img.src = '../../../assets/img/dashboard/pin-icon.svg';
        img.alt = '';
        img.style.cursor = 'pointer';

        // Add a click event listener to the image element
        img.addEventListener('click', () => {
          this.updatepinstatus(params.data.task_id, '1'); // Call your Angular method here
        });

        return img;
      },
    },
    {
      field: 'statusIcons',
      headerName: '',
      width: 70,
      cellRenderer: (params: any) => {
        const taskId = params.data.task_id;
        const status = params.data.status;

        // Create an image element dynamically
        const img = document.createElement('img');
        img.src = '../../../assets/img/dashboard/table_mark_icon.svg';
        img.alt = '';
        img.style.cursor = 'pointer';
        if(params.data.allCheckListCompleted){
          img.setAttribute('disabled', 'true');
        }
        // Check if status is 'Closed'
        if (status === 'Closed') {
          if(params.data.allCheckListCompleted === 0){
            img.style.cursor = 'not-allowed';
             img.addEventListener('click', () => 
              this.checklistchecked(`${taskId}`)
            );
          }else{
            img.style.cursor = 'pointer';
            img.setAttribute('data-bs-toggle', 'modal');
            img.setAttribute('data-bs-target', '#completeTaskModal');

            // Add event listener to trigger modal programmatically
            img.addEventListener('click', () => {
              this.openModal(taskId);
            });
          }
        }
        else{
          img.addEventListener('click', () => {
            console.log('Task not closed, triggering toastr'); // Debugging line
            this.checkstatusclosed(`${taskId}`);
          });
        }

        return img;
      },
    },
    
    
    { field: 'projectName', headerName: 'Project Name' },
    {
      field: 'description',
      cellRenderer: (params: any) => {
        return `<a class="table_link" href="/view-task/${params.data.task_id}">${params.value}</a>`;
      },
      cellClass: params => {
        return params.data.tastDelayFlag  === 1 ? 'delay-bg' : '  ';
    },
      headerName: 'Task Name',
    },

    {
      field: '',
      headerName: '',
      cellRenderer: (params: any) => {
        // Create a wrapper div for both images
        const wrapper = document.createElement('div');

        // Timer Image
        const timerImg = document.createElement('img');
        timerImg.src = '../../../assets/img/dashboard/timer.svg';
        timerImg.alt = 'Timer';
        timerImg.setAttribute('data-bs-toggle', 'modal');
        timerImg.setAttribute('data-bs-target', '#timeModal');
        timerImg.style.cursor = 'pointer'; // Add pointer cursor for better UX
       

        // Add click event for timer
      
        timerImg.addEventListener('click', () => {
          const todayTaskData = params.data; ;
  
          if (todayTaskData && todayTaskData.task_id && todayTaskData.checkList) {
              this.timerform(todayTaskData.task_id, todayTaskData.checkList);
              this.timerhour.nativeElement.click();
          } else {
              console.error('todayTaskData or its properties are missing', params.data);
          }
        });

        // Append Timer Image to the wrapper
        wrapper.appendChild(timerImg);

        // Add space between images (Optional)
        const space = document.createTextNode(' ');
        wrapper.appendChild(space);

        // Chat Icon Image
        const chatImg = document.createElement('img');
        chatImg.src = '../../../assets/img/dashboard/table_chat_icon.svg';
        chatImg.alt = 'Chat';
        chatImg.setAttribute('data-bs-toggle', 'offcanvas');
        chatImg.setAttribute('data-bs-target', '#offcanvasTaskchat');
        chatImg.setAttribute('aria-controls', 'offcanvasRight');
        chatImg.style.cursor = 'pointer';
        chatImg.classList.add('mx-2');

        // ✅ FIXED — params.data IS the task object, use task_id directly
        chatImg.addEventListener('click', () => {
          this.commenttask(params.data.task_id);
        });

        // Append Chat Icon to the wrapper
        wrapper.appendChild(chatImg);

        if (params.data.isDocument === 1) {
          // Chat Icon Image
          const fileImg = document.createElement('img');
          fileImg.src = '../../../assets/img/dashboard/file-icon.png';
          fileImg.alt = 'file';
          fileImg.style.cursor = 'pointer';
          fileImg.setAttribute('data-bs-toggle', 'modal');
          fileImg.setAttribute('data-bs-target', '#fileModals');
          // Add click event for the file icon
          fileImg.addEventListener('click', () => {
            // Fetch documents for the given task_id and show the modal
            this.getdocument(params.data.task_id);
           
           });
        
          // Append the file image to the wrapper
          wrapper.appendChild(fileImg);
        }

       

        // Return the wrapper
        return wrapper;
      },
    },
    { field: 'clientName', headerName: 'Client Name' },
    {
      valueGetter: (params) => {
        return params.data.memberData
          .map((member: any) => {
            const initials = this.getInitials(member.name);
            return `<span class="user_short_name rounded" title="${member.name}">${initials}</span>`;
          })
          .join(' ');
      },
      headerName: 'Assignees',
      cellRenderer: (params: { value: any }) => {
        return params.value;
      },
    },
    {
      headerName: 'Priority',
      field: 'priority',
      cellRenderer: (params: any) => {
        const eDiv = document.createElement('div');
        // Safeguard if overDueTaskData or priority is undefined
        if (params.data?.priority !== undefined) {
          const priorityImageSrc = this.selectPriority(params.data.priority.toString());
          const taskId = params.data.task_id;
    
          // Use Bootstrap select element
          eDiv.innerHTML = `
            <div class="priority_wrapper">
              <select class="form-select priority-select border-0">
                <option value="1">High</option>
                <option value="2">Medium</option>
                <option value="0">Low</option>
              </select>
            </div>
          `;
    
          // Add event listener for the select element
          const selectElement = eDiv.querySelector('.priority-select') as HTMLSelectElement;
          selectElement.value = params.data.priority.toString(); // Set the current priority
    
          selectElement.addEventListener('change', () => {
            const selectedValue = selectElement.value;
            this.taskPriorityUpdate(selectedValue, taskId); // Call your taskPriorityUpdate function
          });
    
        } else {
          eDiv.innerHTML = `<span>No priority data available</span>`;
        }
    
        return eDiv;
      },
      width: 150
    },
    { field: 'due_date', headerName: 'Due Date' },
    {
      field: 'status',
      cellRenderer: (params: any) => {
        // Access `statuslist` from the component
        const statusList = this.statuslist; // Accessing from component context
        const taskId = params.data.task_id;
        const status = params.data.status || 'No Status';
        const checkupdate = params.data.allCheckListCompleted;
        const eDiv = document.createElement('div');
        eDiv.innerHTML = `
          <div class="priority_wrapper">
            <select class="status-dropdown border-0 form-select">
              ${statusList.map((item: any) => `
                <option value="${item.id}" ${item.status === status ? 'selected' : ''} ${checkupdate === 0 && item.status === 'Closed' ? 'disabled' : ''}>
                  ${item.status}
                </option>`).join('')}
            </select>
          </div>
        `;
    
        const dropdown = eDiv.querySelector('.status-dropdown') as HTMLSelectElement;
        dropdown.addEventListener('change', () => {
          const newStatus = dropdown.value;
          this.selectStatus(newStatus, taskId); // Now this refers to the component
        });
    
        return eDiv;
      },
      headerName: 'Status'
    },
    
    {
      field: 'createdName',
      headerName: 'Created By',
      cellRenderer: (params: any) => {
        return `<span class="user_short_name rounded"  title="${
          params.value
        }">${this.getInitials(params.value)}</span>`;
      },
    },
    {
      field: '',
      headerName: 'Delay',
      width: 100,
      cellRenderer: (params: any) => {
        const taskId = params.data.task_id;
        const dueDate = params.data.due_date ? new Date(params.data.due_date) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isPastDate = dueDate && dueDate < today;
       
        // Create an image element dynamically
        const img = document.createElement('img');
        img.src = '../../../assets/img/dashboard/delay-icon.svg';
        img.alt = '';
        img.style.width = '29px';
        
        // Disable delay for past dates
        if (isPastDate) {
          img.style.cursor = 'not-allowed';
          img.style.opacity = '0.5';
          img.addEventListener('click', () => {
            this.toastr.error('Cannot add delay for past due tasks.', 'Error', {
              timeOut: 2000,
              extendedTimeOut: 1000,
              closeButton: true,
              progressBar: true,
              tapToDismiss: true,
            });
          });
        } else {
          img.style.cursor = 'pointer';
          img.setAttribute('data-bs-toggle', 'modal');
          img.setAttribute('data-bs-target', '#delayTaskModal');

          // Add event listener to trigger modal programmatically
          img.addEventListener('click', () => {
             this.openModalDelay(taskId);
             const reasonInput = document.getElementById('reason') as HTMLElement;
             if (reasonInput) {
              
               reasonInput.click();
             }
          });
        }

        return img;
      },
    },
    {
      field: '',
      headerName: 'Action',
      width: 100,
      cellRenderer: (params: any) => {
        const taskId = params.data.task_id;
      
        // Create an image element dynamically
        const img = document.createElement('img');
        img.src = '../../../assets/img/dashboard/table-delete-icon.svg';
        img.alt = '';
        img.style.cursor = 'pointer';
        img.style.width = '29px';
        // Check if status is 'Closed'
       
        img.addEventListener('click', () => {
          // Show confirmation dialog
          const confirmed = confirm('Are you sure you want to delete this task?');
          
          if (confirmed) {
          this.deletetaskAPI(taskId);  
            // Call the function if confirmed
            // this.openModalDelay(taskId);
          }
        });
        return img;
      },
    },
  ];
  public overDueColumnDefs: ColDef[] = [
    {
      field: '',
      width: 70,
      cellRenderer: (params: any) => {
        const img = document.createElement('img');
        img.src = '../../../assets/img/dashboard/pin-icon.svg';
        img.alt = '';
        img.style.cursor = 'pointer';

        // Add a click event listener to the image element
        img.addEventListener('click', () => {
          this.updatepinstatus(params.data.task_id, '1'); // Call your Angular method here
        });

        return img;
      },
    },
    {
      field: 'statusIcons',
      headerName: '',
      width: 70,
      cellRenderer: (params: any) => {
        const taskId = params.data.task_id;
        const status = params.data.status;

        // Create an image element dynamically
        const img = document.createElement('img');
        img.src = '../../../assets/img/dashboard/table_mark_icon.svg';
        img.alt = '';img.style.cursor = 'pointer';
        if(params.data.allCheckListCompleted){
          img.setAttribute('disabled', 'true');
        }
        // Check if status is 'Closed'
        if (status === 'Closed') {
          if(params.data.allCheckListCompleted === 0){
            img.style.cursor = 'not-allowed';
             img.addEventListener('click', () => 
              this.checklistchecked(`${taskId}`)
            );
          }else{
            img.style.cursor = 'pointer';
            img.setAttribute('data-bs-toggle', 'modal');
            img.setAttribute('data-bs-target', '#completeTaskModal');

            // Add event listener to trigger modal programmatically
            img.addEventListener('click', () => {
              this.openModal(taskId);
            });
          }
        }
        else{
          img.addEventListener('click', () => 
            this.checkstatusclosed(`${taskId}`)
          );
        }

        return img;
      },
    },

    
    { field: 'projectName', headerName: 'Project Name' },
    {
      field: 'description',
      cellRenderer: (params: any) => {
        return `<a class="table_link" href="/view-task/${params.data.task_id}">${params.value}</a>`;
      },
      cellClass: params => {
        return params.data.tastDelayFlag  === 1 ? 'delay-bg' : '  ';
    },
      headerName: 'Task Name',
    },

    {
      field: '',
      headerName: '',
      cellRenderer: (params: any) => {
        const wrapper = document.createElement('div');

    // Timer Image
    const timerImg = document.createElement('img');
    timerImg.src = '../../../assets/img/dashboard/timer.svg';
    timerImg.alt = 'Timer';
    timerImg.setAttribute('data-bs-toggle', 'modal');
    timerImg.setAttribute('data-bs-target', '#timeModal');
    timerImg.style.cursor = 'pointer';

    // Add click event for timer using arrow function to preserve `this`
      timerImg.addEventListener('click', () => {
        const overDueTaskData = params.data; ;

        if (overDueTaskData && overDueTaskData.task_id && overDueTaskData.checkList) {
            this.timerform(overDueTaskData.task_id, overDueTaskData.checkList);
             this.timerhour.nativeElement.click();
        } else {
            console.error('overDueTaskData or its properties are missing', params.data);
        }
      });

      wrapper.appendChild(timerImg);

        // Add space between images (Optional)
        const space = document.createTextNode(' ');
        wrapper.appendChild(space);

        // Chat Icon Image
        const chatImg = document.createElement('img');
        chatImg.src = '../../../assets/img/dashboard/table_chat_icon.svg';
        chatImg.alt = 'Chat';
        chatImg.setAttribute('data-bs-toggle', 'offcanvas');
        chatImg.setAttribute('data-bs-target', '#offcanvasTaskchat');
        chatImg.setAttribute('aria-controls', 'offcanvasRight');
        chatImg.style.cursor = 'pointer';
        chatImg.classList.add('mx-2');

        // Add click event for chat icon
        // ✅ FIXED — params.data IS the task object, use task_id directly
        chatImg.addEventListener('click', () => {
          this.commenttask(params.data.task_id);
        });
        // Append Chat Icon to the wrapper
        wrapper.appendChild(chatImg);

        if (params.data.isDocument === 1) {
          // Chat Icon Image
          const fileImg = document.createElement('img');
          fileImg.src = '../../../assets/img/dashboard/file-icon.png';
          fileImg.alt = 'file';
          fileImg.style.cursor = 'pointer';
          fileImg.setAttribute('data-bs-toggle', 'modal');
          fileImg.setAttribute('data-bs-target', '#fileModals');
          // Add click event for the file icon
          fileImg.addEventListener('click', () => {
            // Fetch documents for the given task_id and show the modal
            this.getdocument(params.data.task_id);
           
           });
        
          // Append the file image to the wrapper
          wrapper.appendChild(fileImg);
        }

        // Return the wrapper
        return wrapper;
      },
    },
    { field: 'clientName', headerName: 'Client Name' },
    {
      valueGetter: (params) => {
        return params.data.memberData
          .map((member: any) => {
            const initials = this.getInitials(member.name);
            return `<span class="user_short_name rounded" title="${member.name}">${initials}</span>`;
          })
          .join(' ');
      },
      headerName: 'Assignees',
      cellRenderer: (params: { value: any }) => {
        return params.value;
      },
    },
    {
      headerName: 'Priority',
      field: 'priority',
      cellRenderer: (params: any) => {
        const eDiv = document.createElement('div');
        // Safeguard if overDueTaskData or priority is undefined
        if (params.data?.priority !== undefined) {
          const priorityImageSrc = this.selectPriority(params.data.priority.toString());
          const taskId = params.data.task_id;
    
          // Use Bootstrap select element
          eDiv.innerHTML = `
            <div class="priority_wrapper">
              <select class="form-select priority-select border-0">
                <option value="1">High</option>
                <option value="2">Medium</option>
                <option value="0">Low</option>
              </select>
            </div>
          `;
    
          // Add event listener for the select element
          const selectElement = eDiv.querySelector('.priority-select') as HTMLSelectElement;
          selectElement.value = params.data.priority.toString(); // Set the current priority
    
          selectElement.addEventListener('change', () => {
            const selectedValue = selectElement.value;
            this.taskPriorityUpdate(selectedValue, taskId); // Call your taskPriorityUpdate function
          });
    
        } else {
          eDiv.innerHTML = `<span>No priority data available</span>`;
        }
    
        return eDiv;
      },
      width: 150
    },
    { field: 'due_date', headerName: 'Due Date' },
    {
      field: 'status',
      cellRenderer: (params: any) => {
        // Access `statuslist` from the component
        const statusList = this.statuslist; // Accessing from component context
    
        const taskId = params.data.task_id;
        const status = params.data.status || 'No Status';
        const checkupdate = params.data.allCheckListCompleted;
        const eDiv = document.createElement('div');
        eDiv.innerHTML = `
          <div class="priority_wrapper">
            <select class="status-dropdown border-0 form-select" >
              ${statusList.map((item: any) => `
                <option value="${item.id}" ${item.status === status ? 'selected' : ''} ${checkupdate === 0 && item.status === 'Closed' ? 'disabled' : ''}>
                  ${item.status}
                </option>`).join('')}
            </select>
          </div>
        `;
    
        const dropdown = eDiv.querySelector('.status-dropdown') as HTMLSelectElement;
        dropdown.addEventListener('change', () => {
          const newStatus = dropdown.value;
          this.selectStatus(newStatus, taskId);// Now this refers to the component
        });
    
        return eDiv;
      },
      headerName: 'Status'
    },
    {
      field: 'createdName',
      headerName: 'Created By',
      cellRenderer: (params: any) => {
        return `<span class="user_short_name rounded"  title="${
          params.value
        }">${this.getInitials(params.value)}</span>`;
      },
    },
    
    {
      field: '',
      headerName: 'Delay',
      width: 100,
      cellRenderer: (params: any) => {
        const taskId = params.data.task_id;
        const status = params.data.status;
        const dueDate = params.data.due_date ? new Date(params.data.due_date) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isPastDate = dueDate && dueDate < today;

        // Create an image element dynamically
        const img = document.createElement('img');
        img.src = '../../../assets/img/dashboard/delay-icon.svg';
        img.alt = '';
        img.style.width = '29px';
        
        // Disable delay for past dates
        if (isPastDate) {
          img.style.cursor = 'not-allowed';
          img.style.opacity = '0.5';
          img.addEventListener('click', () => {
            this.toastr.error('Cannot add delay for past due tasks.', 'Error', {
              timeOut: 2000,
              extendedTimeOut: 1000,
              closeButton: true,
              progressBar: true,
              tapToDismiss: true,
            });
          });
        } else {
          img.style.cursor = 'pointer';
          img.setAttribute('data-bs-toggle', 'modal');
          img.setAttribute('data-bs-target', '#delayTaskModal');

          // Add event listener to trigger modal programmatically
          img.addEventListener('click', () => {
            this.openModalDelay(taskId);
          });
        }

        return img;
      },
    },
    {
      field: '',
      headerName: 'Action',
      width: 100,
      cellRenderer: (params: any) => {
        const taskId = params.data.task_id;
      
        // Create an image element dynamically
        const img = document.createElement('img');
        img.src = '../../../assets/img/dashboard/table-delete-icon.svg';
        img.alt = '';
        img.style.cursor = 'pointer';
        img.style.width = '29px';
        // Check if status is 'Closed'
       
        img.addEventListener('click', () => {
          // Show confirmation dialog
          const confirmed = confirm('Are you sure you want to delete this task?');
          
          if (confirmed) {
             this.deletetaskAPI(taskId);  
          }
        });
        return img;
      },
    },
  ];
  public upComingColumnDefs: ColDef[] = [
    {
      field: '',
      width: 70,
      cellRenderer: (params: any) => {
        const img = document.createElement('img');
        img.src = '../../../assets/img/dashboard/pin-icon.svg';
        img.alt = '';
        img.style.cursor = 'pointer';

        // Add a click event listener to the image element
        img.addEventListener('click', () => {
          this.updatepinstatus(params.data.task_id, '1'); // Call your Angular method here
        });

        return img;
      },
    },
    {
      field: 'statusIcons',
      headerName: '',
      width: 70,
      cellRenderer: (params: any) => {
        const taskId = params.data.task_id;
        const status = params.data.status;
        const checkupdate = params.data.allCheckListCompleted;
        // Create an image element dynamically
        const img = document.createElement('img');
        img.src = '../../../assets/img/dashboard/table_mark_icon.svg';
        img.alt = '';
        img.style.cursor = 'pointer';
      
        // Check if status is 'Closed'
        if (status === 'Closed') {
          if(params.data.allCheckListCompleted === 0){
            img.style.cursor = 'not-allowed';
             img.addEventListener('click', () => 
              this.checklistchecked(`${taskId}`)
            );
          }else{
            img.style.cursor = 'pointer';
            img.setAttribute('data-bs-toggle', 'modal');
            img.setAttribute('data-bs-target', '#completeTaskModal');

            // Add event listener to trigger modal programmatically
            img.addEventListener('click', () => {
              this.openModal(taskId);
            });
          }
          
        }
        else{
          img.addEventListener('click', () => {
                this.checkstatusclosed(`${taskId}`);
          });
        }

        return img;
      },
    },
   
    { field: 'projectName', headerName: 'Project Name' },
    {
      field: 'description',
      cellRenderer: (params: any) => {
        return `<a class="table_link" href="/view-task/${params.data.task_id}">${params.value}</a>`;
      },
      cellClass: params => {
        return params.data.tastDelayFlag  === 1 ? 'delay-bg' : '  ';
    },
      headerName: 'Task Name',
    },

    {
      field: '',
      headerName: '',
      cellRenderer: (params: any) => {
        // Create a wrapper div for both images
        const wrapper = document.createElement('div');

        // Timer Image
        const timerImg = document.createElement('img');
        timerImg.src = '../../../assets/img/dashboard/timer.svg';
        timerImg.alt = 'Timer';
        timerImg.setAttribute('data-bs-toggle', 'modal');
        timerImg.setAttribute('data-bs-target', '#timeModal');
        timerImg.style.cursor = 'pointer'; // Add pointer cursor for better UX
        

        // Add click event for timer
       
        timerImg.addEventListener('click', () => {
          const upcomingTaskData = params.data; ;
  
          if (upcomingTaskData && upcomingTaskData.task_id && upcomingTaskData.checkList) {
              this.timerform(upcomingTaskData.task_id, upcomingTaskData.checkList);
              this.timerhour.nativeElement.click();
          } else {
              console.error('upcomingTaskData or its properties are missing', params.data);
          }
        });

        // Append Timer Image to the wrapper
        wrapper.appendChild(timerImg);

        // Add space between images (Optional)
        const space = document.createTextNode(' ');
        wrapper.appendChild(space);

        // Chat Icon Image
        const chatImg = document.createElement('img');
        chatImg.src = '../../../assets/img/dashboard/table_chat_icon.svg';
        chatImg.alt = 'Chat';
        chatImg.setAttribute('data-bs-toggle', 'offcanvas');
        chatImg.setAttribute('data-bs-target', '#offcanvasTaskchat');
        chatImg.setAttribute('aria-controls', 'offcanvasRight');
        chatImg.style.cursor = 'pointer';
        chatImg.classList.add('mx-2');

        // Add click event for chat icon
        // ✅ FIXED — params.data IS the task object, use task_id directly
        chatImg.addEventListener('click', () => {
          this.commenttask(params.data.task_id);
        });

        // Append Chat Icon to the wrapper
        wrapper.appendChild(chatImg);


        if (params.data.isDocument === 1) {
          // Chat Icon Image
          const fileImg = document.createElement('img');
          fileImg.src = '../../../assets/img/dashboard/file-icon.png';
          fileImg.alt = 'file';
          fileImg.style.cursor = 'pointer';
          fileImg.setAttribute('data-bs-toggle', 'modal');
          fileImg.setAttribute('data-bs-target', '#fileModals');
          // Add click event for the file icon
          fileImg.addEventListener('click', () => {
            // Fetch documents for the given task_id and show the modal
            this.getdocument(params.data.task_id);
           
           });
        
          // Append the file image to the wrapper
          wrapper.appendChild(fileImg);
        }


        // Return the wrapper
        return wrapper;
      },
    },
  
    { field: 'clientName', headerName: 'Client Name' },
    {
      valueGetter: (params) => {
        return params.data.memberData
          .map((member: any) => {
            const initials = this.getInitials(member.name);
            return `<span class="user_short_name rounded" title="${member.name}">${initials}</span>`;
          })
          .join(' ');
      },
      headerName: 'Assignees',
      cellRenderer: (params: { value: any }) => {
        return params.value;
      },
    },
   
    {
      headerName: 'Priority',
      field: 'priority',
      cellRenderer: (params: any) => {
        const eDiv = document.createElement('div');
        // Safeguard if overDueTaskData or priority is undefined
        if (params.data?.priority !== undefined) {
          const priorityImageSrc = this.selectPriority(params.data.priority.toString());
          const taskId = params.data.task_id;
    
          // Use Bootstrap select element
          eDiv.innerHTML = `
            <div class="priority_wrapper">
              <select class="form-select priority-select border-0">
                <option value="1">High</option>
                <option value="2">Medium</option>
                <option value="0">Low</option>
              </select>
            </div>
          `;
    
          // Add event listener for the select element
          const selectElement = eDiv.querySelector('.priority-select') as HTMLSelectElement;
          selectElement.value = params.data.priority.toString(); // Set the current priority
    
          selectElement.addEventListener('change', () => {
            const selectedValue = selectElement.value;
            this.taskPriorityUpdate(selectedValue, taskId); // Call your taskPriorityUpdate function
          });
    
        } else {
          eDiv.innerHTML = `<span>No priority data available</span>`;
        }
    
        return eDiv;
      },
      width: 150
    },
    { field: 'due_date', headerName: 'Due Date' },
    {
      field: 'status',
      cellRenderer: (params: any) => {
        // Access `statuslist` from the component
        const statusList = this.statuslist; // Accessing from component context
    
       const taskId = params.data.task_id;
        const status = params.data.status || 'No Status';
        const checkupdate = params.data.allCheckListCompleted;
        const eDiv = document.createElement('div');
        eDiv.innerHTML = `
          <div class="priority_wrapper">
            <select class="status-dropdown border-0 form-select">
              ${statusList.map((item: any) => `
                <option value="${item.id}" ${item.status === status ? 'selected' : ''} ${checkupdate === 0 && item.status === 'Closed' ? 'disabled' : ''}>
                  ${item.status}
                </option>`).join('')}
            </select>
          </div>
        `;
    
        const dropdown = eDiv.querySelector('.status-dropdown') as HTMLSelectElement;
        dropdown.addEventListener('change', () => {
          const newStatus = dropdown.value;
          this.selectStatus(newStatus, taskId); // Now this refers to the component
        });
    
        return eDiv;
      },
      headerName: 'Status'
    },
    {
      field: 'createdName',
      headerName: 'Created By',
      cellRenderer: (params: any) => {
        return `<span class="user_short_name rounded"  title="${
          params.value
        }">${this.getInitials(params.value)}</span>`;
      },
      width: 150
    },
    
    {
      field: '',
      headerName: 'Delay',
      width: 100,
      cellRenderer: (params: any) => {
        const taskId = params.data.task_id;
        const dueDate = params.data.due_date ? new Date(params.data.due_date) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isPastDate = dueDate && dueDate < today;

        // Create an image element dynamically
        const img = document.createElement('img');
        img.src = '../../../assets/img/dashboard/delay-icon.svg';
        img.alt = '';
        img.style.width = '29px';
        
        // Disable delay for past dates
        if (isPastDate) {
          img.style.cursor = 'not-allowed';
          img.style.opacity = '0.5';
          img.addEventListener('click', () => {
            this.toastr.error('Cannot add delay for past due tasks.', 'Error', {
              timeOut: 2000,
              extendedTimeOut: 1000,
              closeButton: true,
              progressBar: true,
              tapToDismiss: true,
            });
          });
        } else {
          img.style.cursor = 'pointer';
          img.setAttribute('data-bs-toggle', 'modal');
          img.setAttribute('data-bs-target', '#delayTaskModal');

          // Add event listener to trigger modal programmatically
          img.addEventListener('click', () => {
            this.openModalDelay(taskId);
          });
        }

        return img;
      },
    },
    {
      field: '',
      headerName: 'Action',
      width: 100,
      cellRenderer: (params: any) => {
        const taskId = params.data.task_id;
      
        // Create an image element dynamically
        const img = document.createElement('img');
        img.src = '../../../assets/img/dashboard/table-delete-icon.svg';
        img.alt = '';
        img.style.cursor = 'pointer';
        img.style.width = '29px';
        // Check if status is 'Closed'
       
        img.addEventListener('click', () => {
          // Show confirmation dialog
          const confirmed = confirm('Are you sure you want to delete this task?');
          
          if (confirmed) {
          this.deletetaskAPI(taskId);  
            // Call the function if confirmed
            // this.openModalDelay(taskId);
          }
        });
        return img;
      },
    },
  ];
  public completedColumnDefs: ColDef[] = [
    {
      field: '',
      width: 70,
      cellRenderer: (params: any) => {
        const img = document.createElement('img');
        img.src = '../../../assets/img/dashboard/pin-icon.svg';
        img.alt = '';
        img.style.cursor = 'pointer';

        // Add a click event listener to the image element
        img.addEventListener('click', () => {
          this.updatepinstatus(params.data.task_id, '1'); // Call your Angular method here
        });

        return img;
      },
    },
    {
      field: 'statusIcons',
      headerName: '',
      width: 70,
      cellRenderer: (params: any) => {
        const taskId = params.data.task_id;
        const status = params.data.status;

        // Create an image element dynamically
        const img = document.createElement('img');
        img.src = '../../../assets/img/dashboard/table_mark_icon.svg';
        img.alt = '';
        img.style.cursor = 'pointer';

        // Check if status is 'Closed'
        if (status === 'Closed') {
          img.setAttribute('data-bs-toggle', 'modal');
          img.setAttribute('data-bs-target', '#incompleteTaskModal');

          // Add event listener to trigger modal programmatically
          img.addEventListener('click', () => {
            this.openModal(taskId);
          });
        }

        return img;
      },
    },

   
    { field: 'projectName', headerName: 'Project Name' },

    {
      field: 'description',
      cellRenderer: (params: any) => {
        return `<a class="table_link" href="/view-task/${params.data.task_id}">${params.value}</a>`;
      },
      cellClass: params => {
        return params.data.tastDelayFlag  === 1 ? 'delay-bg' : '  ';
    },
      headerName: 'Task Name',
    },

    {
      field: '',
      headerName: '',
      cellRenderer: (params: any) => {
        // Create a wrapper div for both images
        const wrapper = document.createElement('div');

        // Timer Image
        const timerImg = document.createElement('img');
        timerImg.src = '../../../assets/img/dashboard/timer.svg';
        timerImg.alt = 'Timer';
        timerImg.setAttribute('data-bs-toggle', 'modal');
        timerImg.setAttribute('data-bs-target', '#timeModal');
        timerImg.style.cursor = 'pointer'; // Add pointer cursor for better UX
         // Add pointer cursor for better UX

        // Add click event for timer
   
        timerImg.addEventListener('click', () => {
          const completedTaskData = params.data; ;
  
          if (completedTaskData && completedTaskData.task_id && completedTaskData.checkList) {
              this.timerform(completedTaskData.task_id, completedTaskData.checkList);
              this.timerhour.nativeElement.click();
          } else {
              console.error('completedTaskData or its properties are missing', params.data);
          }
        });

        // Append Timer Image to the wrapper
        wrapper.appendChild(timerImg);

        // Add space between images (Optional)
        const space = document.createTextNode(' ');
        wrapper.appendChild(space);

        // Chat Icon Image
        const chatImg = document.createElement('img');
        chatImg.src = '../../../assets/img/dashboard/table_chat_icon.svg';
        chatImg.alt = 'Chat';
        chatImg.setAttribute('data-bs-toggle', 'offcanvas');
        chatImg.setAttribute('data-bs-target', '#offcanvasTaskchat');
        chatImg.setAttribute('aria-controls', 'offcanvasRight');
        chatImg.style.cursor = 'pointer';
        chatImg.classList.add('mx-2');

        // ✅ FIXED — params.data IS the task object, use task_id directly
        chatImg.addEventListener('click', () => {
          this.commenttask(params.data.task_id);
        });

        // Append Chat Icon to the wrapper
        wrapper.appendChild(chatImg);

        if (params.data.isDocument === 1) {
          // Chat Icon Image
          const fileImg = document.createElement('img');
          fileImg.src = '../../../assets/img/dashboard/file-icon.png';
          fileImg.alt = 'file';
          fileImg.style.cursor = 'pointer';
          fileImg.setAttribute('data-bs-toggle', 'modal');
          fileImg.setAttribute('data-bs-target', '#fileModals');
          // Add click event for the file icon
          fileImg.addEventListener('click', () => {
            // Fetch documents for the given task_id and show the modal
            this.getdocument(params.data.task_id);
           
           });
        
          // Append the file image to the wrapper
          wrapper.appendChild(fileImg);
        }

        // Return the wrapper
        return wrapper;
      },
      
    },
    { field: 'clientName', headerName: 'Client Name' },
    {
      valueGetter: (params) => {
        return params.data.memberData
          .map((member: any) => {
            const initials = this.getInitials(member.name);
            return `<span class="user_short_name rounded" title="${member.name}">${initials}</span>`;
          })
          .join(' ');
      },
      headerName: 'Assignees',
      cellRenderer: (params: { value: any }) => {
        return params.value;
      },
    },
   
    {
      headerName: 'Priority',
      field: 'priority',
      cellRenderer: (params: any) => {
        const eDiv = document.createElement('div');
        // Safeguard if overDueTaskData or priority is undefined
        if (params.data?.priority !== undefined) {
          const priorityImageSrc = this.selectPriority(params.data.priority.toString());
          const taskId = params.data.task_id;
    
          // Use Bootstrap select element
          eDiv.innerHTML = `
            <div class="priority_wrapper">
              <select class="form-select priority-select border-0">
                <option value="1">High</option>
                <option value="2">Medium</option>
                <option value="0">Low</option>
              </select>
            </div>
          `;
    
          // Add event listener for the select element
          const selectElement = eDiv.querySelector('.priority-select') as HTMLSelectElement;
          selectElement.value = params.data.priority.toString(); // Set the current priority
    
          selectElement.addEventListener('change', () => {
            const selectedValue = selectElement.value;
            this.taskPriorityUpdate(selectedValue, taskId); // Call your taskPriorityUpdate function
          });
    
        } else {
          eDiv.innerHTML = `<span>No priority data available</span>`;
        }
    
        return eDiv;
      },
      width: 150
    },
    { field: 'due_date', headerName: 'Due Date' },
    {
      field: 'status',
      cellRenderer: (params: any) => {
        // Access `statuslist` from the component
        const statusList = this.statuslist; // Accessing from component context
    
        const taskId = params.data.task_id;
        const status = params.data.status || 'No Status';
    
        const eDiv = document.createElement('div');
        eDiv.innerHTML = `
          <div class="priority_wrapper">
            <select class="status-dropdown border-0 form-select">
              ${statusList.map((item: any) => `
                <option value="${item.id}" ${item.status === status ? 'selected' : ''}>
                  ${item.status}
                </option>`).join('')}
            </select>
          </div>
        `;
    
        const dropdown = eDiv.querySelector('.status-dropdown') as HTMLSelectElement;
        dropdown.addEventListener('change', () => {
          const newStatus = dropdown.value;
          this.selectStatus(newStatus, taskId);// Now this refers to the component
        });
    
        return eDiv;
      },
      headerName: 'Status'
    },
    {
      field: 'createdName',
      headerName: 'Created By',
      cellRenderer: (params: any) => {
        return `<span class="user_short_name rounded"  title="${
          params.value
        }">${this.getInitials(params.value)}</span>`;
      },
    },
   
  ];
  renderer: any;
  taskStatusUpdate: any;
  

  
   toggleMenu(taskId: any) {
    const menu = document.getElementById(`menu-${taskId}`);
    if (menu) {
      menu.classList.toggle('show'); // Toggle visibility
    }
  }

  closeMenu(taskId: any) {
    const menuDiv = document.getElementById(`menu-${taskId}`);
    if (menuDiv) {
      menuDiv.style.display = 'none'; // Close menu after updating
    }
  }
  
  // Method to open the menu if needed (optional)
  openMenu(taskId: any) {
    const menuDiv = document.getElementById(`menu-${taskId}`);
    if (menuDiv) {
      menuDiv.style.display = 'block'; // Open menu
    }
  }
  
  public rowData: any[] = [];
  public pinListRowData: any[] = [];
  public todayListRowData: any[] = [];
  public overDueListRowData: any[] = [];
  public upcomingListRowData: any[] = [];
  selectedCheckbox: number | null = null; // to store the selected checkbox ID

  public defaultColDef: ColDef = {
    editable: false,
    filter: true,
  };
  public themeClass: string = 'ag-theme-quartz';

  pagination = true;
  paginationPageSize = 20;
  paginationPageSizeSelector = [20, 50, 100];

  menuOpen = false;
  priorityMenu(): void {
    this.menuOpen = !this.menuOpen;
  }


  showDiv = {
    taskList: true, // Task List is active on load
    calendar: false,
  };

  toggleTaskList() {
    this.showDiv.taskList = true;
    this.showDiv.calendar = false;
  }

  toggleCalendar() {
    this.showDiv.calendar = true;
    this.showDiv.taskList = false;
  }
  documentList:any;
  visible: boolean = false;
  delaytasklist:any;
  clock: string = '';
  delaytaskId: any;
  clocks: string = '';
  pausedTime: number = 0; // Store the timestamp when the timer is paused
  startTime: number = 0; // Store the timestamp when the timer starts
  elapsedTime: number = 0;
  paused: boolean = false;
  intervalId: any;
  subTaskList: any;
  calendarVisible = signal(true);
  idleTimeout: any;
  idleSeconds: number = 0;
  idleMessageVisible: boolean = false;
  private pushID = environment.pushID;
  private apiUrl = environment.ApiUrl;
  public domainName = environment.domainName;
  toppingList1: Array<Client> = [];
  formGroup!: FormGroup;
  commaSeparatedIDsstatus!: string;
  submitForm!: FormGroup;
  statuslistData: any;
  statuslistDatas: any;
  rangetype: any;
  statuslist: any;
  statuslists: any;
  companyId = localStorage.getItem('usercompanyId');
  checkbox: boolean = false;
  taskListData: any;
  taskListAll: any;
  eventscal: any;
  selectedTaskId: any;
  selectedsubTaskId: any;
  addbutton: any;
  editbutton: any;
  taskCommentData: any;
  taskCommenttitle: any;
  checklisttask: any;
  submitFormComment!: FormGroup;
  timeupdate!: FormGroup;
  timess: any;
  timessget: any;
  loading: boolean = false;
  localstorageuserId = localStorage.getItem('userid');
  p: number = 1;
  count = 10;
  taskIds: any;
  selectedImages: any;
  selctedfiletype: any;
  previewfile: any;
  selctedfilename: any;
  progress: any;
  isUploading: boolean = false;
  taskIdsForFile: any;
  selectedTimerTaskId: any;
  checkboxCompleted: {
    checklistidcp: number;
    fileUpload: [];
    checkListIdcm: number;
  }[] = [];
  checkListSelectedId: any;
  datasinformation: { tskId: any; fileUpload: any; checkListId: any }[] = [];
  documentRequired = 0;
  bootstrap: any;
  // Declare events array for FullCalendar
  eventsCalendar: any[] = [];
  calendarOptions: any;
  bulkUpload() {
    this.checkbox = true;
  }
  hideBottomaction() {
    this.checkbox = !this.checkbox;
  }
  selectedPriority: { image: string } = { image: '' };

  onclick() {
    this.visible = !this.visible;
  }

  img: any;
  // initialize with the default status

  selectPriority(priority: string): string {
    
    switch (priority) {
      case '1':
        return '../../../assets/img/dashboard/flag-R.svg'; // High Priority
      case '0':
        return '../../../assets/img/dashboard/flag-G.svg'; // Low Priority
      case '2':
        return '../../../assets/img/dashboard/flag-Y.svg'; // Medium Priority
      default:
        return '../../../assets/img/dashboard/flag-default.svg'; 
    }
  }

  title = 'micRecorder';
  record: any;
  recording = false;
  url: any;
  error: any;
  chatresponse: any;
  selectedStatus: string = ''; // initialize with the default status

  selectStatus(statuses: string, todaytask: any): void {
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
              this.notificationService.pushNotify(response.data);
              this.gettaskList();
            }
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        )
        .add(() => (this.loading = false)); // Stop loader on completion (success or error)
    }
  }
  befordate!: Date | null;
  ondate!: Date | null;
  afterdate!: Date | null;
  rangestart!: Date | null;
  rangeend!: Date | null;
  opened: boolean | undefined;
  mainDocument:any;
  clickOutside() {
    this.opened = !this.opened;
  }

  whichclicked(id: any) {
    this.rangetype = id;
  }

  campaignOne = new FormGroup({
    rangestart: new FormControl(new Date()),
    rangeend: new FormControl(new Date()),
  });

  campaignTwo = new FormGroup({
    rangestart: new FormControl(new Date()),
    rangeend: new FormControl(new Date()), // Change rangeendend to rangeend
  });

  // maltiple date script

  data = [];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
  }

  openStaticBackdrop(content: TemplateRef<any>) {
    this.offcanvasService.open(content, {
      backdrop: 'static',
      position: 'end',
    });
  }

  // single date and multiple date  select

  displayMonths = 2;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';
  edittaskid: any;
  // single date and multiple date  select

  selectOption(option: string, event: Event) {
    event.preventDefault(); // Prevent the default behavior of the dropdown toggle
  }

  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;

  // multiselect dd.\
  fileForm!: FormGroup;

  selectedItems2: ICountry[] = [];
  form: FormGroup;
  delayForm: FormGroup;
  countries: Array<ICountry> = [];
  task_id: any;
  dropdownSettings2: any = {};
  memberlistData: any;
  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private offcanvasService: NgbOffcanvas,
    private commonService: CommonService,
    private http: HttpClient,
    private toastr: ToastrService,
    private elementRef: ElementRef,
    private domSanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    private router: Router,
    public timerService: TimerService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
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

    this.getcompanyuser();
    this.timerService.timerStoppedget.subscribe((time: string) => {
      this.clocks = time; // Capture the time when the timer is stopped
      this.submitFormsonstop(this.clocks);
    });
    this.spinner.show();
    this.submitFormComment = this.fb.group({
      comment: [''],
      is_comment: ['text'],
      task_id: [''],
      extension: [''],
      filename: [''],
    });
    this.timeupdate = this.fb.group({
      taskIds: [this.taskIds],
      completed: [false],
      completedNote: [''],
      timerhour: [''],
      timerminute: [''],
    });
    this.submitForm = this.fb.group({
      statusID: [''],
      userID: [''],
      duedate: [''],
      createddate: [''],
      closeddate: [''],
      rangedates: [''],
      befordate: [''],
      ondate: [''],
      afterdate: [''],
      rangestart: [''],
      rangeend: [''],
    });
    this.fileForm = this.formBuilder.group({
      multiplefile: ['initialValue'],
    });

    this.form = this.fb.group({
      selectedItems2: [[]], // Initialize as an empty array
      // attech file
      yourFormControlName: ['initialValue'],
      // attech file
    });


    this.delayForm = this.fb.group({
      delaytask_id: [''],
      reason : [''],
      reason_date: [''],
    });

    this.dropdownSettings2 = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
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
        item_id: 4,
        item_text: 'Yamini Patel',
        image: 'url_to_image3.jpg',
      },
    ];
  }
  ngOnInit() {
    if (localStorage.getItem('userid') !== null) {
      Pusher.logToConsole = false;

      const pusher = new Pusher(`${this.pushID}`, {
        cluster: 'ap2',
      });

      const userId = localStorage.getItem('userid');
      let channel3 = pusher.subscribe(`pushnotification.${userId}`);

      channel3.bind('push-notification', (data: any) => {
        if (userId == data.message.userId) {
          this.notificationService.pushNotify(data.message);
        }
      });
    }
    // this.notificationService.requestPermission();
    // this.notificationService.pushNotify();
    this.timerService.timerStopped.subscribe(() => {
      // this.submitForms(this.clock);
      this.timess = this.clock;
    });
    this.calendarOptions = {
      plugins: [dayGridPlugin, listPlugin], // Include dayGrid and list plugins
      initialView: 'dayGridMonth',
      weekends: true,
      events: [
        { title: 'Event 1', start: '2024-03-01', end: '2024-03-01' },
        { title: 'Event 2', start: '2024-03-01', end: '2024-03-01' },
      ],
      headerToolbar: {
        left: 'prev,next, dayGridMonth, ListMonth',
        center: 'title',
        // right: 'dayGridMonth,ListMonth' // Include buttons for desired views
      },
      editable: true,
      eventResizableFromStart: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: 2,
      navLinks: true,
    };
    this.gettaskList();
    this.commonService.checkLoggedIn();
    this.loadStatusList();

    this.getcalendertask();
    this.initializeCalendar();
    this.getDateKeys();
  }
 
  timerform(taskId: any, checklisttask: any) {
    this.taskIds = taskId;
    this.selectedTimerTaskId = taskId;
  
    this.checklisttask = checklisttask || []; // Default to an empty array if undefined
    
    this.timerService.tasksidss(taskId);
  
    
  }

  submitForms(times: any) {
    const formData = new FormData();
    
    const information = this.timeupdate.value;  
     
    if (this.taskIdsForFile == undefined) {
      this.toastr.error('Please Select CheckList');
      return;
    }

    const matcids = this.checklisttask.find(
      (itemData: { id: any }) => itemData.id === this.taskIdsForFile
    );
    
    if (matcids.is_document == 'Document Required') {
      if (this.selectedImages == undefined) {
        this.toastr.error('Document Required');
        return
      }
     
    }

    if (
      times == '00:00:00' &&
      information.timerhour == '' &&
      information.timerminute == ''
    ) {
      this.toastr.error('Please start or enter time');
      return;
    }

    console.log(matcids.is_document);
    
    if (matcids.is_document == 'No Document Required') {
      information.checklist = this.datasinformation;
      formData.append('checklist', information.checklist);
    }
   
    if (matcids.is_document == 'Document Required') {
      information.files = this.datasinformation[0].fileUpload;
      formData.append('files', this.datasinformation[0].fileUpload);
    }

    if (information.completed == false) {
      this.toastr.error('Please Mark as Completed');
      return;
    }

    if (information.timerminute == '' || information.timerminute == null) {
      information.timerminute = '00';
    }

    if (information.timerhour == '' || information.timerhour == null) {
      information.timerhour = '00';
    }

    information.checklistids = this.taskIdsForFile;
    information.taskIds = this.selectedTimerTaskId;
    formData.append('checklistids', information.checklistids);
    formData.append('taskIds', information.taskIds);
    formData.append('completed', information.completed);
    formData.append('timerhour', information.timerhour);
    formData.append('timerminute', information.timerminute);
    formData.append('completedNote', information.completedNote);

    if (information.completed == false) {
      this.toastr.error('Please select the checkbox');
      return;
    }
    console.log('payload', information);

    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.stopTimer();

      information.actualtime = times;
      formData.append('actualtime', information.actualtime);
      this.http
        .post(`${this.apiUrl}taskCheckListCompleted`, formData, { headers })
        .subscribe(
          (response: any) => {
            if (response.status == true) {
              const elementToClick =
                this.elementRef.nativeElement.querySelector('#timeModalClose');
              if (elementToClick) {
                elementToClick.click();
              }
              this.toastr.success('Checklist successfully completed');
              this.taskIdsForFile = undefined;
              this.timeupdate.reset();
              this.datasinformation = [];
              this.selectedTimerTaskId = undefined;
              this.selectedImages = null;
              this.visible = !this.visible;
              this.gettaskList();
            }
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
  submitFormsonstop(times: any) {
    const information = this.timeupdate.value;

    if (!information.checkListID) {
      this.toastr.error('Please select the checklist');
      return;
    }

    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      information.actualtime = times;
      this.timerService.stopTimerforcompleted();

      this.http
        .post(`${this.apiUrl}checkListTrackTime`, information, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick =
                this.elementRef.nativeElement.querySelector('#timeModalClose');
              if (elementToClick) {
                elementToClick.click();
              }
              this.toastr.success('Checklist successfully completed');
            } else {
              this.toastr.error('Failed to complete the task');
            }
          },
          (error) => {
            console.error('Error fetching task list:', error);
            this.toastr.error('An error occurred while completing the task');
          }
        );
    } else {
      console.error('No token found in localStorage.');
      this.toastr.error('You are not authenticated. Please log in.');
    }
  }

  loadStatusList() {
    if (!localStorage.getItem('usercompanyId')) {
      return;
    }
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(
          `${this.apiUrl}statusList?companyID=` +
            localStorage.getItem('usercompanyId'),
          { headers }
        )
        .subscribe(
          (companylistData: any) => {
            this.statuslistDatas = companylistData;
            this.statuslists = companylistData?.data;
            this.toppingList1 = this.statuslistDatas.data.map(
              (item: { id: any; status: any }) => ({
                item_id: item.id,
                item_text: item.status,
              })
            );
            this.statuslistData = companylistData;
            this.statuslist = companylistData?.data;
          },
          (error) => {
            console.error('Error loading company list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  filterhtask() {
    this.taskListData = [];
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      const information = this.submitForm.value;
      const campaignOneValue = this.campaignOne.value;

      if (this.rangetype === undefined) {
        information.rangetyped = 1;
      } else {
        information.rangetyped = this.rangetype;
      }

      if (
        information.duedate !== true &&
        information.createddate !== true &&
        information.closeddate !== true
      ) {
        this.toastr.error('Select any date type');
        return;
      }

      // Extract the start and end date values from the campaignOne form group
      const rangeStart = campaignOneValue.rangestart;
      const rangeEnd = campaignOneValue.rangeend;

      if (rangeStart) {
        information.rangeStart = this.toUTC(rangeStart);
      }
      if (rangeEnd) {
        information.rangeEnd = this.toUTC(rangeEnd);
      }
      if (this.befordate) {
        information.befordate = this.toUTC(this.befordate);
      }
      if (this.ondate) {
        information.ondate = this.toUTC(this.ondate);
      }
      if (this.afterdate) {
        information.afterdate = this.toUTC(this.afterdate);
      }

      if (information.statusID !== '') {
        const selectedstatusIDIDs = information.statusID;
        this.commaSeparatedIDsstatus = selectedstatusIDIDs
          .map((item: { item_id: number; item_text: string }) => item.item_id)
          .join('');
        information.statusID = this.commaSeparatedIDsstatus;
      }
      this.spinner.show();

      information.companyID = localStorage.getItem('usercompanyId');

      this.http
        .post(`${this.apiUrl}taskList`, information, { headers })
        .subscribe(
          (response: any) => {
            this.taskListData = response?.data;
            this.addbutton = response.add;
            this.editbutton = response.edit;
            this.toggleOpened();
            this.toastr.success('filter data retrived');
            this.spinner.hide();
          },
          (error: any) => {
            this.spinner.hide();
            console.error('Error sending data', error);
          }
        )
        .add(() => (this.loading = false)); // Stop loader on completion (success or error)
    }
  }
  toUTC(date: Date): string {
    return new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();
  }

  toggleOpened() {
    this.opened = !this.opened;
  }

  onKeyPress(event: KeyboardEvent): void {
    // Check if the Enter key is pressed without the Shift key
    if (event.key === 'Enter' && !event.shiftKey) {
      // Prevent the default behavior of the Enter key
      event.preventDefault();

      // Call your function to submit the form
      this.commentontask(this.submitFormComment.value);
    }
  }

  getcalendertask() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      const body = { companyID: localStorage.getItem('usercompanyId') };

      this.http.post(`${this.apiUrl}taskListAll`, body, { headers }).subscribe(
        (response: any) => {
          this.taskListAll = response?.data;

          // Initialize eventscal as an empty array
          this.eventscal = [];

          // Populate eventscal with data from taskListAll
          this.eventscal = this.taskListAll.map((task: any) => {
            const date = new Date(task.starated_at);
            const year = date.getFullYear();
            const month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero if needed
            const day = ('0' + date.getDate()).slice(-2); // Add leading zero if needed

            const formattedDate = `${year}-${month}-${day}`;
            const dates = new Date(task.duedate);
            const years = dates.getFullYear();
            const months = ('0' + (dates.getMonth() + 1)).slice(-2); // Add leading zero if needed
            const days = ('0' + dates.getDate()).slice(-2); // Add leading zero if needed

            const formattedDateend = `${years}-${months}-${days}`;

            return {
              start: formattedDate,
              end: formattedDateend,
              title: task.title,
              // Add other properties as needed
            };
          });

          // Refresh the events array when data is available
          this.eventsCalendar = [...this.eventscal];
          this.initializeCalendar();
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

  ngAfterViewInit() {
    this.addEventListenersToButtons();
    this.calendarOptions = {
      plugins: [dayGridPlugin, listPlugin], // Include dayGrid and list plugins
      initialView: 'dayGridMonth',
      events: [
        // Sample events data
        { title: 'Event 1', start: '2024-03-01', allDay: true },
        { title: 'Event 2', start: '2024-03-05', allDay: true },
      ],
      headerToolbar: {
        left: 'prev,next,dayGridMonth,listMonth',
        center: 'title',
        // right: 'dayGridMonth,listMonth' // Include buttons for desired views
      },
      weekends: true,
      editable: true,
      eventResizableFromStart: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: 2,
      navLinks: true,
      eventDisplay: false,
      allDaySlot: false,
      displayEventTime: false,
    };
    this.initializeCalendar();
    // this.startIdleTimer();
  }

  addEventListenersToButtons() {
    // Select all status buttons
    const statusButtons = document.querySelectorAll('.status_btn');
  
    statusButtons.forEach((button: any) => {
      const taskId = button.getAttribute('data-task-id');
  
      // Attach click event to the status button
      this.renderer.listen(button, 'click', () => {
        // Use the taskId to get the specific status menu for this button
        const statusDiv = document.getElementById(`menu-${taskId}`) as HTMLElement;
        if (statusDiv) {
          // Toggle the display of the menu
          statusDiv.style.display = statusDiv.style.display === 'none' ? 'block' : 'none';
        }
      });
    });
  }
  

  checkstatusclosed(message: string) {
    this.toastr.error('Please Closed Task First.', 'Error',{
      timeOut: 2000,            // How long the toastr stays visible
      extendedTimeOut: 1000,    // Time toastr remains when mouse hovers over it
      closeButton: true,
      progressBar: true,
      tapToDismiss: true,
      easeTime: 100,      
    });
    return false;
  }
  checklistchecked(message: string){
    this.toastr.error('Please Complete All Checklist First.', 'Error',{
      timeOut: 2000,            // How long the toastr stays visible
      extendedTimeOut: 1000,    // Time toastr remains when mouse hovers over it
      closeButton: true,
      progressBar: true,
      tapToDismiss: true,
      easeTime: 100,      
    });
  }
  initializeCalendar() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, listPlugin], // Include dayGrid and list plugins
      initialView: 'dayGridMonth',
      weekends: true,
      events: this.eventsCalendar.map((event) => ({ ...event, allDay: true })), // Convert all events to all-day events
      headerToolbar: {
        left: 'prev,next,dayGridMonth',
        center: 'title',
        right: 'today,listMonth', // Include buttons for desired views
      },
      editable: true,
      eventResizableFromStart: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: 2,
      navLinks: true,
      eventDisplay: false,
      allDaySlot: false,
      displayEventTime: false,
    };
  }

  refresh = new Subject<void>();
  activeDayIsOpen: boolean = true;

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  gettaskList() {
    this.spinner.show();
    this.loading = true;
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      const body = { companyID: localStorage.getItem('usercompanyId') };

      this.http.post(`${this.apiUrl}myTaskList`, body, { headers }).subscribe(
        (response: any) => {
          this.taskListData = response?.data;
          this.rowData = this.taskListData.completedTaskData;
          this.pinListRowData = this.taskListData.pinTaskData;
          this.todayListRowData = this.taskListData.todayTaskData;
          this.overDueListRowData = this.taskListData.overDueTaskData;
          this.upcomingListRowData = this.taskListData.upcomingTaskData;
          this.addbutton = response.add;
          this.editbutton = response.edit;
          this.spinner.hide();
        
        },
        (error) => {
          this.spinner.hide();
          if (error.status === 401) {
            this.commonService.logout();
          }
          // Handle errors, for example, display an error message
          console.error('Error fetching task list:', error);
        }
      );
    } else {
      this.spinner.hide();
      console.error('No token found in localStorage.');
    }
  }

  getdocument(taskId: any) {
    this.spinner.show();  // Show loading spinner
    this.loading = true;
    const token = localStorage.getItem('tasklogintoken');
  
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
  
      // Make API call to fetch document list
      this.http.get(`${this.apiUrl}taskDocumentList?taskId=` + taskId, { headers }).subscribe(
        (response: any) => {
          this.documentList = response?.data || []; // Set document list
          this.spinner.hide();  // Hide spinner after data is fetched
          this.loading = false;
  
          // Check if the documentList is not empty
          if (this.documentList.length > 0) {
            // Dynamically add content to modal
            const modalBody = document.querySelector('#fileModals .modal-body');
            if (modalBody) {
              modalBody.innerHTML = '';  // Clear previous content
  
              // Add new document links to the modal
              this.documentList.forEach((documentObj: any) => {
                const div = document.createElement('div');
                const link = document.createElement('a');
  
                link.href = documentObj.document;
                link.target = '_blank';
                link.textContent = documentObj.name || 'View Document';
  
                div.appendChild(link);
                modalBody.appendChild(div);
              });
            }
  
            // Show the modal using plain JavaScript or Bootstrap
            const modalElement = document.getElementById('fileModals');
            if (modalElement) {
              const modal = this.bootstrap.Modal(modalElement);
              modal.show();  // Programmatically open the modal
            }
          } else{
          
            const modalBody = document.querySelector('#fileModalsDoc #fileDoc');
            if (modalBody) {
              modalBody.innerHTML = '';  // Clear previous content
  
              // Add new document links to the modal
                const div = document.createElement('div');
                const link = document.createElement('a');
  
                link.href = this.mainDocument;
                link.target = '_blank';
                link.textContent = 'View Document';
  
                div.appendChild(link);
                modalBody.appendChild(div);
              
            }
  
            // Show the modal using plain JavaScript or Bootstrap
            const modalElement = document.getElementById('fileModalsDoc');
            if (modalElement) {
              const modal = this.bootstrap.Modal(modalElement);
              modal.show();  // Programmatically open the modal
            }
          }
        },
        (error) => {
          this.spinner.hide();  // Hide spinner on error
          if (error.status === 401) {
            this.commonService.logout();  // Handle unauthorized access
          }
          console.error('Error fetching document list:', error);
        }
      );
    } else {
      this.spinner.hide();
      console.error('No token found in localStorage.');
    }
  }
  


  
  updatepinstatus(taskid: any, updatestatus: any) {
    const clickedValue = updatestatus;
    const taskId = taskid;
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const formData = new FormData();
      formData.append('taskID', taskId);
      formData.append('pin', clickedValue);

      this.http
        .post(`${this.apiUrl}taskPinUpdate`, formData, { headers })
        .subscribe(
          (response: any) => {
            if (response.status == true) {
              setTimeout(() => {
                this.toastr.success('Task Pin Status Updated Successfully.', 'Error',{
                  timeOut: 2000,            
                  extendedTimeOut: 1000,    
                  closeButton: true,
                  progressBar: true,
                  tapToDismiss: true,
                  easeTime: 100,      
                });
              }, 10);
              this.gettaskList();
              this.spinner.hide();
            }
          },
          (error: any) => {
            this.spinner.hide();
            console.error('Error sending data', error);
          }
        );
    }
  }
  getInitials(name: string): string {
    return name
      .split(' ')
      .map((name) => name.charAt(0))
      .join('');
  }

  taskPriorityUpdate(priority: any, taskid: any) {
    const clickedValue = priority;
    const taskId = taskid;
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const formData = new FormData();
      formData.append('taskID', taskId);
      formData.append('priority', clickedValue);

      this.http
        .post(`${this.apiUrl}taskPriorityUpdate`, formData, { headers })
        .subscribe(
          (response: any) => {
            setTimeout(() => {
              this.toastr.success('Task Priority Updated Successfully.');
            }, 10);
            this.gettaskList();
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        );
    }
  }

  deleteprojectsopendialogue(id: any) {
    this.selectedTaskId = id;
    const modal = document.getElementById('deleteprojectModal');
  }

  incompleteopendialogue(id: any) {
    this.selectedTaskId = id;
    const modal = document.getElementById('deleteprojectModal');
  }

  confirmDelete(): void {
    if (this.selectedTaskId) {
      this.deleteprojects(this.selectedTaskId);
      this.closeModal();
    }
  }
  closeModal() {
    const modalElement = document.getElementById('completeTaskModal');
    if (modalElement) {
      const modalInstance = this.bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  inconfirmDelete(): void {

    if (this.selectedTaskId) {
      this.indeleteprojects(this.selectedTaskId);
    }
  }

  openModal(taskId: number) {
    this.selectedTaskId = taskId;
    // Trigger the modal programmatically if needed
    const modalElement = document.getElementById('completeTaskModal');
    if (modalElement) {
      const modalInstance = new this.bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }
  openModalDelay(taskId: number) {
    this.delaytaskId = taskId;
    this.delayForm.patchValue({
      delaytask_id: this.delaytaskId
    });
    this.delayTaskList(this.delaytaskId);
    // Trigger the modal programmatically if needed
    const modalElement = document.getElementById('delayTaskModal');
    if (modalElement) {
      const modalInstance = new this.bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  deleteprojects(id: any) {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const projectID = { taskID: id, completed: 1 };

      this.http
        .post(`${this.apiUrl}taskCompleted`, projectID, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick =
                this.elementRef.nativeElement.querySelector(
                  '.popup_close_btn_delete_project'
                );
              if (elementToClick) {
                elementToClick.click();
              }
              setTimeout(() => {
                this.toastr.success('Task Completed Successfully.');
              }, 10);
              this.gettaskList();
            }
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        );
    }
  }

  indeleteprojects(id: any) {
    // this.loading = true; // Start loader
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const projectID = { taskID: id, completed: 0 };

      this.http
        .post(`${this.apiUrl}taskCompleted`, projectID, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick =
                this.elementRef.nativeElement.querySelector(
                  '.popup_close_btn_delete_project_in'
                );
              if (elementToClick) {
                elementToClick.click();
              }
              setTimeout(() => {
                this.toastr.success('Task InCompleted Successfully.');
              }, 10);
              this.gettaskList();
            }
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        );
    }
  }

  // voice chat 6-1-24

  // voice chat
  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  // * Start recording.*/
  initiateRecording() {
    this.recording = true;
    let mediaConstraints = {
      video: false,
      audio: true,
    };
    console.log(mediaConstraints);

    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }
  /**
   * Will be called automatically.
   */
  successCallback(stream: MediaStream) {
    var options = {
      mimeType: 'audio/wav' as
        | 'audio/wav'
        | 'audio/webm'
        | 'audio/webm;codecs=pcm',
      numberOfAudioChannels: 1 as 1 | 2 | undefined,
      sampleRate: 44100,
    };

    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;

    var recordOptions: RecordRTC.Options = {
      mimeType: options.mimeType,
      numberOfAudioChannels: options.numberOfAudioChannels,
      sampleRate: options.sampleRate,
    };

    this.record = new StereoAudioRecorder(stream, recordOptions);
    this.record.record();
  }
  /**
   * Stop recording.
   */
  stopRecording() {
    this.recording = false;
    if (this.record) {
      this.record.stop(this.processRecording.bind(this));
    } else {
      console.error('Record object is undefined. Unable to stop recording.');
    }
  }
  /**
   * processRecording Do what ever you want with blob
   * @param  {any} blob Blog
   */
  processRecording(blob: Blob | MediaSource) {
    if (blob instanceof Blob) {
      this.url = URL.createObjectURL(blob);

      const audioElement = document.createElement('audio');
      audioElement.controls = true;

      const sourceElement = document.createElement('source');
      sourceElement.type = 'audio/wav';

      sourceElement.src = this.url;
      const formData = new FormData();
      formData.append('comment', blob, 'recorded_audio.wav');
      formData.append('is_comment', 'audio');
      formData.append('task_id', this.edittaskid);
      this.commentontask(formData);
    }
  }
  /**
   * Process Error.
   */
  errorCallback(error: any) {
    this.error = 'Can not play audio in your browser';
  }
  // voice chat

  // voice chat
  commenttask(id: any) {
    this.submitFormComment.get('task_id')?.setValue(id);
    this.edittaskid = id;
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}taskCommentList?task_id=` + id, { headers })
        .subscribe(
          (response: any) => {
            this.taskCommentData = response?.data;
            this.taskCommenttitle = response?.taskTitle;
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

  getDateKeys(): string[] {
  if (this.taskCommentData) {
    return Object.keys(this.taskCommentData);
  } else {
    return []; // Return an empty array instead of a string
  }
}


  commentontask(formData: any) {
    this.loading = true;
    if (formData && formData.is_comment == null && formData.extension == null) {
      formData.is_comment = 'text';
    }

    const token = localStorage.getItem('tasklogintoken');
    if (!token) {
      console.log('No token found in localStorage.');
      return;
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    formData.task_id = this.edittaskid;
    if (formData) {
      this.http
        .post(`${this.apiUrl}taskComment`, formData, { headers })
        .subscribe(
          (response: any) => {
            this.submitFormComment.get('comment')?.setValue('');

            setTimeout(() => {
              this.toastr.success('Comment Added Successfully.');
            }, 10);
            this.taskCommentData = response.data;
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        )
        .add(() => (this.loading = false));
    } else {
      this.http
        .get(`${this.apiUrl}taskCommentList?task_id=` + this.edittaskid, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.submitFormComment.get('comment')?.setValue('');
            setTimeout(() => {
              this.toastr.success('Comment Added Successfully.');
            }, 10);
            this.taskCommentData = response.data;
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        )
        .add(() => (this.loading = false));
    }
  }
  uploadtaskcomment(event: any) {
    const file = (event.target as HTMLInputElement).files?.item(0);

    if (file) {
      const reader = new FileReader();

      const fileName = file.name;
      const fileExtension = fileName.split('.').pop();
      let filenamesends = fileName.split('/');
      let filenamesend = filenamesends[filenamesends.length - 1];

      let filenameParts = filenamesend.split('.');

      let filenamepost = filenameParts[0];

      reader.onload = (e) => {
        this.submitFormComment.get('comment')?.setValue(e.target?.result);
        this.submitFormComment.get('is_comment')?.setValue('file');
        this.submitFormComment.get('extension')?.setValue(fileExtension);
        this.submitFormComment.get('filename')?.setValue(filenamepost);
        this.submitFormComment.get('task_id')?.setValue(this.edittaskid);

        this.commentontask(this.submitFormComment.value);
        this.submitFormComment.reset();
      };

      // Read the file as Data URL (Base64)
      reader.readAsDataURL(file);
    }
  }

  getshortname() {
    const shortname = localStorage.getItem('username');
    return shortname
      ?.split(' ')
      .map((name) => name.charAt(0))
      .join('');
  }

  generateCommentStructure(text: string): void {
    const commentId = 'comment_' + Math.random().toString(36).substring(7);

    // Create the comment structure
    const commentElement = document.createElement('div');
    commentElement.className = 'comment me';
    commentElement.id = commentId;

    const shortNameElement = document.createElement('div');
    shortNameElement.className = 'user_short_name';
    shortNameElement.textContent = this.getshortname() ?? 'DefaultShortName'; // Use a default value if getshortname() is undefined

    const bubbleElement = document.createElement('div');
    bubbleElement.className = 'bubble';
    bubbleElement.textContent = text;

    commentElement.appendChild(shortNameElement);
    commentElement.appendChild(bubbleElement);

    // Append the comment structure to the parent element
    const parentElement = document.getElementById('appendtext');
    if (parentElement) {
      parentElement.appendChild(commentElement);
    }
  }

  // You can call other functions of the TimerService as needed in your component methods
  pauseTimer() {
    this.timerService.pauseTimer();
  }

  resumeTimer() {
    this.timerService.resumeTimer();
  }

  stopTimer() {
    this.timerService.stopTimer();
  }

  startTimer() {
    // if (this.timeupdate.value.checkListID == '') {
    //   this.toastr.error('Please Select First Checklist');
    //   return
    // }
    this.timerService.startTimer();
  }

  subTaskDelete(index: number): void {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const subTaskID = { subTaskID: index };

      this.http
        .post(`${this.apiUrl}subTaskDelete`, subTaskID, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
            }
          },
          (error: any) => {
            this.spinner.hide();
            console.error('Error sending data', error);
          }
        );
    }
  }

  setsubtask(subtask: any) {
    this.subTaskList = subtask;
  }

  deleteprojectsopendialoguesubtask(id: any) {
    this.selectedsubTaskId = id;
    const modal = document.getElementById('deleteprojectModalsubtask');
  }

  confirmDeletesubtask(): void {
    if (this.selectedsubTaskId) {
      this.deleteprojectssubtask(this.selectedsubTaskId);
    }
  }

  deleteprojectssubtask(id: any) {
    // this.loading = true; // Start loader
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const projectID = { subTaskID: id, completed: 1 };

      this.http
        .post(`${this.apiUrl}subTaskCompleted`, projectID, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick =
                this.elementRef.nativeElement.querySelector(
                  '.popup_close_btn_delete_project'
                );
              if (elementToClick) {
                elementToClick.click();
              }
              setTimeout(() => {
                this.toastr.success('Sub Task Completed Successfully.');
              }, 10);
              location.reload();
            }
          },
          (error: any) => {
            console.error('Error sending data', error);
          }
        );
      // .add(() => (this.loading = false));
    }
  }

  chekListsGet(ids: any) {
    this.taskIdsForFile = ids;
    if (this.selectedCheckbox === ids) {
      // If the same checkbox is clicked, uncheck it
      this.selectedCheckbox = null;
    }else{
      this.selectedCheckbox = ids;
    }
    // if (this.selectedCheckbox === ids) {
    //   this.selectedCheckbox = null;
    // } else {
    //   this.selectedCheckbox = ids;
    // }
    this.checkListSelectedId = ids;
    // if (this.taskIdsForFile == undefined) {
      
    //   const matcids = this.checklisttask.find(
    //     (itemData: { id: any }) => itemData.id === ids
    //   );
    //   if (matcids.is_document == 'Document Required') {
    //     if (this.selectedImages == undefined) {
    //       this.toastr.error('Document Required');
    //     }
    //   } else if (matcids.is_document !== 'Document Required') {
    //     this.documentRequired = 1;
    //     this.taskIdsForFile = ids;
    //     this.datasinformation.push({
    //       tskId: this.selectedTimerTaskId,
    //       fileUpload: '',
    //       checkListId: ids,
    //     });
    //   }
    // }
  }

  onFileChange(event: any, ids: any) {
    this.documentRequired = 1;
    if (this.checkListSelectedId == undefined) {
      this.toastr.error('Please Select CheckList');
      return;
    }

    if (this.checkListSelectedId !== ids) {
      this.toastr.error('Upload Document For Selected CheckList');
      return;
    }

    this.taskIdsForFile = ids;
    if (!event) {
      this.selectedImages = null;
      this.previewfile = null;
      this.selctedfiletype = null;
      this.selctedfilename = null;
      return;
    }
    this.progress = 0;
    this.isUploading = true;
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const file: File = files[0];
      if (file.type.startsWith('image/')) {
        this.selectedImages = file;
        this.previewfile = URL.createObjectURL(file);
        this.selctedfiletype = 'image';
      } else {
        this.selectedImages = file;
        this.selctedfiletype = 'file';
        this.selctedfilename = this.selectedImages.name;
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          this.previewfile = e.target.result;
        };
        reader.readAsDataURL(file);
      }
      if (file.size > 15 * 1024 * 1024) {
        this.toastr.error('File size exceeds the limit of 15 MB.');
        (event.target as HTMLInputElement).value = '';
        this.selectedImages = null;
        this.previewfile = null;
        this.selctedfiletype = null;
      }
    }
    const img = this.selectedImages;
    this.documentRequired = 1;
    this.checkboxCompleted.push({
      checklistidcp: ids,
      fileUpload: img,
      checkListIdcm: 0,
    });
    // const datasinformation = { tskId: AnalyserNode, fileUpload: AnalyserNode, checkListId: AnalyserNode};
    this.datasinformation.push({
      tskId: this.selectedTimerTaskId,
      fileUpload: img,
      checkListId: ids,
    });
  }

  getcompanyuser() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(
          `${this.apiUrl}userMemberList?companyID=` +
            localStorage.getItem('usercompanyId'),
          {
            headers,
          }
        )
        .subscribe(
          (clientslistData: any) => {
            this.memberlistData = clientslistData?.data.map(
              (item: { id: any; name: any }) => ({
                item_id: item.id,
                item_text: item.name,
              })
            );
          },
          (error) => {}
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  DelayFormSubmit(information: any){
    this.spinner.show();
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .post(`${this.apiUrl}delayTaskAdd`, information, { headers })
        .subscribe(
          (response: any) => {
            if (response.status == true) {
              this.toastr.success('Delay Set Successfully.');
              this.delayTaskList(this.delaytaskId);
              this.delayForm.reset();
              this.spinner.hide();
            }
          },
          (error: any) => {
            this.spinner.hide();
            console.error('Error sending data', error);
          }
        );
    }
    
  }

  delayTaskList(taskid:any){
      this.spinner.show();
      const token = localStorage.getItem('tasklogintoken');
      if (token) {
        const headers = new HttpHeaders()
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json');
        this.http
          .get(`${this.apiUrl}delayTaskList?delaytask_id=` + taskid, {
            headers,
          })
          .subscribe(
            (clientslistData: any) => {
              this.delaytasklist = clientslistData?.data;
              this.reasonInput.nativeElement.click();
              this.spinner.hide();
            },
            (error) => {}
          );
      } else {
        this.spinner.hide();
        console.log('No token found in localStorage.');
      }
    
  }

  deletetaskAPI(taskId:any){
    this.spinner.show();
    const token = localStorage.getItem('tasklogintoken');
    let information = {'taskID':taskId};
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .post(`${this.apiUrl}taskDelete`,information, { headers })
        .subscribe(
          (response: any) => {
            if (response.status == true) {
              this.toastr.success('Task Deleted Successfully.');
              this.spinner.hide();
              this.gettaskList();
            }
          },
          (error: any) => {
            this.spinner.hide();
            console.error('Error sending data', error);
          }
        );
    }
  }
}
