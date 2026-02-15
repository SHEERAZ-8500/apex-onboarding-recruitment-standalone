import { Routes } from "@angular/router";
import { EmployeesComponent } from "./pages/employees/employees.component";
import { OnbaordingEmployeesList } from "./pages/onbaording-employees-list/onbaording-employees-list";
import { ConfirmOnboardingEmployee } from "./pages/confirm-onboarding-employee/confirm-onboarding-employee";


export const routes: Routes = [
  {
    path: 'view-all-employees',
    component: EmployeesComponent , data: { title: 'view' }
  }, 
  {
    path: 'create-new-employees',
    component: EmployeesComponent , data: { title: 'create' }
  }, 
  {
    path: 'edit-employees',
    component: EmployeesComponent , data: { title: 'edit' }
  }
  , 
  {
    path: 'onboarding-employees',
    component: OnbaordingEmployeesList 
  }  , 
  {
    path: 'confirm-onboarding-employee',
    component: ConfirmOnboardingEmployee 
  }
];
