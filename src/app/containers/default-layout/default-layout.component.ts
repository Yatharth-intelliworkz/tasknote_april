import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { navItems } from './_nav';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../views/service/common.service';
import { Location } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent {

  public navItems = navItems;
  userpermission: any;
  projectPermission: any;
  private apiUrl = environment.ApiUrl;

  constructor(private renderer: Renderer2, private route: Router,
    private http: HttpClient,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private router: Router) {
    const token = localStorage.getItem('tasklogintoken');
    if (!token) {
      this.router.navigate(['/login']);
    }

  }
  ngOnInit() {
    this.usersPermission();
  }

  usersPermission() {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '{}');
    this.projectPermission = permissions.projectPermission;
    if (this.projectPermission.add === 0 && this.projectPermission.edit === 0 && this.projectPermission.delete === 0) {
      this.route.navigate(['/dashboard']);
    }
  }
  navigate(event: MouseEvent, url: string) {
    if (event.ctrlKey || event.metaKey) {
      // If Control or Command is pressed, open in a new tab
      window.open(url, '_blank');
    } else {
      // Otherwise, navigate within the same tab
      this.router.navigate([url]);
    }
    event.preventDefault(); // Prevent default anchor behavior
  }
  setActive(route: string): void {
    // Some logic to set the active route
    this.route.navigate([route]);
  }

  isActive(route: string): boolean {
    // Some logic to check if the route is active
    return this.route.isActive(route, true);
  }
}
