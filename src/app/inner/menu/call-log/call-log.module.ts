import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CallLogPageRoutingModule } from './call-log-routing.module';
import { CallLogPage } from './call-log.page';
import { MaterialModule } from '../../../shared-modules/material/material/material.module';
import { ToolbarCustomerComponent } from './toolbar-customer/toolbar-customer.component';
import { FilterComponent } from './filter/filter.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CalllogToolbarSearchComponent } from './toolbar-customer/calllog-toolbar-search/calllog-toolbar-search.component';
import { CallToolbarTopComponent } from './call-toolbar-top/call-toolbar-top.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CallLogPageRoutingModule,
    MaterialModule,
    MatSlideToggleModule
  ],
  declarations: [
    CallLogPage,
    ToolbarCustomerComponent,
    FilterComponent,
    CalllogToolbarSearchComponent,
    CallToolbarTopComponent
  ],
  // providers:[CallLog]
})
export class CallLogPageModule {}
