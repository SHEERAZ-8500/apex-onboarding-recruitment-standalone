import { Routes } from "@angular/router";
import { EmployeesComponent } from "./pages/employees/employees.component";


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
];
