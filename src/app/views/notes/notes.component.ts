import {
  AfterContentInit,
  Component,
  OnInit,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { NoteslistService } from '../../views/service/noteslist.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { CommonService } from '../service/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Note } from '../../notes';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NgModule } from '@angular/core';
import { NotificationService } from '../service/notification.service';
import Pusher from 'pusher-js';
import { format as formatDate, parse as parseDate } from 'date-fns';
import { MatDatepickerModule } from '@angular/material/datepicker';

interface Client {
  id: any;
  name: string;
  item_id: any;
  item_text: string;
  item_time: any;
  item_cost: any;
}

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent {
  @ViewChild('editNoteModal') editNoteModal: any;
  private pushID = environment.pushID;
  private apiUrl = environment.ApiUrl;
  editorContent = '';
  noteslistData: any;
  noteslist: any;
  noteslistpinned: any;
  pin: any;
  PinnedNotesList: any;
  UnpinnedNotesList: any;
  formdata = [];
  noteslistedit: any = {
    title: null,
    id: null,
    description: null,

  };
  ShareMemberList: any;
  memberslist: any[] = [];
  selectedNoteId: any;
  taskListAll: any;
  dropdownSettings5: any = {};
  team1: Array<Client> = [];
  submitForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    is_expiry: new FormControl('false', []),
    expiry_date: new FormControl('', []),
    task: new FormControl('', [])
  });
  editsharednotea: Array<{ id: number; name: string; select: boolean; edit: boolean; delete: boolean }> = [];

  editsharednote: any;
  editsharednoteData: any;
  editsharednoteID: any;
  editsharednoteForm!: FormGroup;
  memberForm!: FormGroup;
  companyID: any;
  userpermission: any;
  reminderOpen!: boolean;
  checklistOpened: boolean | undefined;
  opened!: boolean;

  editForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    noteID: new FormControl(null), // Note: Assuming noteID is a number
    is_expiry: new FormControl('false', []),
    expiry_date: new FormControl('', []),
    task: new FormControl('', [])
  });

  editnoteslistData: any;
  isReadOnly: boolean = false;
  loading: boolean = false;
  noteslistshared: any;


  constructor(
    private notelistApi: NoteslistService,
    private http: HttpClient,
    private route: Router,
    private location: Location,
    private toastr: ToastrService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private commonService: CommonService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private MatDatepickerModule: MatDatepickerModule,
    private router:Router,
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
    this.spinner.show();
    this.editsharednoteForm = this.fb.group({});
    this.memberForm = this.formBuilder.group({});
    this.dropdownSettings5 = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

  }
  ngOnInit() {
    this.usersPermission();
    this.loadNotesList();
    this.gettask();
    this.ShareNoteMemberList();
    this.commonService.checkLoggedIn();
    const token = localStorage.getItem('tasklogintoken');

    if (localStorage.getItem('userid') !== null){
    Pusher.logToConsole = false;

    const pusher = new Pusher(`${this.pushID}`, {
      cluster: 'ap2'
    });

    const userId = parseInt(localStorage.getItem('userid') || '0', 10);
    let channel3 = pusher.subscribe(`pushnotification.${userId}`);

    channel3.bind('push-notification', (data: any) => {
      console.log('Push notification received:', data);
      if (userId === data.message?.userId || parseInt(data.message?.userId || '0' || '0', 10) === userId) {
        this.notificationService.pushNotify(data.message);
      }
    });
  }
  }


  clickOutside() {
    this.opened = !this.opened;
  }
  reminder() {
    this.opened = !this.opened;
  }
  usersPermission() {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '{}');
    this.userpermission = permissions.notePermission;
    if (this.userpermission.add === 0 && this.userpermission.edit === 0 && this.userpermission.delete === 0) {
      this.route.navigate(['/dashboard']);
    }
  }
  // Event handler for content changes
  onContentChange(event: any) {
    this.editorContent = event.html;
  }

  // shared note start
  selectAllChecked: boolean = false;
  selectAllCheckedEdit: boolean = false;
  selectAllCheckedDelete: boolean = false;

  toggleSelectAllSelect() {
    const newSelectState = !this.selectAllChecked;
    for (let member of this.editsharednotea) {
      member.select = newSelectState;
      const selectControl = this.memberForm.get(`${member.id}.select`);
      if (selectControl) {
        selectControl.setValue(newSelectState);
      }
    }
    this.selectAllChecked = newSelectState; // Update selectAllChecked
  }

  toggleSelectAllEdit() {
    const newSelectState = !this.selectAllCheckedEdit;
    for (let member of this.editsharednotea) {
      member.edit = newSelectState;
      const editControl = this.memberForm.get(`${member.id}.edit`);
      if (editControl) {
        editControl.setValue(newSelectState);
      }
    }
    this.selectAllCheckedEdit = newSelectState;
  }

  toggleSelectAllDelete() {
    const newSelectState = !this.selectAllCheckedDelete;
    for (let member of this.editsharednotea) {
      member.delete = newSelectState;
      const deleteControl = this.memberForm.get(`${member.id}.delete`);
      if (deleteControl) {
        deleteControl.setValue(newSelectState);
      }
    }
    this.selectAllCheckedDelete = newSelectState;
  }

  // Add this method to listen for changes in individual checkboxes
  onCheckboxChange(memberId: number) {
    const member = this.editsharednotea.find((m: any) => m.id === memberId);
    if (member) {
      const selectControl = this.memberForm.get(`${memberId}.select`);
      if (selectControl) {
        const selectValue = selectControl.value;
        member.select = selectValue;
        this.updateSelectAllChecked();
      }
    }
  }

  onCheckboxChangeEdit(memberId: number) {
    const member = this.editsharednotea.find((m: any) => m.id === memberId);
    if (member) {
      const editControl = this.memberForm.get(`${memberId}.edit`);
      if (editControl) {
        const editValue = editControl.value;
        member.edit = editValue;
        this.updateSelectAllCheckedEdit();
      }
    }
  }

  onCheckboxChangeDelete(memberId: number) {
    const member = this.editsharednotea.find((m: any) => m.id === memberId);
    if (member) {
      const deleteControl = this.memberForm.get(`${memberId}.delete`);
      if (deleteControl) {
        const deleteValue = deleteControl.value;
        member.delete = deleteValue;
        this.updateSelectAllCheckedDelete();
      }
    }
  }

  // Method to update selectAllChecked based on individual checkbox states
  updateSelectAllChecked() {
    this.selectAllChecked = this.editsharednotea.every(member => member.select);
  }

  updateSelectAllCheckedEdit() {
    this.selectAllCheckedEdit = this.editsharednotea.every(member => member.edit);
  }

  updateSelectAllCheckedDelete() {
    this.selectAllCheckedDelete = this.editsharednotea.every(member => member.delete);
  }
  // sharenote end

  // share note start
  unsharedselectAllChecked: boolean = false;
  EditunsharedselectAllChecked: boolean = false;
  DeleteunsharedselectAllChecked: boolean = false;

  unsharedtoggleSelectAllSelect() {
    const newSelectState = !this.unsharedselectAllChecked;
    for (const member of this.memberslist) {
      member.selected = newSelectState;
    }
    this.unsharedselectAllChecked = newSelectState;
  }

  unsharedtoggleSelectAllEdit() {
    const newSelectState = !this.EditunsharedselectAllChecked;
    for (const member of this.memberslist) {
      member.edited = newSelectState;
    }
    this.EditunsharedselectAllChecked = newSelectState;
  }

  unsharedtoggleSelectAllDelete() {
    const newSelectState = !this.DeleteunsharedselectAllChecked;
    for (const member of this.memberslist) {
      member.deleted = newSelectState;
    }
    this.DeleteunsharedselectAllChecked = newSelectState;
  }

  unsharedonCheckboxChange(memberId: number) {
    this.unsharedupdateSelectAllChecked();
  }

  unsharedonCheckboxChangeEdit(memberId: number) {
    this.unsharedupdateSelectAllCheckedEdit();
  }

  unsharedonCheckboxChangeDelete(memberId: number) {
    this.unsharedupdateSelectAllCheckedDelete();
  }

  unsharedupdateSelectAllChecked() {
    this.unsharedselectAllChecked = this.memberslist.every(member => member.selected);
  }

  unsharedupdateSelectAllCheckedEdit() {
    this.EditunsharedselectAllChecked = this.memberslist.every(member => member.edited);
  }

  unsharedupdateSelectAllCheckedDelete() {
    this.DeleteunsharedselectAllChecked = this.memberslist.every(member => member.deleted);
  }
  // share note end




  loadNotesList() {
    this.loading = true; // Start loader
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}notesList?companyID=` + localStorage.getItem('usercompanyId'), {
          headers,
        })
        .subscribe(
          (noteslistData: any) => {
            this.noteslistData = noteslistData;
            const noteslist = this.noteslistData?.data || [];
            this.PinnedNotesList = noteslist.createdNote.filter((note: Note) => note.pin === 1);
            this.UnpinnedNotesList = noteslist.createdNote.filter((note: Note) => note.pin === 0);
            this.noteslistshared = noteslist.sharedNote;
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
            if (error.status === 401) {
              this.commonService.logout();
            }
          }
        ).add(() => (this.loading = false));
    } else {
      console.log('No token found in localStorage.');
    }
  }

  clearnoteform() {
    this.submitForm.reset();
  }

  insertusernotes(): void {
    if (this.submitForm.invalid) {
      // Form is invalid, show error messages
      this.submitForm.markAllAsTouched();
      return;
    }
    this.spinner.show();
    this.loading = true; // Start loader

    const token = localStorage.getItem('tasklogintoken');
    if (!token) {
      console.log('No token found in localStorage.');
      return;
    }

    // Get form values
    // Assuming 'submitForm' is a FormGroup or similar object
    const information: { [key: string]: any } = this.submitForm.value;

    // Assign company ID from local storage
    const companyId = localStorage.getItem('usercompanyId');
    information['companyID'] = companyId;

    if (information['expiry_date']) {
      const expiryDateAsDate = new Date(information['expiry_date']);
    
      if (!isNaN(expiryDateAsDate.getTime())) {
        const utcDate = this.toUTC(expiryDateAsDate);
        information['expiry_date'] = utcDate; // Update expiry_date with the UTC version
      } else {
        console.error('Invalid date:', information['expiry_date']);
      }
    }



    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    this.http.post(`${this.apiUrl}noteAdd`, this.submitForm.value, { headers }).subscribe(
      (response: any) => {
        if (response.status === true) {
          const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_add');
          if (elementToClick) {
            elementToClick.click();
          }
          this.spinner.hide();
          setTimeout(() => {
            this.toastr.success('Note Added Successfully.');
          }, 10);
          this.loadNotesList();
        }
      },
      (error: any) => {
        this.spinner.hide();
        console.error('Error sending data', error);
      }
    ).add(() => (this.loading = false));
  }

  updatepinstauts(status: any, id: any) {
    this.loading = true; // Start loader
    this.spinner.show();

    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      if (status == '0') {
        this.pin = '1';
      } else {
        this.pin = '0';
      }

      const dataArray = { pin: this.pin, noteID: id };
      this.http
        .post(`${this.apiUrl}notePinUpdate`, dataArray, { headers })
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              if (response.pinStatus == 1) {
                setTimeout(() => {
                  this.toastr.success('Note Pinned Successfully.');
                }, 10);
                this.loadNotesList();
              }
              if (response.pinStatus == 0) {
                setTimeout(() => {
                  this.toastr.success('Note Unpinned Successfully.');
                }, 10);
              }
              this.spinner.hide();
              this.loadNotesList();
            }
          },
          (error: any) => {
            this.spinner.hide();
            console.error('Error sending data', error);
          }
        )
        .add(() => (this.loading = false)); // Stop loader on completion (success or error)
    }
  }

  deletenoteopendialogue(id: any) {
    this.selectedNoteId = id;
    const modal = document.getElementById('deleteprojectModal');
  }

  confirmDelete(): void {
    if (this.selectedNoteId) {
      this.deletenotes(this.selectedNoteId);
    }
  }


  deletenotes(id: any) {
    this.loading = true; // Start loader
    this.spinner.show();
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const notesId = { noteID: id };

      this.http
        .post(`${this.apiUrl}noteDelete`,
          notesId,
          { headers }
        )
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_delete_note');
              if (elementToClick) {
                elementToClick.click();
              }
              setTimeout(() => {
                this.toastr.success('Note Deleted Successfully.');
              }, 10);
              this.loadNotesList();
              this.spinner.hide();
            }
          },
          (error: any) => {
            this.spinner.hide();
            console.error('Error sending data', error);
          }
        )
        .add(() => (this.loading = false));
    }
  }

  editnotes(id: number) {
    this.spinner.show();
    this.loading = true; // Start loader

    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Accept', 'application/json');
      this.http.get(`${this.apiUrl}noteGet?noteID=` + id, { headers }).subscribe(
        (editnoteslistData: any) => {
          this.editnoteslistData = editnoteslistData;
          this.noteslistedit = this.editnoteslistData?.data;
          this.noteslistedit.expiry_date = parseDate(this.noteslistedit.expiry_date, 'dd-MM-yyyy', new Date());
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
        }
      )
        .add(() => (this.loading = false));
    } else {
      console.log('No token found in localStorage.');
    }
  }

  toUTC(date: Date): string {
    return new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();
  }

  updateusernotes(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.loading = true; // Start loader
  
    const token = localStorage.getItem('tasklogintoken');
    if (!token) {
      console.log('No token found in localStorage.');
      return;
    }
    const information = { ...this.editForm.value }; // Create a copy of the form values
  
    if (information.expiry_date) {
      const expiryDateAsDate = new Date(information.expiry_date);
    
      if (!isNaN(expiryDateAsDate.getTime())) {
        const utcDate = this.toUTC(expiryDateAsDate);
        information.expiry_date = utcDate; // Update expiry_date with the UTC version
      } else {
        console.error('Invalid date:', information.expiry_date);
      }
    }
  
    console.log(information.expiry_date); // Now this will log the converted UTC date
  
    this.spinner.show();
  
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
  
    this.http.post(`${this.apiUrl}noteEdit`, information, { headers }).subscribe(
      (response: any) => {
        const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_edit');
        if (elementToClick) {
          elementToClick.click();
        }
        this.spinner.hide();
        setTimeout(() => {
          this.toastr.success('Note Edited Successfully.');
        }, 10);
        // window.location.reload();
  
        if (response.status === true) {
          this.loadNotesList();
          // Do not dismiss the modal here
        }
      },
      (error: any) => {
        this.spinner.hide();
        console.error('Error sending data', error);
      }
    )
      .add(() => (this.loading = false));
  }
  

  storenoteId(id: number) {

    let noteID = localStorage.getItem('noteid');

    if (!noteID) {
      localStorage.setItem('noteid', id.toString());
    } else {
      localStorage.removeItem('noteid');
      localStorage.setItem('noteid', id.toString());
    }
  }


  storedsharednoteId(id: number) {
    this.loading = true;
    this.spinner.show();

    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Accept', 'application/json');
      this.http.get(`${this.apiUrl}getSharedNoteUserList?noteID=${id}&companyID=${localStorage.getItem('usercompanyId')}`, { headers }).subscribe(
        (response: any) => {
          if (response.status === true && response.data && Array.isArray(response.data)) {
            this.editsharednoteData = response.data;
            this.editsharednoteID = response.noteID;

            this.editsharednotea = this.editsharednoteData.map((user: { id: any; name: any; is_share: number; edited: number; deleted: number; }) => ({
              id: user.id,
              name: user.name,
              select: user.is_share === 1,
              edit: user.edited === 1,
              delete: user.deleted === 1
            }));
            this.spinner.hide();
          } else {
            console.error('Invalid editsharednoteData structure:', response);
          }
        },
        (error) => {
          this.spinner.hide();
          // Handle error
        }
      )
        .add(() => (this.loading = false));
    } else {
      console.log('No token found in localStorage.');
    }
  }




  ShareNoteMemberList() {
    this.spinner.show();
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}getNoteUserList?companyID=` + localStorage.getItem('usercompanyId'), {
          headers,
        })
        .subscribe(
          (ShareMemberList: any) => {
            this.ShareMemberList = ShareMemberList;
            this.memberslist = this.ShareMemberList?.data;

            const userList = this.memberslist;

            // Dynamically add form controls based on user IDs
            userList.forEach(user => {
              const userId = user.id;
              this.editsharednoteForm.addControl(`${userId}.select`, new FormControl(false));
              this.editsharednoteForm.addControl(`${userId}.edit`, new FormControl(false));
              this.editsharednoteForm.addControl(`${userId}.delete`, new FormControl(false));
              this.editsharednoteForm.addControl(`noteid`, new FormControl(false));
            });
            this.spinner.hide();

          },
          (error) => {
            this.spinner.hide();
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  ShareUserNote(formDatas: any, shareusernoteForm: any) {
    this.loading = true;
    this.spinner.show();

    const noteId = localStorage.getItem('noteid');

    const payload: { [key: string]: { edited: string; deleted: string }[] } = {};


    this.memberslist.forEach(member => {
      const memberId = member.id.toString();

      if (formDatas[`${memberId}.selected`]) {
        payload[memberId] = [
          {
            edited: formDatas[`${memberId}.edited`] ? '1' : '0',
            deleted: formDatas[`${memberId}.deleted`] ? '1' : '0',
          }
        ];
      }
    });

    const requestData = {
      noteID: noteId,
      shareUser: payload,
    };

    const token = localStorage.getItem('tasklogintoken');
    if (!token) {
      console.log('No token found in localStorage.');
      return;
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    this.http.post(`${this.apiUrl}noteShare`, requestData, { headers }).subscribe(
      (response: any) => {
        if (response.status === true) {
          const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_shareusernote');
          if (elementToClick) {
            elementToClick.click();
          }
          shareusernoteForm.resetForm();
          setTimeout(() => {
            this.toastr.success('Share Note Successfully.');
          }, 10);
          this.loadNotesList();
          this.spinner.hide();
        }
      },
      (error: any) => {
        this.spinner.hide();
        console.error('Error sending data', error);
      }
    )
      .add(() => (this.loading = false));
  }


  Updatesharedusernotes() {
    this.loading = true;
    this.spinner.show();

    const formDatas = this.editsharednoteForm.value;
    const noteId = formDatas.noteid;


    const payload: { [key: string]: { edited: string; deleted: string }[] } = {};


    this.memberslist.forEach(member => {
      const memberId = member.id.toString();

      if (formDatas[`${memberId}.select`]) {
        payload[memberId] = [
          {
            edited: formDatas[`${memberId}.edit`] ? '1' : '0',
            deleted: formDatas[`${memberId}.delete`] ? '1' : '0',
          }
        ];
      }
    });


    const requestData = {
      noteID: noteId,
      shareUser: payload,
    };

    const token = localStorage.getItem('tasklogintoken');
    if (!token) {
      console.log('No token found in localStorage.');
      return;
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    this.http.post(`${this.apiUrl}noteShare`, requestData, { headers }).subscribe(
      (response: any) => {
        if (response.status === true) {
          const elementToClick = this.elementRef.nativeElement.querySelector('#sharedusernoteupdate');
          if (elementToClick) {
            elementToClick.click();
          }
          this.editsharednoteForm.reset()
          setTimeout(() => {
            this.toastr.success('Share Note Successfully.');
          }, 10);
          this.loadNotesList();
          this.spinner.hide();
        }
      },
      (error: any) => {
        this.spinner.hide();
        console.error('Error sending data', error);
      }
    ).add(() => (this.loading = false));
  }


  ShareUserNoteShared(formDatas: any, shareusernoteForm: any) {
    this.spinner.show();
    this.loading = true;

    const noteId = localStorage.getItem('notesharedid');

    const payload: { [key: string]: { edited: string; deleted: string }[] } = {};

    this.memberslist.forEach(member => {
      const memberId = member.id.toString();

      if (formDatas[`${memberId}.selected`]) {
        payload[memberId] = [
          {
            edited: formDatas[`${memberId}.edited`] ? '1' : '0',
            deleted: formDatas[`${memberId}.deleted`] ? '1' : '0',
          }
        ];
      }
    });

    const requestData = {
      noteID: noteId,
      shareUser: payload,
    };

    const token = localStorage.getItem('tasklogintoken');
    if (!token) {
      console.log('No token found in localStorage.');
      return;
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    this.http.post(`${this.apiUrl}noteShare`, requestData, { headers }).subscribe(
      (response: any) => {
        if (response.status === true) {
          const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_shareusernote');
          if (elementToClick) {
            elementToClick.click();
          }
          shareusernoteForm.resetForm();
          setTimeout(() => {
            this.toastr.success('Share Note Successfully.');
          }, 10);
          this.loadNotesList();
          this.spinner.hide();
        }
      },
      (error: any) => {
        this.spinner.hide();
        console.error('Error sending data', error);
      }
    )
      .add(() => (this.loading = false));
  }


  setbackground(colorcode: any, id: any) {
    this.spinner.show();
    this.loading = true;
    const requestData = {
      noteID: id,
      color: colorcode,
    };

    const token = localStorage.getItem('tasklogintoken');
    if (!token) {
      console.log('No token found in localStorage.');
      return;
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    this.http.post(`${this.apiUrl}noteColorUpdate`, requestData, { headers }).subscribe(
      (response: any) => {
        if (response.status === true) {
          const elementToClick = this.elementRef.nativeElement.querySelector('.popup_close_btn_shareusernote');
          if (elementToClick) {
            elementToClick.click();
          }
          setTimeout(() => {
            this.toastr.success('Note Color Updated Successfully.');
          }, 10);
          this.loadNotesList();
          this.spinner.hide();
        }
      },
      (error: any) => {
        this.spinner.hide();
        console.error('Error sending data', error);
      }
    )
      .add(() => (this.loading = false));
  }

  closeEditNoteModal(): void {
    this.editNoteModal.dismiss();
  }

  task: Task = {
    name: 'Select All',
    completed: false,
    subtasks: [
      { name: 'Projects', completed: false },
      { name: 'Tasks', completed: false },
      { name: 'Discussion', completed: false },
      { name: 'DMS', completed: false },
    ],
  };

  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete =
      this.task.subtasks &&
      this.task.subtasks.every((subtask) => subtask.completed);
  }

  someComplete(): boolean {
    return (
      this.task.subtasks &&
      this.task.subtasks.some((subtask) => subtask.completed)
    );
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach((t) => (t.completed = completed));
  }

  gettask() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = this.commonService.getAuthHeaders(token);
      const body = this.commonService.getTaskRequestPayload();

      if (!body) {
        return;
      }

      this.http.post(`${this.apiUrl}taskListAll`, body, { headers }).subscribe(
        (response: any) => {
          this.taskListAll = response;

          this.team1 = this.taskListAll.data.map(
            (item: { task_id: any; title: any }) => ({
              item_id: item.task_id,
              item_text: item.title,
            })
          );

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

interface Task {
  name: string;
  completed: boolean;
  subtasks: { name: string; completed: boolean }[];
}







// share note modal
