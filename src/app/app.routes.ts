import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
;

import { LayOutTwoComponent } from './shared/components/layouts/lay-out-two/lay-out-two.component';
import { LayOutOneComponent } from './shared/components/layouts/lay-out-one/lay-out-one.component';


export const routes: Routes = [
  { path: '', redirectTo: 'log-in', pathMatch: 'full' },
  {
    path: 'panel', component: LayOutOneComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard-routes').then(m => m.routes) },


     
        { path: 'inventory-units', loadChildren: () => import('./features/Inventory Units/units-routes').then(m => m.routes) },
                { path: 'booking-approvals', loadChildren: () => import('./features/booking-approvals/booking-app-routes').then(m => m.routes) },






    ]
  },
  { path: '', loadChildren: () => import('../app/features/Auth/auth-routes').then(m => m.routes) },



];


