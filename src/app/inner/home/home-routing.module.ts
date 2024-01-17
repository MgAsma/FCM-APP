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
    path: 'call-log',
    loadChildren: () => import('./call-log/call-log.module').then( m => m.CallLogPageModule)
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
