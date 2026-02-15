import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OnboardingEmployeesListResponseDto } from '../dtos/onboarding-employees-list.dto';
import { OnboardingEmployeeDetailResponseDto } from '../dtos/confirm-onboarding-employee.dto';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  constructor(private http: HttpClient) { }

  // Employee APIs
  getAllEmployees(page = 0, size = 10) {
    return this.http.get(`employees?page=${page}&size=${size}`);
  }

  getEmployeeById(id: string) {
    return this.http.get(`employees/${id}`);
  }

  createEmployee(data: any) {
    return this.http.post('employees', data);
  }

  updateEmployee(id: string, data: any) {
    return this.http.put(`employees/${id}`, data);
  }

  deleteEmployee(id: string) {
    return this.http.delete(`employees/${id}`);
  }

  // Form APIs for Employee Module
  saveFormData(formCode: any, data: any) {
    return this.http.post(`forms/${formCode}`, data);
  }

  updateFormData(formCode: any, code: any, data: any) {
    return this.http.patch(`forms/${formCode}/${code}`, data);
  }

  getFormById(id: any, filter: any = 'ALL') {
    return this.http.get(`forms/${id}?filter=${filter}`);
  }

  getLokupTableByCode(code: any) {
    return this.http.get(`admin/lookups/tables/${code}/values`);
  }

  onboardEmployeeListing(page: number = 0, size: number = 10, employmentStatus: string = 'ONBOARDING'): Observable<OnboardingEmployeesListResponseDto> {
    return this.http.get<OnboardingEmployeesListResponseDto>(`onboarding?page=${page}&size=${size}&employmentStatus=${employmentStatus}`);
  }

  getOnboardingEmployeeById(formCode: string, code: string): Observable<OnboardingEmployeeDetailResponseDto> {
    return this.http.get<OnboardingEmployeeDetailResponseDto>(`forms/${formCode}/by-code/${code}`);
  }
  getLookupEnumByCode(code: any) {
    return this.http.get(`admin/lookups/enums/${code}`);
  }
  startOnboardingEmployee(employeePublicId: string) {
    return this.http.post(`onboarding/${employeePublicId}/start`,{});
  }
  addEmployee(formcode:string,code:string,data: any) {
    return this.http.patch(`forms/${formcode}/${code}`, data);
  }
  confirmOnboardingEmployee(employeePublicId: string) {
    return this.http.post(`onboarding/${employeePublicId}/complete`, {});
  }
}
