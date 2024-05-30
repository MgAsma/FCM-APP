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
import { FilterComponent } from './filter/filter.component';
import { ToolbarCustomerComponent } from './toolbar-customer/toolbar-customer.component';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { CounsellorSearchBarComponent } from './toolbar-customer/counsellor-search-bar/counsellor-search-bar.component';
import { AllocationToolbarTopComponent } from './allocation-toolbar-top/allocation-toolbar-top.component';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    IonicModule,
    AllocationsPageRoutingModule
  ],
  declarations: [
    AllocationsPage,
    ToolbarCustomerComponent,
    FilterComponent,
    CounsellorSearchBarComponent,
    AllocationToolbarTopComponent
  ],
    providers:[CallNumber,CallLog,Device,AndroidPermissions]
  
})
export class AllocationsPageModule {}
