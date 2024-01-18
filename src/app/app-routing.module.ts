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
  // {
  //   path: 'account',
  //   loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule)
  // },
  // {
  //   path: 'support',
  //   loadChildren: () => import('./pages/support/support.module').then(m => m.SupportModule)
  // },
  
  // {
  //   path: 'app',
  //   loadChildren: () => import('./pages/tabs-page/tabs-page.module').then(m => m.TabsModule)
  // },
  // {
  //   path: 'tutorial',
  //   loadChildren: () => import('./pages/tutorial/tutorial.module').then(m => m.TutorialModule),
  //   canMatch: [checkTutorialGuard]
  // },
  {
    path:'inner', loadChildren:()=>import('./inner/inner.module').then(m=>m.InnerPageModule)
  },
  {
    path: 'rec-followup-list',
    loadChildren: () => import('./shared-modules/rec-followup-list/rec-followup-list.module').then( m => m.RecFollowupListPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
