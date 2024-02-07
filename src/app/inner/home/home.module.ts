import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { FilterComponent } from './filter/filter.component';
import { InboundComponent } from './inbound/inbound.component';
import { OutboundComponent } from './outbound/outbound.component';
import { TimeListComponent } from './time-list/time-list.component';
import { StatusComponent } from './status/status.component';

import { OpenFollowupsComponent } from './open-followups/open-followups.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { StartBreakComponent } from './start-break/start-break.component';
//import { GotoViewCustomerDetailsCallCustomerComponent } from './goto-view-customer-details-call-customer/goto-view-customer-details-call-customer.component';
import { FollowUpsComponent } from './follow-ups/follow-ups.component';

import { CallLog } from '@ionic-native/call-log/ngx';
import { Device } from '@ionic-native/device/ngx'
import { CallNumber } from '@ionic-native/call-number/ngx';
import { MaterialModule } from '../../shared-modules/material/material/material.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MaterialModule
  ],
  declarations: [
    HomePage,
    FilterComponent,
    InboundComponent,
    OutboundComponent,
    TimeListComponent,
    StatusComponent,
    OpenFollowupsComponent, 
    CheckoutComponent,
    StartBreakComponent,
    // GotoViewCustomerDetailsCallCustomerComponent,
  FollowUpsComponent],
  providers:[CallLog,Device,CallNumber]
})
export class HomePageModule {}
