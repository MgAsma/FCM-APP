import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeamLiveStatusPageRoutingModule } from './team-live-status-routing.module';

import { TeamLiveStatusPage } from './team-live-status.page';
import { MaterialModule } from '../../../shared-modules/material/material/material.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeamLiveStatusPageRoutingModule,
    MaterialModule
  ],
  declarations: [TeamLiveStatusPage]
})
export class TeamLiveStatusPageModule {}
