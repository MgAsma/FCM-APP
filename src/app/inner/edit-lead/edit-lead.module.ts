import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditLeadPageRoutingModule } from './edit-lead-routing.module';
import { EditLeadPage } from './edit-lead.page';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from '../../shared-modules/material/material/material.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditLeadPageRoutingModule,
    MaterialModule,
    MatFormFieldModule
  ],
  declarations: [EditLeadPage]
})
export class EditLeadPageModule {}
