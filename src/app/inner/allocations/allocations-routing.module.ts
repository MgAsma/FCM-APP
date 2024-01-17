import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllocationsPage } from './allocations.page';

const routes: Routes = [
  {
    path: '',
    component: AllocationsPage
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllocationsPageRoutingModule {}
