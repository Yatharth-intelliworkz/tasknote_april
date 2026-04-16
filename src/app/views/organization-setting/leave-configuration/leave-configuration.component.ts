
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
} from '@angular/forms';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../service/common.service';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-leave-configuration',
  templateUrl: './leave-configuration.component.html',
  styleUrls: ['./leave-configuration.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgIf,
    MatCheckboxModule
  ],
})
export class LeaveConfigurationComponent {
  leaveForm: any;

  userList:boolean = true;
  othersChecked:boolean = false;
  cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab' },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
];
  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private fb: FormBuilder,
    private toastr: ToastrService,  
  ){}


  submitForm(){}

}
