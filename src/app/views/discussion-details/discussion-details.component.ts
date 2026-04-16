import { Component } from '@angular/core';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-discussion-details',
  templateUrl: './discussion-details.component.html',
  styleUrls: ['./discussion-details.component.scss']
})
export class DiscussionDetailsComponent {
  constructor(private commonService: CommonService) {}
  ngOnInit() {
    this.commonService.checkLoggedIn();
  }
}
