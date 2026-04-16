import { Renderer2, AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Pipe, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ElementRef } from '@angular/core';

import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, NgModel, Validators, } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { FormModule } from '@coreui/angular';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonService } from '../service/common.service';
// import { FirebaseApp, initializeApp } from 'firebase/app';
// import { Database, getDatabase, ref, set, onValue, push, child, update } from "firebase/database";
import { environment } from 'src/environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { PickerComponent, PickerModule } from '@ctrl/ngx-emoji-mart';
type EmojiSet = '' | 'apple' | 'google' | 'twitter' | 'facebook';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Pusher from 'pusher-js';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../service/notification.service';

interface Users {
  item_id: any;
  item_text: string;
  isDisabled?: boolean;
}

interface users {
  id: any;
}

interface TeamMember {
  id: number;
  name: string;
  profile: string;
}

interface Client {
  item_id: any;
  item_text: string;
}


export interface Chat {
  fromsenderid: string;
  id?: string;
  username: string;
  message: string;
  timestamp: Date;
  tosenderid: string;
  read: any;
  unreadMessageCount: number; // Assuming unreadMessageCount is a number,
  unreadMessageCountgroups: number; // Assuming unreadMessageCount is a number,

}

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.component.html',
  styleUrls: ['./discussions.component.scss'],
  standalone: true,
  imports: [NgbRatingModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormModule, ReactiveFormsModule, FormsModule, NgMultiSelectDropDownModule, MatCardModule, CommonModule, MatIconModule, PickerModule, PickerComponent, MatButtonModule, MatMenuModule],
})
export class DiscussionsComponent {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  ngAfterViewChecked() {
    this.scrollToBottomAndLog();
  }

  scrollToBottomAndLog(): void {
    try {
      this.scrollToBottom();
    } catch (err) {
      console.error("Error while scrolling to bottom:", err);
    }
  }

