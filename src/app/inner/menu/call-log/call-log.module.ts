import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CallLogPageRoutingModule } from './call-log-routing.module';

import { CallLogPage } from './call-log.page';
import { MaterialModule } from '../../../shared-modules/material/material/material.module';
import { ToolbarTopComponent } from './toolbar-top/toolbar-top.component';
import { ToolbarCustomerComponent } from './toolbar-customer/toolbar-customer.component';
import { FilterComponent } from './filter/filter.component';
import { CalllogToolbarSearchComponent } from './toolbar-customer/calllog-toolbar-search/calllog-toolbar-search.component';

// import { CallLog, CallLogObject } from '@ionic-native/call-log/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CallLogPageRoutingModule,
    MaterialModule
  ],
  declarations: [
    CallLogPage,
    ToolbarTopComponent,
    ToolbarCustomerComponent,
    FilterComponent,
    CalllogToolbarSearchComponent],
  // providers:[CallLog]
})
export class CallLogPageModule {}
