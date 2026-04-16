import { NgFor, NgIf, CommonModule  } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import {
  FormControl, ReactiveFormsModule, FormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommonService } from '../service/common.service';
import { event, param } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
  standalone: true,
  imports: [ CommonModule,MatNativeDateModule, NgSelectModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule, MatSlideToggleModule, MatTabsModule, AgGridAngular, NgIf, FormsModule, ReactiveFormsModule],
})
export class WorkflowComponent {
  D: any;
  user:any
  checkListID:any;
  public columnDefs: ColDef[] = [
    {
      editable:false,
      headerName: 'Action',
      field: '',
      width:100,
      cellRenderer: (params: any) => {
        const checkListID = params.data.checklist_id;
        
        const img = document.createElement('img');
        img.src = '../../../assets/img/dashboard/Forward_task.svg';
        img.alt = '';
        img.style.cursor = 'pointer';
        img.setAttribute('data-bs-toggle', 'modal');
        img.setAttribute('data-bs-target', '#completeTaskModal');

        // Add event listener to trigger modal programmatically
        img.addEventListener('click', () => {
          this.openModal(checkListID);
        });
    
        return img;
      },
     
    },  
    {
      editable: false,
      headerName: 'Priority',
      field: 'priority',
      width:100,
      cellRenderer: (params: any) => {
        const eDiv = document.createElement('div');
        const priority: number | undefined = params.data?.priority; // Ensure priority is typed
    
        if (priority !== undefined) {
          // Define the type for the flag map
          const flagMap: { [key: number]: string } = {
            0: 'flag-G.svg',
            1: 'flag-R.svg',
            2: 'flag-Y.svg',
          };
    
          const flagImageSrc = flagMap[priority] || 'default-flag.png'; // Safely index the map
    
          // Create the image element
          eDiv.innerHTML = `
            <div class="priority_wrapper">
              <img src="../../../assets/img/dashboard/${flagImageSrc}" alt="Priority Flag" style="width: 20px; height: 20px;" />
            </div>
          `;
        } else {
          eDiv.innerHTML = `<span>No priority data available</span>`;
        }
    
        return eDiv;
      },
     
    },    
    {
      field: "clientName", headerName: 'Client Name',
    },
    {
      field: "description", headerName: 'Task Title',
    },
    {
      field: "checklist_name", headerName: 'Checklist',
    },
    {
      field: "targetTime",
      headerName: "Target Time",
      width:100,
      valueGetter: (params: any) => {
        const targetHour = params.data?.targetHour ?? '00'; // Fallback to '00' if undefined
        const targetMinute = params.data?.targetminute ?? '00'; // Fallback to '00' if undefined
        return `${targetHour}:${targetMinute}`;
      },
     
    },
    { field: "user_hour", headerName: 'Hour',width:100, },
    { field: "user_minute", headerName: 'Minutes', width:100, },
    {
      field: "checklist_document", headerName: 'Document',   
      cellRenderer: (params: any) => this.uploaddocument(params),
      
      editable: false
    },
    {
      field: "completed",
      headerName: 'Completed',
      cellRenderer: this.checkboxCellRenderer,
     
     
    },
  ];
  public rowData: any[] = [];  

  public defaultColDef: ColDef = {
    editable: true,
    filter: true,
  };

  public themeClass = 'ag-theme-quartz';
  pendingtask:any;
  username:any;
  CurrentDate:any;
  memberlistData:any;
  team1:any;
  img:any;
  lotsOfTabs: string[] = [];
  isowner:any;
  selectedImages:any;
  isdisabled: boolean = true;
  isdocuploade: boolean = false;
  loggedInUserId:any;
  filteredTeam1: Array<{ item_id: number; item_text: string }> = [];
  private apiUrl = environment.ApiUrl;
  bootstrap: any;
  constructor(private http: HttpClient,private commonService: CommonService,  private toastr: ToastrService,private router:Router) {
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
    this.getpendingTask();
    this.getmemberlist();
    this.username = localStorage.getItem('username');
    this.isowner = localStorage.getItem('ownerChceck');
    this.loggedInUserId =localStorage.getItem('userid')
    this.CurrentDate = new Date();
  }

