import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, } from '@angular/forms';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {
 AvatarModule,
 ButtonGroupModule,
 ButtonModule,
 CardModule,
 
 GridModule,
 NavModule,
 ProgressModule,
 TableModule,
 TabsModule} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { QuillModule } from 'ngx-quill';
import { QuillConfigModule } from 'ngx-quill/config';

@NgModule({
  imports: [
    DashboardRoutingModule,
    CardModule,
    NavModule,
    IconModule,
    TabsModule,
    CommonModule,
    GridModule,
    ProgressModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    FormsModule,
    ButtonModule,
    ButtonGroupModule,
    AvatarModule,
    TableModule,
    SlickCarouselModule,
    QuillModule.forRoot(),
    QuillConfigModule,
  ],
  declarations: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class DashboardModule {

  
}
