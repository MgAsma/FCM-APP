import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerDetailsComponent } from '../../customer-details/customer-details.component';
import { LeadrecurringFollowupComponent } from '../../leadrecurring-followup/leadrecurring-followup.component';
import { NodataComponent } from '../../nodata/nodata.component';
import { OnBreakComponent } from '../../on-break/on-break.component';
import { SearchBarComponent } from '../../search-bar/search-bar.component';
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
import { MeetingComponent } from '../../meeting/meeting.component';
import { FormSpaceDirective } from '../../form-space.directive';
import { GotoViewCustomerDetailsCallCustomerComponent } from '../../goto-view-customer-details-call-customer/goto-view-customer-details-call-customer.component';
import { CallLog } from '@ionic-native/call-log/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Device } from '@ionic-native/device/ngx';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
@NgModule({
  declarations: [
    // ToolbarTopComponent,
    SearchBarComponent,
    CustomerDetailsComponent,
    LeadrecurringFollowupComponent,
    OnBreakComponent,
    NodataComponent,
    RecurringFollowupComponent,
    MeetingComponent,
    FormSpaceDirective,
    GotoViewCustomerDetailsCallCustomerComponent
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
    MatListModule,
    NgMultiSelectDropDownModule,
  ],
  exports:[
    LeadrecurringFollowupComponent,
    OnBreakComponent,
    NodataComponent,
    SearchBarComponent,
    MeetingComponent,
    CustomerDetailsComponent,
    LeadrecurringFollowupComponent,
    RecurringFollowupComponent,
    GotoViewCustomerDetailsCallCustomerComponent,
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
    MatListModule,
    FormSpaceDirective,
    NgMultiSelectDropDownModule
  ],
  providers:[CallLog,Device,CallNumber]
  
})
export class MaterialModule { }