  scrollToBottom(): void {
    try {
      if (this.myScrollContainer) {
        const container = this.myScrollContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    } catch (err) {
      console.error("Error while scrolling to bottom:", err);
    }
  }
  currentRate = 0;
  messageToSend: any;

  set: EmojiSet = '';
  // multiselect dd.\
  fileForm!: FormGroup;
  unreadmessagecountsingle: any;

  selectedItems2: Users[] = [];
  forms: FormGroup | undefined;
  form: FormGroup;
  user: Array<Users> = [];
  chatsloads: any;
  chatsload: any;

  username = '';
  teamname = '';
  message = '';
  chats: Chat[] = [];
  memberlistData: any;
  memberlist: any;
  loggedinuser: any
  chatsmessage: any;
  chatsmessages: any;
  senderid: any;
  messages: any;
  showEmojiPicker = false;
  isActive: boolean = false;
  chatsLoaded: boolean = false;
  submitting: boolean = false;
  teamListData: any;
  teamList: any;
  userid: any;
  teamid: any;
  teammemberslist: any;
  sets = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger'
  ]
  activeUserId: any;
  activeUserTeam: any;
  foundId: any;
  private pushID = environment.pushID;
  private apiUrl = environment.ApiUrl;
  public domainName = environment.domainName;
  receivedMessage: any;
  messagesArrays: any[] = [];
  grpmessagesArraysgrp: any[] = [];
  projectslistData: any;
  projectslistcreated: any;
  team1: Array<Client> = [];
  team2: Array<Client> = [];
  dropdownSettings1: any = {};
  dropdownSettings2: any = {};
  groupForm!: FormGroup;
  EditgroupForm!: FormGroup;
  unreadgroupscounts: any;
  selectedGroupId: any;
  groupedits: any = {};
  checkwhich: any;
  userpermission: any;
payload:any;
companyID:any;
  constructor(private elementRef: ElementRef, private renderer: Renderer2, private commonService: CommonService, private spinner: NgxSpinnerService, private fb: FormBuilder, private formBuilder: FormBuilder, private http: HttpClient, private toastr: ToastrService, private route: ActivatedRoute, private router: Router, private el: ElementRef, private notificationService: NotificationService) {
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
    this.loggedinuser = localStorage.getItem('userid');
    this.fileForm = this.formBuilder.group({
      multiplefile: ['initialValue'],
    });

    this.dropdownSettings1 = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    this.form = this.formBuilder.group({
      'message': ['', Validators.required],
      'username': [],
      'teamname': [],
      'tosenderid': [],
      'fromsenderid': [],
      'messagednames': [],
      'members': [],
      'read': [],
      'group_id': [],
      'document':[]
    });

    this.groupForm = this.fb.group({
      group_name: ['', Validators.required],
      project_id: ['', Validators.required],
      group_members: ['', Validators.required],
    });

    this.forms = this.fb.group({
      selectedItems2: [[]], // Initialize as an empty array
      // attech file
      yourFormControlName: ['initialValue'],
      // attech file
    });


    this.dropdownSettings1 = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    this.dropdownSettings2 = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };


  }

  ngOnInit() {
    localStorage.removeItem('pusshermsg');
    localStorage.removeItem('pusshermsggroup');
    localStorage.removeItem('chatuser');
    this.usersPermission();
    this.unreadmesagecountsingle();
    this.getmemberlist();
    this.unreadmesagecountgroups();
    this.getteamlist();
    this.commonService.checkLoggedIn();
    this.loadProjectsList();
    this.scrollToBottom();

    this.EditgroupForm = this.formBuilder.group({
      project_id: [''],
      group_members: [''],
      group_name: [''],
      id: ['']
    });

    // Pusher.logToConsole = true;
    const pusher = new Pusher(`${this.pushID}`, {
      cluster: 'ap2'
    });

    if (localStorage.getItem('userid') !== null) {
      var channel = pusher.subscribe(`chat.${localStorage.getItem('userid')}`);
      channel.bind('new-message', (data: any) => {
        var checkuser = data.message.sender_id == localStorage.getItem('chatuser');

        if (checkuser) {
          var createdAt = data.message.created_at;

          var messageWithoutQuotes = JSON.stringify(data.message.message);

          var message = messageWithoutQuotes.replace(/^"(.*)"$/, '$1');

          let jsonMessages = localStorage.getItem('pusshermsg');

          let messagesArray = [];

          if (jsonMessages) {
            messagesArray = JSON.parse(jsonMessages);
          }

          messagesArray.push({ message: message, created_at: createdAt });

          const updatedJsonMessages = JSON.stringify(messagesArray);

          localStorage.setItem('pusshermsg', updatedJsonMessages);

          this.messagesArrays = messagesArray;
        }
        else {
          this.unreadmesagecountsingle()
        }
      });

      let channel2 = pusher.subscribe(`group.${localStorage.getItem('groupusers')}`);
      const userId = parseInt(localStorage.getItem('userid') || '0', 10);
      let channel3 = pusher.subscribe(`pushnotification.${userId}`);

      channel3.bind('push-notification', (data: any) => {
        console.log('Push notification received:', data);
        if (userId === data.message?.userId || parseInt(data.message?.userId || '0' || '0', 10) === userId) {
          this.notificationService.pushNotify(data.message);
        }
      });

      channel2.bind('group-message', (data: any) => {
        this.checkwhich = 1;

        const checkgroups = data.message.group_id == localStorage.getItem('groupusers');
        if (checkgroups) {
          this.groupmessagespusher(data);
        } else {
          this.unreadmesagecountgroups();
        }
      });

      const updateSubscriptions = () => {

        if (this.checkwhich !== 1) {
          channel2.unsubscribe();
          channel2 = pusher.subscribe(`group.${localStorage.getItem('groupusers')}`);
          channel2.bind('group-message', (data: any) => {
            const checkgroups = data.message.group_id == localStorage.getItem('groupusers');
            if (checkgroups) {
              this.groupmessagespusher(data);
            } else {
              this.unreadmesagecountgroups();
            }
          });
        }

      }

      this.updateSubscriptions = updateSubscriptions.bind(this);
    }
  }

  usersPermission() {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '{}');
    this.userpermission = permissions.discussionPermission;
    if (this.userpermission.add === 0 && this.userpermission.edit === 0 && this.userpermission.delete === 0) {
      this.router.navigate(['/dashboard']);
    }
  }

  updateSubscriptions() {
  }

  unreadDisplayed: boolean = false;

  groupmessagespusher(data: any) {
    console.log(data);
    
    if (data.message.sender_id == localStorage.getItem('userid')) {
      return
    }
    var sender_name = this.teammemberslist.find((user: { id: any; }) => user.id == data.message.sender_id)?.name;
    var createdAt = data.message.created_at;
    var id = data.message.id;
    var messageWithoutQuotes = JSON.stringify(data.message.message);
    var message = messageWithoutQuotes.replace(/^"(.*)"$/, '$1');

    let jsonMessagess = localStorage.getItem('pusshermsggroup');
    let grpmessages = [];

    if (jsonMessagess) {
      grpmessages = JSON.parse(jsonMessagess);
    }

    // Check if the message already exists in grpmessages
    const messageExists = grpmessages.some((msg: { id: any; }) => {
      return msg.id === id;
    });

    // If the message does not already exist, push it to grpmessages
    if (!messageExists) {
      grpmessages.push({
        id: id,
        message: message,
        created_at: createdAt,
        sender_name: sender_name
      });

      const jsonMessages = JSON.stringify(grpmessages);
      localStorage.setItem('pusshermsggroup', jsonMessages);

      this.grpmessagesArraysgrp = JSON.parse(jsonMessages);
    }
  }






  onSubmit(information: any) {
    if (information.group_name == '' || information.project_id == '' || information.members_id == '') {
      this.toastr.error('Please fill all fields');
      return
    }
    information.companyId = localStorage.getItem('usercompanyId');
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .post(`${this.apiUrl}creategroup`, information, { headers })
        .subscribe(
          (response: any) => {
            if (response.success == true) {
              this.getteamlist();
              this.toastr.success('Group Created Successfully');
              const elementToClick = this.elementRef.nativeElement.querySelector('#group_popup_close_btn');
              if (elementToClick) {
                elementToClick.click();
              }
              this.groupForm.reset();
              this.spinner.hide();
            }
          },
          (error) => {
            this.spinner.hide();
            console.error('Error loading projects list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  loadProjectsList() {
    
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .get(`${this.apiUrl}discussionprojects/` + localStorage.getItem('usercompanyId'), { headers })
        .subscribe(
          (projectslistData: any) => {
            this.projectslistData = projectslistData;
            this.projectslistcreated = projectslistData?.data;
            // console.log(this.projectslistcreated);
            
            this.team2 = this.projectslistData.data.map((item: { id: any; name: any; }) => ({
              item_id: item.id,
              item_text: item.name.toUpperCase(),
            }));
          },
          (error) => {
            console.error('Error loading projects list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  getusers(id: any) {
    if (id != '' && id != 'undefined') {
      const token = localStorage.getItem('tasklogintoken');
      if (token) {
        this.spinner.show();
        const headers = new HttpHeaders()
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json');
        this.http
          .get(`${this.apiUrl}projectMembersList?projectID=` + id[0].item_id, {
            headers,
          })
          .subscribe(
            (clientslistData: any) => {
              this.memberlistData = clientslistData;
              this.memberlist = this.memberlist.filter((users: { id: string | null; }) => users.id != localStorage.getItem('userid'));
              this.team1 = this.memberlist.map((item: { id: any; name: any; }) => ({
                item_id: item.id,
                item_text: item.name,
              }));
              this.spinner.hide();
            },
            (error) => { }
          );
      } else {
        console.log('No token found in localStorage.');
      }
    }

  }

  onChatSubmit(form: any) {
    const chat = form;
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.form.get('message')?.setValue('');
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
        this.companyID = localStorage.getItem('usercompanyId');
        const formData = new FormData();
        if(chat.document){
          formData.append('receiver_id', chat.tosenderid); // Append group_id
          formData.append('message', chat.message);  // Append message
          formData.append('companyId', this.companyID);    // Append file in binary format
          formData.append('file', chat.document);    // Append file in binary format
        }else{
          formData.append('receiver_id', chat.tosenderid); // Append group_id
          formData.append('message', chat.message);  // Append message
          formData.append('companyId', this.companyID);  // Append message
        }
       
      this.http.post(`${this.apiUrl}chat/send`, formData, { headers }).subscribe(
        (response: any) => {
          localStorage.removeItem('pusshermsg');
          this.messagesArrays = [];
          this.chatsloads = response;
          this.chatsload = response.messages;
          this.chatsmessage = this.chatsload;          
        },
        (error: any) => {
          console.error('Error sending data', error);
        }
      );
    }
  }
  getmemberlist() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}comapnyMemberList?companyID=` + localStorage.getItem('usercompanyId'), {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.memberlistData = clientslistData;
            this.memberlist = this.memberlistData?.data;

            // Set unread message count for each user
            this.memberlist.forEach((user: any) => {
              user.unreadMessageCount = this.unreadmessagecountsingle.find((chat: any) => chat.userId === user.id)?.count || 0;
            });

            // Sort the member list so that users with unread messages appear at the top
            this.memberlist.sort((a: any, b: any) => {
              if (a.unreadMessageCount !== 0 && b.unreadMessageCount === 0) {
                return -1; // a has unread messages, b does not: a comes first
              } else if (a.unreadMessageCount === 0 && b.unreadMessageCount !== 0) {
                return 1; // b has unread messages, a does not: b comes first
              } else {
                return 0; // Both have or both don't have unread messages: maintain original order
              }
            });

            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
            if (error.status === 401) {
              this.commonService.logout();
            }
          }
        );
    } else {
      this.spinner.hide();
      console.log('No token found in localStorage.');
    }
  }
  unreadmesagecountsingle() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${environment.ApiUrl}unreadmesagecountsingle/${localStorage.getItem('usercompanyId')}`, {
          headers,
        })
        .subscribe(
          (unreadmessagecountsingles: any) => {
            this.unreadmessagecountsingle = unreadmessagecountsingles.unreadmessages;
          },
          (error: any) => { }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  setuser(id: any, name: any) {
    this.activeUserTeam = '';
    this.activeUserId = id;
    localStorage.setItem('chatuser', id);

    this.form.get('username')?.setValue(name);
    this.form.get('tosenderid')?.setValue(id);
    this.senderid = id;
    this.form.get('fromsenderid')?.setValue(localStorage.getItem('userid'));


    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${environment.ApiUrl}chat/history/${id}`, {
          headers,
        })
        .subscribe(
          (messageHistory: any) => {
            localStorage.removeItem('pusshermsg');
            this.messagesArrays = [];
            this.chatsmessage = messageHistory.messages;
            this.unreadmesagecountsingle();
          },
          (error: any) => { }
        );
    } else {
      console.log('No token found in localStorage.');
    }
    this.singlemessageread(id);
  }

  singlemessageread(id: any) {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${environment.ApiUrl}messageread/${id}`, {
          headers,
        })
        .subscribe(
          (messageHistory: any) => {
            this.unreadmesagecountsingle();
            this.getmemberlist();
          },
          (error: any) => { }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  unreadmesagecountgroups() {
    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${environment.ApiUrl}unreadmesagecountgroup/` + localStorage.getItem('usercompanyId'), {
          headers,
        })
        .subscribe(
          (messcounts: any) => {
            this.unreadgroupscounts = messcounts.unread_counts;
            this.teamList.forEach((team: any) => {
              team.unreadMessageCountgroup = this.unreadgroupscounts.find((chat: any) => chat.group_id
                === team.id)?.unread_count || 0;
            });
          },
          (error: any) => { }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }


  getInitials(name: string): string {
    return name.split(' ').map(name => name.charAt(0)).join('');
  }

  groupShortname(sender_name: string): string {
    return sender_name.split(' ').map(name => name.charAt(0)).join('');
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    const { messages } = this;
    const text = `${event.emoji.native}`;
    const currentValue = this.form.get('message')?.value || '';

    // Append the new text to the current value
    const updatedValue = currentValue + text;
    this.form.get('message')?.setValue(updatedValue);
    this.showEmojiPicker = false;
  }

  onFocus() {
    this.showEmojiPicker = false;
  }
  onBlur() {
  }


  getteamlist() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}groupLists/` + localStorage.getItem('usercompanyId'), {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.teamListData = clientslistData;
            this.teamList = this.teamListData?.data;
          },
          (error) => { }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }


  setteam(teamid: any, teamname: any) {
    this.form.get('teamname')?.setValue(teamname);
    this.form.get('group_id')?.setValue(teamid);
    localStorage.setItem('groupusers', teamid);
    this.activeUserId = '';
    this.getteammember(teamid);
    this.activeUserTeam = teamid;
    this.teamid = teamid;

    const token = localStorage.getItem('tasklogintoken');

    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${environment.ApiUrl}loadgroupchats/${teamid}`, {
          headers,
        })
        .subscribe(
          (messageHistory: any) => {
            localStorage.removeItem('pusshermsggroup');
            this.grpmessagesArraysgrp = [];
            this.chatsmessages = messageHistory.messages;
            this.GroupMessageRead(teamid);
            this.unreadmesagecountgroups();
            this.updateSubscriptions();
          },
          (error: any) => { }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }





  onChatSubmitteam(form: any) {
    const chat = form;
    localStorage.setItem('groupusers', chat.group_id);
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.form.get('message')?.setValue('');
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
        const formData = new FormData();
        if(chat.document){
          formData.append('group_id', chat.group_id); // Append group_id
          formData.append('message', chat.message);  // Append message
          formData.append('file', chat.document);    // Append file in binary format
        }else{
          formData.append('group_id', chat.group_id); // Append group_id
          formData.append('message', chat.message);  // Append message
        }

      this.http.post(`${this.apiUrl}sendgroupmessage`,formData , { headers }).subscribe(
        (response: any) => {
          localStorage.removeItem('pusshermsggroup');
          this.grpmessagesArraysgrp = [];
          this.chatsloads = response;
          this.chatsload = response.messages;
          this.chatsmessages = this.chatsload;
          this.GroupMessageRead(chat.group_id);
          this.unreadmesagecountgroups();
        },
        (error: any) => {
          console.error('Error sending data', error);
        }
      );
    }
  }

  getteammember(id: any) {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}getGroupMember/` + id, {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.teammemberslist = clientslistData?.data;
          },
          (error) => { }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  GroupMessageRead(id: any) {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}groupmessagesread/` + id, {
          headers,
        })
        .subscribe(
          (response: any) => {
            if (response.success == true) {
            }
          },
          (error) => { }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  deletegroupopendialogue(id: any) {
    this.selectedGroupId = id;
  }

  confirmDelete(): void {
    if (this.selectedGroupId) {
      this.deletegroup(this.selectedGroupId);
    }
  }

  deletegroup(id: any) {
    this.spinner.show();
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const groupId = { groupId: id };

      this.http
        .post(`${this.apiUrl}groupDelete`,
          groupId,
          { headers }
        )
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              const elementToClick = this.elementRef.nativeElement.querySelector('#popup_close_btn_delete_note');
              if (elementToClick) {
                elementToClick.click();
              }
              setTimeout(() => {
                this.toastr.success('Group Deleted Successfully.');
              }, 10);
              this.getteamlist();
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

  editGroup(id: any) {
    this.spinner.show();
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      const groupId = { noteID: id };

      this.http
        .get(`${this.apiUrl}groupEdit/` + id, { headers }
        )
        .subscribe(
          (response: any) => {
            if (response.status === true) {
              this.groupedits = response.data;
              this.getusers(this.groupedits.projects)
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

  onupdate() {
    const information = this.EditgroupForm.value;

    if (information.group_name == '' || information.project_id == '' || information.members_id == '') {
      this.toastr.error('Please fill all fields');
      return
    }

    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      this.http
        .post(`${this.apiUrl}updategroup`, information, { headers })
        .subscribe(
          (response: any) => {
            if (response.success == true) {
              this.toastr.success('Group Updated Successfully');
              const elementToClick = this.elementRef.nativeElement.querySelector('#group_popup_close_btn_update');
              if (elementToClick) {
                elementToClick.click();
              }
              this.EditgroupForm.reset();
              this.spinner.hide();
            }
          },
          (error) => {
            this.spinner.hide();
            console.error('Error loading projects list:', error);
          }
        );
    } else {
      console.log('No token found in localStorage.');
    }
  }

  uploadtaskcomment(event:any){
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
        this.form.get('document')?.setValue(file);
        this.onChatSubmitteam(this.form.value);
      };
      reader.readAsDataURL(file);
    }
    
  }
  uploaddocsingle(event:any){
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
        this.form.get('document')?.setValue(file);
        this.onChatSubmit(this.form.value);
      };
      reader.readAsDataURL(file);
    }
    
  }
}


