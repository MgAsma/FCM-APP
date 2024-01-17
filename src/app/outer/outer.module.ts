import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OuterPageRoutingModule } from './outer-routing.module';

import { OuterPage } from './outer.page';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from '../shared-modules/material/material/material.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OuterPageRoutingModule,
    MaterialModule
  ],
  declarations: [OuterPage,LoginComponent,ForgotPasswordComponent]
})
export class OuterPageModule {}
