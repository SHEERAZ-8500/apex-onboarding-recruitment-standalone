import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
}
