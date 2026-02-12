import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { OfferCardComponent } from './shared/components/offer-card/offer-card.component';
// import { OffersComponent } from './features/offers/offers.component';
// import { ContactComponent } from './features/contact/contact.component';
// import { EmployesComponent } from './features/employes/employes.component';
// import { JobsComponent } from './features/jobs/jobs.component';

import { LayOutTwoComponent } from './shared/components/layouts/lay-out-two/lay-out-two.component';
import { LayOutOneComponent } from './shared/components/layouts/lay-out-one/lay-out-one.component';

// import { ViewAllFormSubmissionsComponent } from './view-all-form-submissions/view-all-form-submissions.component';

// import { ViewAllNotificationsComponent } from './view-all-notifications/view-all-notifications.component';

export const routes: Routes = [
  { path: '', redirectTo: 'log-in', pathMatch: 'full' },
  {
    path: 'panel', component: LayOutOneComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard-routes').then(m => m.routes) },

      //   { path: 'offers', component: OffersComponent },
      //   { path: 'contact', component: ContactComponent },

      //   { path: 'employes', component: EmployesComponent },
      //   { path: 'jobs-details', component: JobsComponent },
      //   { path: 'view-all-submissions/:id', component: ViewAllFormSubmissionsComponent },
      //   { path: 'view-all-notifications', component: ViewAllNotificationsComponent },
      { path: 'table', loadChildren: () => import('../app/features/table-builder/table-build.routes').then(m => m.routes) },
      //   { path: 'assesment', loadChildren: () => import('./modules/assessments/assesment.module').then(m => m.AssesmentModule) },
      //   { path: 'chat', loadChildren: () => import('./features/chatting/chat.module').then(m => m.ChatModule) },

      //   { path: 'email', loadChildren: () => import('./features/emails/email.module').then(m => m.EmailModule) },
      //   { path: 'general-master-data', loadChildren: () => import('./modules/general-master-data/general-master-data.module').then(m => m.GeneralMasterDataModule) },

      { path: 'admin', loadChildren: () => import('../app/features/admin/admin.routes').then(m => m.routes) },

        { path: 'permissions', loadChildren: () => import('../app/features/permissions/permissions.routes').then(m => m.routes) },

      { path: 'requisition-lookups', loadChildren: () => import('../app/features/requisition-lookups/requisition-lookups.routes').then(m => m.routes) },
      //   { path: 'organizational-master-data', loadChildren: () => import('./modules/organizational-master-data/organizational-master-data.module').then(m => m.OrganizationalMasterDataModule) },
      //   { path: 'out-sourcing-master-data', loadChildren: () => import('./modules/out-sorucing-master-data/out-sourcing-master-data.module').then(m => m.OutSourcingMasterDataModule) },
        { path: 'employees-master-data', loadChildren: () => import('../app/features/employees/employees.routes').then(m => m.routes) },
      { path: 'forms', loadChildren: () => import('../app/features/forms/forms.routes').then(m => m.routes) },
      { path: 'onboarding', loadChildren: () => import('../app/features/onboarding/onboarding.routes').then(m => m.routes) },
      {path: 'master-data', loadChildren: () => import('../app/features/master-data-forms/master-data.routes').then(m => m.routes)}



    ]
  },
  { path: '', loadChildren: () => import('../app/features/Auth/auth-routes').then(m => m.routes) },



];


