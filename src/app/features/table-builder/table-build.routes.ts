import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { AddNewRowLookupTableComponent } from './pages/add-new-row-lookup-table/add-new-row-lookup-table.component';
import { BuildTableComponent } from './pages/build-table/build-table.component';
import { CreateLookupTableComponent } from './pages/create-lookup-table/create-lookup-table.component';
import { CreateNewIndependentTableComponent } from './pages/create-new-independent-table/create-new-independent-table.component';
import { CreateNewRowInTableComponent } from './pages/create-new-row-in-table/create-new-row-in-table.component';
import { TableLisitngComponent } from './pages/table-lisitng/table-lisitng.component';
import { ViewAllEnumsValuesInTableComponent } from './pages/view-all-enums-values-in-table/view-all-enums-values-in-table.component';
import { ViewAllIndependentTableComponent } from './pages/view-all-independent-table/view-all-independent-table.component';
import { ViewAllLookupEnumsComponent } from './pages/view-all-lookup-enums/view-all-lookup-enums.component';
import { ViewAllLookupTablesComponent } from './pages/view-all-lookup-tables/view-all-lookup-tables.component';
import { ViewAllLookupValuesInTableComponent } from './pages/view-all-lookup-values-in-table/view-all-lookup-values-in-table.component';
import { ViewAllTabsValuesInTableComponent } from './pages/view-all-tabs-values-in-table/view-all-tabs-values-in-table.component';


export const routes: Routes = [
  {
    path: 'table-listing',
    component: TableLisitngComponent
  },
  {
    path: 'build-table',
    component: BuildTableComponent
  },
  {
    path: 'create-lookup-table',
    component: CreateLookupTableComponent
  },
  {
    path: 'add-new-row-lookup-table',
    component: AddNewRowLookupTableComponent
  },
  {
    path: 'add-new-column-lookup-table',
    component: AddNewRowLookupTableComponent
  },
  {
    path: 'create-new-row-in-table',
    component: CreateNewRowInTableComponent
  },
  {
    path: 'edit-new-row-in-table',
    component: AddNewRowLookupTableComponent
  }
  ,
  {
    path: 'create-new-column-in-table',
    component: CreateNewRowInTableComponent
  },
  {
    path: 'view-all-lookup-tables',
    component: ViewAllLookupTablesComponent
  },
  {
    path: 'view-all-lookup-enums',
    component: ViewAllLookupEnumsComponent
  },
  {
    path: 'view-all-independent-tables',
    component: ViewAllIndependentTableComponent
  },
  {
    path: 'create-new-independent-table',
    component: CreateNewIndependentTableComponent
  },
  {
    path: 'view-all-lookup-values-in-table',
    component: ViewAllLookupValuesInTableComponent
  },
  {
    path: 'view-all-enums-values-in-table',
    component: ViewAllEnumsValuesInTableComponent
  },
  {
    path: 'view-all-tabs-values-in-table',
    component: ViewAllTabsValuesInTableComponent
  },


];
