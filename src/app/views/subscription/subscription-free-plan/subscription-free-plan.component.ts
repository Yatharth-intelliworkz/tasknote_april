import { Component } from '@angular/core';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-subscription-free-plan',
  templateUrl: './subscription-free-plan.component.html',
  styleUrls: ['./subscription-free-plan.component.scss']
})
export class SubscriptionFreePlanComponent {
  constructor(private commonService: CommonService) {}
  ngOnInit(){
  this.commonService.checkLoggedIn();
}
}
