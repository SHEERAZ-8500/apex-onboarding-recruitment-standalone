import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequisitionLookupsService {
  constructor(private http: HttpClient) { }

  // Requisition Lookups APIs
  createJobTitle(data: any) {
    return this.http.post('job-titles', data);
  }

  createEmployeeCategories(data: any) {
    return this.http.post('employee-categories', data);
  }

  createDepartment(data: any) {
    return this.http.post('departments', data);
  }

  createBranch(data: any) {
    return this.http.post('branches', data);
  }
}
