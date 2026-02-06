import { Routes } from '@angular/router';
import { ViewUserPermissionsComponent } from './pages/view-user-permissions/view-user-permissions.component';
import { ViewAllRolsComponent } from './pages/view-all-rols/view-all-rols.component';
import { CreateNewRoleComponent } from './pages/create-new-role/create-new-role.component';

export const routes: Routes = [
  {
    path: 'view-permissions',
    component: ViewUserPermissionsComponent
  },
  {
    path: 'view-all-rols',
    component: ViewAllRolsComponent
  },
  {
    path: 'create-new-role',
    component: CreateNewRoleComponent
  }
];
