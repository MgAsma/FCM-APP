import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { checkTutorialGuard } from './providers/check-tutorial.guard';

const routes: Routes = [
  {
    path: 'outer',
    loadChildren: () => import('./outer/outer.module').then( m => m.OuterPageModule)
  },
  {
    path: '',
    redirectTo: 'outer',
    pathMatch: 'full'
  },
  
  {
    path:'inner', loadChildren:()=>import('./inner/inner.module').then(m=>m.InnerPageModule)
  },
  {
    path: 'rec-followup-list',
    loadChildren: () => import('./shared-modules/rec-followup-list/rec-followup-list.module').then( m => m.RecFollowupListPageModule)
  },
  


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
