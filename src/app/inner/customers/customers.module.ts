import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomersPageRoutingModule } from './customers-routing.module';

import { CustomersPage } from './customers.page';
import { CustomerToolbarCounsellorComponent } from './customer-toolbar-counsellor/customer-toolbar-counsellor.component';
import { CustomerFilterComponent } from './customer-filter/customer-filter.component';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { CallLog } from '@ionic-native/call-log/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Device } from '@ionic-native/device/ngx';
import { MaterialModule } from '../../shared-modules/material/material/material.module';
import { CustomerToolbarSearchComponent } from './customer-toolbar-counsellor/customer-toolbar-search/customer-toolbar-search.component';
import { CustomerToolbarTopComponent } from './customer-toolbar-top/customer-toolbar-top.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomersPageRoutingModule,
    MaterialModule
  ],

  declarations: [
    CustomersPage,
    CustomerToolbarTopComponent,
    CustomerToolbarCounsellorComponent,
    CustomerFilterComponent,
    CustomerToolbarSearchComponent,
    ],
    providers:[CallNumber,CallLog,Device,AndroidPermissions]
  
})
export class CustomersPageModule {}
