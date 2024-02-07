import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { FollowUpsComponent } from './follow-ups/follow-ups.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'home-call-logs',
    loadChildren: () => import('./home-call-logs/home-call-logs.module').then( m => m.HomeCallLogsPageModule)
  },
  {
    path:'follow-ups', component:FollowUpsComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
