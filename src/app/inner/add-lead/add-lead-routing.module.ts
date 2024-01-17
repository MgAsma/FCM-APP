import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddLeadPage } from './add-lead.page';

const routes: Routes = [
  {
    path: '',
    component: AddLeadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddLeadPageRoutingModule {}
