import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InnerPageRoutingModule } from './inner-routing.module';

import { InnerPage } from './inner.page';
import { MaterialModule } from '../shared-modules/material/material/material.module';
// import { CallLog } from '@ionic-native/call-log';
import { CallNumber } from '@ionic-native/call-number/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InnerPageRoutingModule,
    MaterialModule
  ],
  declarations: [InnerPage],
  providers:[CallNumber]
  
})
export class InnerPageModule {}
