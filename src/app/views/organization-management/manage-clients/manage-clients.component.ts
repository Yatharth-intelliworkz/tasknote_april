import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../service/common.service';
import { ExcelService } from '../../service/excel.service';

import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import * as XLSX from 'xlsx'; // Import xlsx library
import { NgxPaginationModule } from 'ngx-pagination';
import { id } from 'date-fns/locale';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-manage-clients',
  templateUrl: './manage-clients.component.html',
  styleUrls: ['./manage-clients.component.scss']
})
export class ManageClientsComponent {
  @ViewChild('fileInput')
  fileInput!: ElementRef;
  @ViewChild('name', { static: false }) name!: ElementRef;
  clientslistDataEdit: any;
  clientlistedit:any;
  clientslistData: any;
  clientlist: any;
  clientPartnerdataList: any;
  editclientslistData: any;
  companyId: any;
  setting: any;
  clientcode: any;
  ownerChceck:any;
  selectedImage: File | null = null;
  selectedEditImage: File | null = null;
  clientslistedit: any = {
    company_name: null,
    contact_person_name: null,
    phone_no: null,
    email: null,
    address: null,
    gender: null,
    clientId: null,
    reference_by: null,
    is_active: null,
    client_code: null,
    type:null,
    pan_no:null,
    name:null,
    gst_no:null
  };

  editForm = new FormGroup({
    company_name: new FormControl('', [Validators.required]),
    contact_person_name: new FormControl('', [Validators.required]),
    phone_no: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    // gender: new FormControl('', [Validators.required]),
    clientId: new FormControl(null), // Note: Assuming noteID is a number
    reference_by: new FormControl(null), 
    is_active: new FormControl(null), 
    client_code: new FormControl(null), 
    type: new FormControl(null), 
    pan_no:new FormControl(''),
    name:new FormControl(),
    gst_no:new FormControl('')
  });
  submitForm: any;
  
  selectedClientId: any;
  settingsForm = new FormGroup({
    gst: new FormControl(false),
    pan: new FormControl(false),
    group: new FormControl(false)
  });

    // new table

    public columnDefs: ColDef[] = [
      { field: 'name', headerName: 'Name' },
      { field: 'client_code', headerName: 'Client Code' },
      { field: 'email', headerName: 'Email' },
      { field: 'phone_no', headerName: 'Phone' },
      { field: 'address', headerName: 'Address' },
      { field: 'refernce_by', headerName: 'Refernce By' },
      { field: 'is_active', headerName: 'Status' },
      { field: 'contact_person_name', headerName: 'Contact Person' },
      
      {
      cellRenderer: (params: any) => {
        const taskId = params.data.id;
        const editPermission = params.data.userpermission?.edit !== 0;
        const deletePermission = params.data.userpermission?.delete !== 0;
    
        // Create a container div to hold the icons
        const container = document.createElement('div');
        container.className = 'd-flex align-items-center pt-2'; // Add some alignment styles if needed
    
        // Check and create the edit icon element if permission is allowed
        if (editPermission) {
            const editIcon = document.createElement('img');
            editIcon.src = '../../../assets/img/dashboard/table-edit-icon.svg';
            editIcon.alt = 'Edit';
            editIcon.className = 'me-3'; // Bootstrap margin class
            editIcon.style.cursor = 'pointer'; // Add cursor pointer style
            editIcon.setAttribute('data-bs-toggle', 'modal');
            editIcon.setAttribute('data-bs-target', '#editClientModal');
    
            // Add click event listener for edit action
            editIcon.addEventListener('click', () => {
               this.editclients(taskId);
            });
    
            container.appendChild(editIcon); // Append to container
        }
    
        // Check and create the delete icon element if permission is allowed
        if (deletePermission) {
            const deleteIcon = document.createElement('img');
            deleteIcon.src = '../../../assets/img/dashboard/table-delete-icon.svg';
            deleteIcon.alt = 'Delete';
            deleteIcon.style.cursor = 'pointer'; // Add cursor pointer style
            deleteIcon.setAttribute('data-bs-toggle', 'modal');
            deleteIcon.setAttribute('data-bs-target', '#deleteclientsModal');
    
            // Add click event listener for delete action
            deleteIcon.addEventListener('click', () => {
                this.deleteClientopendialogue(taskId);
            });
    
            container.appendChild(deleteIcon); // Append to container
        }
    
        // Check if the container is empty, if so, add a placeholder or return null
        if (container.childElementCount === 0) {
            container.innerHTML = '<span>No Actions Available</span>';
        }
    
        return container; // Return the container with icons
      },
      headerName: 'Action',
      },
    
    ];
  
    public clientRowData: any[] = [];
  
    public defaultColDef: ColDef = {
      editable: false,
      filter: "agTextColumnFilter",
      floatingFilter: true,
    };
    public themeClass: string = 'ag-theme-quartz';
  
