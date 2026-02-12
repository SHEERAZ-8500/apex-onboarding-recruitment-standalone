import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { CreateNewFormComponent } from './pages/create-new-form/create-new-form.component';
import { CreateNewRowComponent } from './pages/create-new-row/create-new-row.component';
import { CreateNewUdfComponent } from './pages/create-new-udf/create-new-udf.component';
import { CreateUddComponent } from './pages/create-udd/create-udd.component';
import { ManageFiledsVisibilityComponent } from './pages/manage-fileds-visibility/manage-fileds-visibility.component';
import { ViewAllFormsComponent } from './pages/view-all-forms/view-all-forms.component';
import { PayPeriod } from '../master-data-forms/pages/pay-period/pay-period';
import { Shift} from  '../master-data-forms/pages/shift/shift';
import { WorkSchedule } from '../master-data-forms/pages/work-schedule/work-schedule';
import { LeaveApplication } from '../master-data-forms/pages/leave-application/leave-application';
import { LeavesMasterData } from './pages/leaves-master-data/leaves-master-data';
import { Department } from '../master-data-forms/pages/department/department';
import { Designation } from '../master-data-forms/pages/designation/designation';
import { JobTitle } from '../master-data-forms/pages/job-title/job-title';
export const routes: Routes = [
  {
    path: 'view-all-forms',
    component: ViewAllFormsComponent
  },
  {
    path: 'create-new-udf',
    component: CreateNewUdfComponent
  },
  {
    path: 'create-new-udd',
    component: CreateUddComponent
  }

  ,
  {
    path: 'manage-fields-visibility',
    component: ManageFiledsVisibilityComponent
  }
  ,
  {
    path: 'create-new-tabs-row',
    component: CreateNewRowComponent
  },
  {
    path: 'create-new-form',
    component: CreateNewFormComponent
  }
  
  
]
