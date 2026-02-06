import { Routes } from '@angular/router';
import { LogInComponent } from './pages/log-in/log-in.component';
import { ResetPagesComponent } from './pages/reset-pages/reset-pages.component';

export const routes: Routes = [
  {
    path: '',
    component: LogInComponent
  },
  {
    path: 'otp-reset',
    component: ResetPagesComponent
  },
  {
    path: 'verify-otp/:token',
    component: ResetPagesComponent
  },
  {
    path: 'reset-password',
    component: ResetPagesComponent
  },
  {
    path: 'password/reset',
    component: ResetPagesComponent
  }
  ,
  {
    path: 'invite/complete',
    component: ResetPagesComponent
  }
];

