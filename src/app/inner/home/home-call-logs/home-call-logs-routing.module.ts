import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeCallLogsPage } from './home-call-logs.page';

const routes: Routes = [
  {
    path: '',
    component: HomeCallLogsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeCallLogsPageRoutingModule {}
