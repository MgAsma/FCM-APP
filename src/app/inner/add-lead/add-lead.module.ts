import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddLeadPageRoutingModule } from './add-lead-routing.module';

import { AddLeadPage } from './add-lead.page';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from '../../shared-modules/material/material/material.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    AddLeadPageRoutingModule,
    MaterialModule,
    MatFormFieldModule,
    MatFormFieldModule
  ],
  declarations: [AddLeadPage]
})
export class AddLeadPageModule {}
