import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeCallLogsPageRoutingModule } from './home-call-logs-routing.module';

import { HomeCallLogsPage } from './home-call-logs.page';
import { MaterialModule } from '../../../shared-modules/material/material/material.module';
import { ToolbarTopComponent } from './toolbar-top/toolbar-top.component';
import { ToolbarCustomerComponent } from './toolbar-customer/toolbar-customer.component';
import { FilterComponent } from './filter/filter.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeCallLogsPageRoutingModule,
    MaterialModule
  ],
  declarations: [HomeCallLogsPage,ToolbarTopComponent,ToolbarCustomerComponent,FilterComponent]
})
export class HomeCallLogsPageModule {}
