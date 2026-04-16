import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';
import { NotificationService } from '../app/views/service/notification.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'TaskNote';

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,  private notificationService: NotificationService
  ) {
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });

    this.notificationService.requestPermission();
    // setInterval(() => {
    //   this.notificationService.pushNotify();
    // }, 10000);
  }

  
}
