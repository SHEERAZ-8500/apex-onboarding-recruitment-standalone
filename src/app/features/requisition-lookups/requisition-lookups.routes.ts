import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateJobTitleComponent } from './create-job-title/create-job-title.component';
import { CreateLoopupEnumsComponent } from './create-loopup-enums/create-loopup-enums.component';


export const routes: Routes = [
  {
    path: 'create-job-title',
    component: CreateJobTitleComponent
  },
  {
    path: 'create-employee-category',
    component: CreateJobTitleComponent
  }, {
    path: 'create-department',
    component: CreateJobTitleComponent
  }, {
    path: 'create-branch',
    component: CreateJobTitleComponent
  },
  {
    path: 'create-lookup-enums',
    component: CreateLoopupEnumsComponent
  }
  ,
  {
    path: 'add-new-enum-value',
    component: CreateLoopupEnumsComponent
  },
  {
    path: 'edit-new-enum-value',
    component: CreateLoopupEnumsComponent
  }
];