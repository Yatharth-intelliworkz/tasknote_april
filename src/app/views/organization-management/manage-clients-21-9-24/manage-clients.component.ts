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

@Component({
  selector: 'app-manage-clients',
  templateUrl: './manage-clients.component.html',
  styleUrls: ['./manage-clients.component.scss']
})
export class ManageClientsComponent {
  @ViewChild('fileInput')
  fileInput!: ElementRef;
  clientslistDataEdit: any;
  clientlistedit:any;
  clientslistData: any;
  clientlist: any;
  clientPartnerdataList: any;
  editclientslistData: any;
  companyId: any;
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
    type:null
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
  });
  submitForm: any;
  selectedClientId: any;

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


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.companyId = params.get('id');
      this.ClientList();
      this.clientPartnerList();
      this.commonService.checkLoggedIn();
    });
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
      this.http
        .get(`${this.apiUrl}clientList?companyID=` + this.companyId, {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.clientslistDataEdit = clientslistData;
            this.clientlistedit = this.clientslistDataEdit?.data;
            this.spinner.hide();
          },
          (error) => { }
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }


  editclients(id: number) {
    this.ClientListEdit();
    this.spinner.show();
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Accept', 'application/json');
      this.http.get(`${this.apiUrl}clientGet?clientId=` + id, { headers }).subscribe(
        (editclientslistData: any) => {
          this.editclientslistData = editclientslistData;
          this.clientslistedit = this.editclientslistData?.data;
          const idToRemove = id;
          this.clientlistedit = this.clientlistedit.filter((item: { id: number; }) => item.id !== idToRemove);
          this.spinner.hide();
          
        },
        (error) => {
          this.spinner.hide();
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
}
