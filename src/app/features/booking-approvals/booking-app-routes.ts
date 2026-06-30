import { Routes } from '@angular/router';
import { BookingApproval } from './booking-approval/booking-approval';
import { AdminDiscountsComponent } from './admin-discounts/admin-discounts';
import { AdminInstallments } from './admin-installments/admin-installments';
import { AdminBookingsAcceptance } from './admin-bookings-acceptance/admin-bookings-acceptance';



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
   {
    path: 'create-installments',
    component: AdminBookingsAcceptance
  },

    
    


];
