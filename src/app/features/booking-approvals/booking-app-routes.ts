import { Routes } from '@angular/router';
import { BookingApproval } from './booking-approval/booking-approval';
import { AdminDiscountsComponent } from './admin-discounts/admin-discounts';
import { AdminInstallments } from './admin-installments/admin-installments';



export const routes: Routes = [
  {
    path: 'booking-approvals',
    component: BookingApproval
  },
  {
    path: 'admin-discounts',
    component: AdminDiscountsComponent
  },
   {
    path: 'admin-installments',
    component: AdminInstallments
  },
    


];
