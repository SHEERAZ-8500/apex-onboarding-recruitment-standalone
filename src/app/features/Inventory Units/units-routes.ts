import { Routes } from '@angular/router';
import { ViewUnits } from './view-units/view-units';
import { CreateUnit } from './create-unit/create-unit';


export const routes: Routes = [
  {
    path: 'view-units',
    component: ViewUnits
  },
    {
    path: 'create-unit',
    component: CreateUnit
  },
     {
    path: 'create-unit/:id',
    component: CreateUnit
  }


];

