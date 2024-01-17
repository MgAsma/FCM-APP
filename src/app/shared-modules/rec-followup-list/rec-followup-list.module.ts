import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecFollowupListPageRoutingModule } from './rec-followup-list-routing.module';

import { RecFollowupListPage } from './rec-followup-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecFollowupListPageRoutingModule
  ],
  declarations: [RecFollowupListPage]
})
export class RecFollowupListPageModule {}
