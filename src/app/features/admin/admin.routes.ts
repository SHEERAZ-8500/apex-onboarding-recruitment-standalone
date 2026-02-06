import { Routes } from "@angular/router";
import { CreateNewUserComponent } from "./pages/create-new-user/create-new-user.component";
import { ViewAllUsersComponent } from "./pages/view-all-users/view-all-users.component";

export const routes: Routes = [
  {
    path: 'create-new-user',
    component: CreateNewUserComponent
  },
    {
    path: 'view-all-users',
    component: ViewAllUsersComponent
  }
];