  today: number = Date.now();

getpendingTask(){
  
  const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(`${this.apiUrl}workPendingTaskList?companyID=` + localStorage.getItem('usercompanyId'), { headers })
        .subscribe(
          (companylistData: any) => {
            this.rowData = companylistData.data;
           
          },
          (error) => {
            if (error.status === 401) {
              this.commonService.logout();
            }
            console.error('Error loading company list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
}

checkboxCellRenderer(params: any) {
  const eDiv = document.createElement('div');
  const allFieldsFilled = params.data?.user_hour && params.data?.user_minute;

    eDiv.innerHTML = `
    <input type="checkbox" class="status-checkbox" ${params.value ? 'checked' : ''} 
    ${!allFieldsFilled ? 'disabled="isdisabled"' : ''} />
    `;
  const checkbox = eDiv.querySelector('.status-checkbox') as HTMLInputElement;
  checkbox.addEventListener('change', () => {
    params.node.setDataValue('completed', checkbox.checked);
  });
  return eDiv;
}


workPendingTaskListOwner(userid:any){
  const information = userid;
  const token = localStorage.getItem('tasklogintoken');
  information.userId = information.item_id;
  this.username = userid.item_text;
  if (token) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    this.http
      .post(`${this.apiUrl}workPendingTaskListOwner`,
        information,
        { headers }
      )
      .subscribe(
        (response: any) => {
          if (response.status === true) {
            this.rowData = response.data;
           
          }else{
            this.rowData = [];
          }
        },
        (error: any) => {
          console.error('Error sending data', error);
        }
      );
  }

}
  formData = { date: '', time: '', checklist: '' };
  tableData: Array<{ date: string, time: string, checklist: string }> = [];

  onCellValueChanged(event: any) {
    // this.saveRowData(event.data); // Save updated row data
    const token = localStorage.getItem('tasklogintoken');
    const information = event.data;
  
    
    const formData = new FormData();
    formData.append('checklistids', information.checklist_id);
    formData.append('taskIds', information.task_id);
    if(information.completed != undefined){
      formData.append('completed', information.completed);
    }else{
      formData.append('completed', 'false');
    }
   
    if(information.user_hour != undefined){
      formData.append('timerhour', information.user_hour);
    }else{
      formData.append('timerhour', '00');
    }
    if(information.user_minute != undefined){
      formData.append('timerminute', information.user_minute);
    }else{
      formData.append('timerminute', '00');
    }
    formData.append('actualtime', '00:00:00');
   
  if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .post(`${this.apiUrl}workSheetUpdate`, formData, { headers })
        .subscribe(
          (response: any) => {
            if (response.status == true) {
              this.checkboxCellRenderer(information);
              if(information.user_hour != '' && information.user_minute != '' && information.checklist_document != 'Document Required'){
                this.isdisabled = false;
                event.api.redrawRows();
              }
              this.getpendingTask();
              this.toastr.success(response.message)
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


  
  uploaddocument(params: any) {
    const eDiv = document.createElement('div');
   
    if (params.data.checklist_document === 'Document Required') {
      this.isdisabled =true;
      // Create the file upload element
      eDiv.innerHTML = `
        <div title="Files">
          <img 
            src="../../../assets/img/dashboard/file-icon.png" 
            alt="Upload Document" 
            class="file-icon"
            required
            style="cursor: pointer;" 
          />
          <input 
            type="file" 
            style="display: none;" 
            class="hidden-file-input" 
          />
        </div>
      `;
  
      // Add click event to the file icon
      const fileIcon = eDiv.querySelector('.file-icon') as HTMLImageElement;
      const fileInput = eDiv.querySelector('.hidden-file-input') as HTMLInputElement;
  
      fileIcon?.addEventListener('click', () => {
        fileInput.click();
      });
  
      // Handle file input change
      fileInput?.addEventListener('change', (event) => {
        this.onFileChange(event, params.data.checklist_id);
      });
    } else {
      // Create a disabled field representation
      eDiv.innerHTML = `
        <div title="No File Required" style="color: grey; text-align: center; pointer-events: none; user-select: none" disabled readonly>
        No Document Required
        </div>
      `;
    }
  
    return eDiv;
  }
  
  onFileChange(event: any, id: any) {
    const files: FileList = event.target.files;
    const inputElement = event.target as HTMLInputElement;
    this.img = inputElement.files?.item(0);
    // File validation: Check size (15 MB limit)
    if (this.img.size > 15 * 1024 * 1024) {
      this.toastr.error('File size exceeds the limit of 15 MB.');
      (event.target as HTMLInputElement).value = ''; // Reset the input field
      return;
    }
    const formData = new FormData();
    formData.append('checklistids', id);
    formData.append('files', this.img);
  
  
    // Token validation
    const token = localStorage.getItem('tasklogintoken');
    if (!token) {
      this.toastr.error('Session expired. Please log in again.');
      return;
    }
  
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
  
    this.http.post(`${this.apiUrl}workListFileUpload`, formData, { headers }).subscribe(
      (response: any) => {
        console.log(response.message);
        
        // this.toastr.success(response.message);
        this.toastr.success(response.message, 'Error',{
          timeOut: 2000,           
          extendedTimeOut: 1000,  
          closeButton: true,
          progressBar: true,
          tapToDismiss: true,
          easeTime: 100,      
        });
        // setTimeout(() => {
        //   window.location.reload();
        // }, 3000);
      });
  }
  
  
  openModal(taskId: number) {
    this.checkListID = taskId;
    const modalElement = document.getElementById('completeTaskModal');
    if (modalElement) {
      const modalInstance = new this.bootstrap.Modal(modalElement);
      modalInstance.show();
    }
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
              (item: { id: any; name: any; }) => ({
                item_id: item.id,
                item_text: item.name,
              })
            );
            this.filteredTeam1 = this.team1.filter((user: { item_id: any; item_text: any; }) => user.item_id != this.loggedInUserId);
           },
          (error) => {}
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }
  
  updateassignes(event:any){
   
    const token = localStorage.getItem('tasklogintoken');
    const formData = new FormData();
    formData.append('memberID', event.item_id);
    formData.append('checkListID', this.checkListID);
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .post(`${this.apiUrl}forwardTaskAssign`, formData, { headers })
        .subscribe(
          (response: any) => {
            if (response.status == true) {
              this.getpendingTask();
              this.toastr.success(response.message)
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

}
