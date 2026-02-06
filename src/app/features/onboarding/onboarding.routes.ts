import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateScreeningComponent } from './pages/candidate-screening/candidate-screening.component';
import { CandidatesComponent } from './pages/candidates/candidates.component';
import { FinalScreeningComponent } from './pages/final-screening/final-screening.component';
import { HrCandidateShortListingComponent } from './pages/hr-candidate-short-listing/hr-candidate-short-listing.component';
import { InterviewFeedbackComponent } from './pages/interview-feedback/interview-feedback.component';
import { InterviewSchedulingComponent } from './pages/interview-scheduling/interview-scheduling.component';
import { RequisitionComponent } from './pages/requisition/requisition.component';


export const routes: Routes = [
  {
    path: 'view-all-requisition',
    component: RequisitionComponent, data: { title: 'view' }
  },
  {
    path: 'create-new-requisition',
    component: RequisitionComponent, data: { title: 'create' }
  },
  {
    path: 'edit-requisition',
    component: RequisitionComponent, data: { title: 'edit' }
  },

  {
    path: 'view-all-candidates',
    component: CandidatesComponent, data: { title: 'view' }
  },
   {
    path: 'create-new-candidates',
    component: CandidatesComponent, data: { title: 'create' }
  },
   {
    path: 'edit-candidates',
    component: CandidatesComponent, data: { title: 'edit' }
  },
  {
    path: 'create-new-interview-scheduling',
    component: InterviewSchedulingComponent, data: { title: 'create' }
  },
  {
    path: 'edit-interview-scheduling',
    component: InterviewSchedulingComponent, data: { title: 'edit' }
  },
  {
    path: 'view-all-interview-scheduling',
    component: InterviewSchedulingComponent, data: { title: 'view' }
  },
  {
    path: 'final-screening',
    component: FinalScreeningComponent
  }
  ,
  {
    path: 'candidate-screening',
    component: CandidateScreeningComponent
  } ,
  {
    path: 'hr-candidate-short-listing',
    component: HrCandidateShortListingComponent
  }
   ,
  {
    path: 'interview-feedback',
    component: InterviewFeedbackComponent
  }
];


