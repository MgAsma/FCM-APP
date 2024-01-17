import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeamLiveStatusPage } from './team-live-status.page';

const routes: Routes = [
  {
    path: '',
    component: TeamLiveStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamLiveStatusPageRoutingModule {}
