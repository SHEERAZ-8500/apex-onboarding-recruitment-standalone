import { Routes } from '@angular/router';
import { ProfileView } from './my-profile/my-profile';
import { ProfileEdit } from './profile-edit/profile-edit';


export const routes: Routes = [
 {
    path: 'view-profile',
    component: ProfileView
  },
    {
    path: 'edit-profile',
    component: ProfileEdit
  }


];

