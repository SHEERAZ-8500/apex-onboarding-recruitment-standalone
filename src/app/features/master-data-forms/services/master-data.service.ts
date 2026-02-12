import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  constructor(private http: HttpClient) { }

 getAllDepartmentValuesInTable(department: string, page = 0, size = 50) {
    return this.http.get(`admin/lookups/tables/${department}/values?page=${page}&size=${size}`);
  }
    getAllDesignationValuesInTable(designation: string, page = 0, size = 50) {
    return this.http.get(`admin/lookups/tables/${designation}/values?page=${page}&size=${size}`);
  }
  getAllJobTitleValuesInTable(job_title: string, page = 0, size = 50) {
    return this.http.get(`admin/lookups/tables/${job_title}/values?page=${page}&size=${size}`);
  }


}
