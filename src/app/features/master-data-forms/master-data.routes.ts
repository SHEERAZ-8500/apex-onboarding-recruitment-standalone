import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobTitle } from './pages/job-title/job-title';
import { Designation } from './pages/designation/designation';
import { LeaveApplication } from './pages/leave-application/leave-application';
import { LeavesMasterData } from '../forms/pages/leaves-master-data/leaves-master-data';
import { Department } from './pages/department/department';
import { WorkSchedule } from './pages/work-schedule/work-schedule';
import { Shift } from './pages/shift/shift';
import { PayPeriod } from './pages/pay-period/pay-period';



export const routes: Routes = [
 {path: 'pay-period', component: PayPeriod},
  {path: 'shift', component: Shift},
  {path: 'work-schedule', component: WorkSchedule},
  {path: 'leave-application', component: LeaveApplication},
  {path: 'leaves-master-data', component: LeavesMasterData},
  {path: 'department', component: Department},
  {path: 'designation', component: Designation},
  {path: 'job-title', component: JobTitle} 
 
];