    pagination = true;
    paginationPageSize = 20;
    paginationPageSizeSelector = [20, 50, 100];
    // new table
    getInitials(name: string): string {
      return name
        .split(' ')
        .map((name) => name.charAt(0))
        .join('');
    }


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private commonService: CommonService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService
  ) {
   
  }
  private apiUrl = environment.ApiUrl;
  settings: { gst: boolean; pan: boolean; group: boolean } = {
    gst: false,
    pan: false,
    group: false
  };

  checkBoxStates: { gst: boolean; pan: boolean; group: boolean } = {
    gst: false,
    pan: false,
    group: false
  };

  ngOnInit(): void {
    this.ownerChceck = localStorage.getItem('ownerChceck');
    this.route.paramMap.subscribe(params => {
      this.companyId = params.get('id');
      this.ClientList();
      this.clientPartnerList();
       
      this.commonService.checkLoggedIn();
    });
    this.clientSettingGet();
    this.getClientCode();
  }

  ClientList() {
    this.spinner.show();
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}clientList?companyID=` + this.companyId, {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.clientslistData = clientslistData;
            this.clientlist = this.clientslistData?.data;
            this.clientRowData = this.clientslistData?.data;

            // console.log(this.clientlist);

            this.spinner.hide();
          },
          (error) => { }
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }
  clientPartnerList() {
    this.spinner.show();
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}clientPartnerList?companyID=` + this.companyId, {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.clientslistData = clientslistData;
            this.clientPartnerdataList = this.clientslistData?.data;
            // console.log(this.clientPartnerdataList);

            this.spinner.hide();
          },
          (error) => { }
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }

  onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.item(0);
    if (file) {
      this.selectedImage = file;
    }
  }

  insertclient(submitForm: NgForm): void {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
  
      const formData = new FormData();
  
      // Append image if it exists
      if (this.selectedImage) {
        formData.append('profile', this.selectedImage);
      }
  
      const information: any = submitForm.value;
      information.companyId = this.companyId;
  
      // Append form data to FormData
      Object.keys(information).forEach((key) => {
        formData.append(key, information[key]);
      });


      this.http.post(`${this.apiUrl}clientAdd`, formData, { headers })
        .subscribe(
          (response: any) => {
            if (response.status) {
              this.toastr.success('Client Added Successfully.');
              location.reload();
              this.ClientList();
            }
          },
          (error: any) => {
            this.spinner.hide();
            this.toastr.error('Failed to add client. Please try again.');
            console.error('Error sending data', error);
          }
        );
    }
  }
  

  ClientListEdit() {
    this.spinner.show();
    const token = localStorage.getItem('tasklogintoken');
  
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
  
      this.http.get(`${this.apiUrl}clientList?companyID=${this.companyId}`, { headers })
        .subscribe(
          (clientslistData: any) => {
            this.clientslistDataEdit = clientslistData;
            this.clientlistedit = this.clientslistDataEdit?.data || []; // Ensure it's initialized as an array
           
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
            console.error('Error loading client list:', error); // Log any errors
          }
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }
  
  editclients(id: number) {
    this.spinner.show();
    const token = localStorage.getItem('tasklogintoken');
  
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
  
      this.http.get(`${this.apiUrl}clientGet?clientId=${id}`, { headers })
        .subscribe(
          (editclientslistData: any) => {
            this.spinner.hide();
            this.editclientslistData = editclientslistData;
            this.clientslistedit = this.editclientslistData?.data; // Ensure this is set to existing data
            this.name.nativeElement.click();
            this.editForm.patchValue({
              client_code: this.clientslistedit.client_code,
              name: this.clientslistedit.name,
              is_active: this.clientslistedit.is_active,
              type: this.clientslistedit.type,
              pan_no: this.clientslistedit.pan_no,
              gst_no: this.clientslistedit.gst_no,
              reference_by: this.clientslistedit.refernce_by,
              company_name: this.clientslistedit.company_name,
              phone_no: this.clientslistedit.phone_no,
              email: this.clientslistedit.email,
              contact_person_name: this.clientslistedit.contact_person_name,
              address: this.clientslistedit.address,
              clientId: this.clientslistedit.id
            });
            
            const idToRemove = id;
          },
          (error) => {
            this.spinner.hide();
            console.error('Error fetching client data:', error); // Log any errors
          }
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }
  

  onEditFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.item(0);
    if (file) {
      this.selectedEditImage = file;
    }
  }

  updateclient(): void {

    if (this.editForm.invalid) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    if (this.editForm.invalid) {
      // Form is invalid, show error messages
      this.editForm.markAllAsTouched();
      return;
    }

    const token = localStorage.getItem('tasklogintoken');
    if (!token) {
      console.log('No token found in localStorage.');
      return;
    }
    this.spinner.show();

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    const formData = new FormData();
    formData.append('profile', this.selectedImage!);

    const information: any = this.editForm.value; // Explicitly cast to 'any'

    Object.keys(information).forEach((key) => {
      formData.append(key, information[key]);
    });


    this.http.post(`${this.apiUrl}clientEdit`, formData, { headers }).subscribe(
      (response: any) => {
        if (response.status === true) {
          const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_edit');
          if (elementToClick) {
            elementToClick.click();
          }
          this.toastr.success('Clients Edited Successfully.');
          this.ClientList();
          this.spinner.hide();
          // Do not dismiss the modal here
        }
      },
      (error: any) => {
        this.spinner.hide();
        console.error('Error sending data', error);
      }
    );
  }

  deleteClientopendialogue(id: any) {
    this.selectedClientId = id;
    const modal = document.getElementById('deleteprojectModal');
  }

  confirmDelete(): void {
    if (this.selectedClientId) {
      this.deleteclients(this.selectedClientId);
    }
  }

  deleteclients(id: any) {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const clientId = { clientId: id };

      this.http
        .post(`${this.apiUrl}clientDelete`,
          clientId,
          { headers }
        )
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_delete_clients');
              if (elementToClick) {
                elementToClick.click();
              }
              setTimeout(() => {
                this.toastr.success('Client Deleted Successfully.');
              }, 10);
              this.ClientList();
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

  // code for export data on 20-06-24 by jeet thaker

  generateexcelfile() {
    const workbook = XLSX.utils.book_new();

    // Format the data into a structure that can be easily processed
    const formattedData = this.formatData();

    // Add a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Client Export');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Convert buffer to blob
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a download link
    const url = window.URL.createObjectURL(blob);

    // Trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ClientExport.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  formatData(): any[] {
    const formattedData: any = [];
    this.clientlist.forEach((user: { id: any; name: any; address: any; company_name: any; email: any; gender: any; phone_no: any; }) => {
      formattedData.push({
        id: user.id,
        name: user.name,
        address: user.address,
        company_name: user.company_name,
        email: user.email,
        gender: user.gender === 0 ? 'Male' : user.gender === 1 ? 'Female' : 'unknown',
        phone_no: user.phone_no,
      });
    });
    return formattedData;
  }
  triggerFileInputClick() {
    this.fileInput.nativeElement.click();
  }
  onFileChangeofimport(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const file = target.files[0];

    this.excelService.readExcel(file).subscribe(data => {
      const formattedData = data.map(user => ({
        Name: user.name,
        Address: user.address,
        Company: user.company_name,
        email: user.email,
        gender: user.gender,
        phone_no: user.phone_no,
      }));

      // Send the formatted data using API
      this.excelService.sendData(formattedData, this.companyId).subscribe(response => {
        console.log('Data sent successfully:', response);
      }, error => {
        console.error('Error sending data:', error);
      });
    }, error => {
      console.error('Error reading Excel file:', error);
    });
  }
  filterItems(event: Event) {
    // Cast the event to InputEvent
   const inputEvent = event as InputEvent;
   const inputElement = inputEvent.target as HTMLInputElement;
   const searchTerm = inputElement.value.toLowerCase(); // Convert to lower case for case-insensitive search

    if (!searchTerm) {
      this.ClientList(); // Return all projects if search term is empty
    } else {
      this.clientlist = this.clientlist.filter((project: any) =>
       (project.name?.toLowerCase().includes(searchTerm) ||
        project.company_name?.toLowerCase().includes(searchTerm) ||
        project.email?.toLowerCase().includes(searchTerm) ||
        project.client_code?.toLowerCase().includes(searchTerm) ||
        project.phone_no?.toLowerCase().includes(searchTerm))
      );
    }
  }
  
  // Function to submit all settings at once (on button click)
  onSubmit() {
    if (this.settingsForm.invalid) {
      return;
    }

    const token = localStorage.getItem('tasklogintoken');
    if (!token) {
      console.log('No token found in localStorage.');
      return;
    }

    this.spinner.show();

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    // Send the form data (checkbox states) to the server
    this.http
      .post(
        `${this.apiUrl}clientSettingUpdate?companyId=${this.companyId}`,
        this.settingsForm.value,
        { headers }
      )
      .subscribe(
        (response: any) => {
          if (response.status === true) {
            this.clientSettingGet(); // Reload settings after successful update
            this.toastr.success('Settings updated successfully.');
          }
          this.spinner.hide();
        },
        (error: any) => {
          this.spinner.hide();
          console.error('Error updating settings:', error);
        }
      );
  }

 
  // Fetch the client settings from the server
  clientSettingGet() {
    const token = localStorage.getItem('tasklogintoken');
    if (!token) {
      console.log('No token found in localStorage.');
      return;
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    this.spinner.show();

    this.http
      .get(`${this.apiUrl}clientSettingGet?companyId=${this.companyId}`, {
        headers,
      })
      .subscribe(
        (response: any) => {
          if (response?.data) {
            this.setting =  response.data;
          }
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          console.error('Error fetching client settings:', error);
        }
      );
  }

  
  getClientCode() {
    const token = localStorage.getItem('tasklogintoken');
    if (!token) {
      console.log('No token found in localStorage.');
      return;
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    this.spinner.show();

    this.http
      .get(`${this.apiUrl}clientCodeGet?companyId=${this.companyId}`, {
        headers,
      })
      .subscribe(
        (response: any) => {
           this.clientcode =  response.isCode;
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          console.error('Error fetching client settings:', error);
        }
      );
  }

  
}
