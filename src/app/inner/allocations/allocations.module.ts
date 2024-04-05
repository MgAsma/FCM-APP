import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AllocationsPageRoutingModule } from './allocations-routing.module';
import { AllocationsPage } from './allocations.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { MaterialModule } from '../../shared-modules/material/material/material.module';
import { CallLog } from '@ionic-native/call-log/ngx';
import { Device } from '@ionic-native/device/ngx'
import { ToolbarTopComponent } from './toolbar-top/toolbar-top.component';
import { FilterComponent } from './filter/filter.component';
import { ToolbarCustomerComponent } from './toolbar-customer/toolbar-customer.component';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    IonicModule,
    AllocationsPageRoutingModule,
  ],
  declarations: [
    AllocationsPage,
    ToolbarTopComponent,
    ToolbarCustomerComponent,
    FilterComponent],
    providers:[CallNumber,CallLog,Device,AndroidPermissions]
  
})
export class AllocationsPageModule {}
