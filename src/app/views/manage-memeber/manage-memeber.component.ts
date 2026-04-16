import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-manage-memeber',
  templateUrl: './manage-memeber.component.html',
  styleUrls: ['./manage-memeber.component.scss'],
  standalone: true,
  imports:[RouterModule],
})
export class ManageMemeberComponent {
  constructor(private commonService: CommonService) {}
  ngOnInit() {
    this.commonService.checkLoggedIn();
  }
}
