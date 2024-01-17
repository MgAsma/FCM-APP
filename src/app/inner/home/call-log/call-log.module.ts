import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CallLogPageRoutingModule } from './call-log-routing.module';

import { CallLogPage } from './call-log.page';
import { MaterialModule } from '../../../shared-modules/material/material/material.module';

// import { CallLog, CallLogObject } from '@ionic-native/call-log/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CallLogPageRoutingModule,
    MaterialModule
  ],
  declarations: [CallLogPage],
  // providers:[CallLog]
})
export class CallLogPageModule {}
