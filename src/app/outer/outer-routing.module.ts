import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OuterPage } from './outer.page';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: '',
    component: OuterPage , children:[
      {
        path:'login', component:LoginComponent
      },
      {
        path:'', redirectTo:'login', pathMatch:'full'
      },
      {
        path:'forgot-password', component:ForgotPasswordComponent
      }
    ]
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OuterPageRoutingModule {}
