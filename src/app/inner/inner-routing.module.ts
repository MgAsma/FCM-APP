import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InnerPage } from './inner.page';
import { CustomerDetailsComponent } from '../shared-modules/customer-details/customer-details.component';

const routes: Routes = [
  {
    path: '',
    component: InnerPage,
    children:[
    {
      path: 'allocations',
      loadChildren: () => import('./allocations/allocations.module').then( m => m.AllocationsPageModule)
    },
    {
      path:'', redirectTo:'allocations', pathMatch:'full'
    },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
 
  
  {
    path: 'customers',
    loadChildren: () => import('./customers/customers.module').then( m => m.CustomersPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'add-lead',
    loadChildren: () => import('./add-lead/add-lead.module').then( m => m.AddLeadPageModule)
  },
  {
    path:'customer-details', component:CustomerDetailsComponent
  },
  {
    path: 'edit-lead',
    loadChildren: () => import('./edit-lead/edit-lead.module').then( m => m.EditLeadPageModule)
  },
    ]
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InnerPageRoutingModule {}
