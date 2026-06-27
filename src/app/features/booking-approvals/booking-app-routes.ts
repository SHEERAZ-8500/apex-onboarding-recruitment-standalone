import { Routes } from '@angular/router';
import { BookingApproval } from './booking-approval/booking-approval';
import { AdminDiscountsComponent } from './admin-discounts/admin-discounts';
import { AdminInstallments } from './admin-installments/admin-installments';
import { UnitHoldBooking } from './unit-hold-booking/unit-hold-booking';
import { MyBookings } from './my-bookings/my-bookings';
import { DiscountPanel } from './discount-panel/discount-panel';



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
    path: 'unit-hold-booking',
    component: UnitHoldBooking
  },
   {
    path: 'my-bookings',
    component: MyBookings
  },
   {
    path: 'discount-panel',
    component: DiscountPanel
  },
    
    


];
