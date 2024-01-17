import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarCustomerComponent } from '../../../toolbar-customer/toolbar-customer.component';
import { CustomerDetailsComponent } from '../../customer-details/customer-details.component';
import { FilterComponent } from '../../filter/filter.component';
import { LeadrecurringFollowupComponent } from '../../leadrecurring-followup/leadrecurring-followup.component';
import { NodataComponent } from '../../nodata/nodata.component';
import { OnBreakComponent } from '../../on-break/on-break.component';
import { SearchBarComponent } from '../../search-bar/search-bar.component';
import { ToolbarTopComponent } from '../../toolbar-top/toolbar-top.component';

import {MatListModule} from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { RecurringFollowupComponent } from '../../../inner/home/recurring-followup/recurring-followup.component';

@NgModule({
  declarations: [
    ToolbarTopComponent,
    SearchBarComponent,
    ToolbarCustomerComponent,
    FilterComponent,
    CustomerDetailsComponent,
    LeadrecurringFollowupComponent,
    OnBreakComponent,
    NodataComponent,
    RecurringFollowupComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    IonicModule.forRoot(),
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCardModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule
  ],
  exports:[
    
    LeadrecurringFollowupComponent,
    OnBreakComponent,
    NodataComponent,
    ToolbarTopComponent,
    SearchBarComponent,
    ToolbarCustomerComponent,
    FilterComponent,
    CustomerDetailsComponent,
    LeadrecurringFollowupComponent,
    // RecurringFollowupComponent,
    CommonModule,
    MatInputModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCardModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatPaginatorModule,
   FormsModule,
   ReactiveFormsModule,
    MatListModule
  ],
  
})
export class MaterialModule { }
