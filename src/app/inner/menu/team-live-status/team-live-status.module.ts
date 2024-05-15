import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeamLiveStatusPageRoutingModule } from './team-live-status-routing.module';

import { TeamLiveStatusPage } from './team-live-status.page';
import { MaterialModule } from '../../../shared-modules/material/material/material.module';
import { FilterComponent } from './filter/filter.component';
import { ToolbarCustomerComponent } from './toolbar-customer/toolbar-customer.component';
import { ToolbarTopComponent } from './toolbar-top/toolbar-top.component';
import { TlsToolbarSearchComponent } from './toolbar-customer/tls-toolbar-search/tls-toolbar-search.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeamLiveStatusPageRoutingModule,
    MaterialModule
  ],
  declarations: [
    TeamLiveStatusPage,
    FilterComponent,
    ToolbarCustomerComponent,
    ToolbarTopComponent,
    TlsToolbarSearchComponent
  ]
})
export class TeamLiveStatusPageModule {}
