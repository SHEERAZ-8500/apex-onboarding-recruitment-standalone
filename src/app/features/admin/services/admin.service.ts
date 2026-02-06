import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) { }

  // Admin APIs
  createNewUser(data: any) {
    return this.http.post('admin/users', data);
  }

  getAllRolls() {
    return this.http.get(`admin/roles`);
  }

  getUserRolePermissions(publicId: any) {
    return this.http.get(`admin/roles/${publicId}`);
  }

  getAllUser() {
    return this.http.get('admin/users');
  }

  getUserAllroles() {
    return this.http.get(`admin/roles`);
  }

  createNewRole(data: any) {
    return this.http.post('admin/roles', data);
  }
}
