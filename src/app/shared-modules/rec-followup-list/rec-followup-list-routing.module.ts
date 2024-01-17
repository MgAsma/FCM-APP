import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecFollowupListPage } from './rec-followup-list.page';

const routes: Routes = [
  {
    path: '',
    component: RecFollowupListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecFollowupListPageRoutingModule {}
