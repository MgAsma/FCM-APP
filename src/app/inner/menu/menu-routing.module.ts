import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage
  },
  {
    path: 'team-live-status',
    loadChildren: () => import('./team-live-status/team-live-status.module').then( m => m.TeamLiveStatusPageModule)
  },
  {
    path:'call-log',
    loadChildren:() => import('./call-log/call-log.module').then(m =>m.CallLogPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
