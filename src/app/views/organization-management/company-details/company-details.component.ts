import { Component, ViewChild } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { SlickCarouselModule } from 'ngx-slick-carousel'
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommonService } from '../../service/common.service';
import { NgFor, NgIf } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss'],
  standalone: true,
  imports: [FormsModule, ClipboardModule, RouterLink, MatDividerModule, MatListModule, SlickCarouselModule, NgFor, NgIf, NgxSpinnerModule],
})
export class CompanyDetailsComponent {
  @ViewChild('slickCarousel') slickCarousel: any;
  companyId: any;
  private apiUrl = environment.ApiUrl;
  public domainName = environment.domainName;
  memberlistData: any;
  memberlist: any;
  getcompanyId: any;
  rolelist: any;
  roleslistData: any;
  permissions: any;
  servicelistData:any;
  servicelist:any;
  constructor(private formBuilder: FormBuilder, private fb: FormBuilder,
    private http: HttpClient,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }
  // dashboard note slider
  role_slideConfig = {
    "slidesToShow": 2,
    "slidesToScroll": 1,
    "dots": false,
    "arrows": false,
    "infinite": false,
    "autoplay": false,
    "prevArrow": "<img class='a-left control-c prev slick-prev' src='../../../assets/img/dashboard/prev-icon.svg'>",
    "nextArrow": "<img class='a-right control-c next slick-next' src='../../../assets/img/dashboard/next-icon.svg'>",
    "responsive": [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  afterChange(event: any) {
    console.log('Carousel after change', event);
  }
  onWheel(event: WheelEvent) {
    // Example:
    if (event.deltaY > 0) {
      this.slickCarousel.slickNext();
    } else {
      this.slickCarousel.slickPrev();
    }
    event.preventDefault();
  }

  ngOnInit(): void {
    this.permission();
    this.route.paramMap.subscribe(params => {

      this.companyId = params.get('id');
      this.getcompanyId = params.get('id');
      this.getcompanydetail();

    });
    this.RolesList();
    this.gettasktypelist();
  }

  permission() {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '{}');
    this.permissions = permissions.organizationPermission;
    if (this.permissions.add === 0 && this.permissions.edit === 0 && this.permissions.delete === 0) {
      this.router.navigate(['/dashboard']);
    }
  }
  getUsernameFromLocalStorage(): string | null {
    const username = localStorage.getItem('username');
    return username;
  }
  getInitials(name: string): string {
    return name.split(' ').map(name => name.charAt(0)).join('');
  }
  getcompanydetail() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}companyDetails?companyID=` + this.companyId, {
          headers,
        })
        .subscribe(
          (clientslistData: any) => {
            this.memberlistData = clientslistData;
            this.memberlist = this.memberlistData?.data;
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

  RolesList() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}roleList?companyID=` + this.getcompanyId, {
          headers,
        })
        .subscribe(
          (roleslistData: any) => {
            this.roleslistData = roleslistData;
            this.rolelist = this.roleslistData?.data;
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

  gettasktypelist() {
    const token = localStorage.getItem('tasklogintoken');
    if (token) {
      this.spinner.show();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      this.http
        .get(`${this.apiUrl}taskTypeList?companyID=` + this.companyId, {
          headers,
        })
        .subscribe(
          (noteslistData: any) => {
            this.servicelistData = noteslistData;
            this.servicelist = this.servicelistData?.data;
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
}







