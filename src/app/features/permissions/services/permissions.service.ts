import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateRoleDto, RoleDto, UpdateRoleDto } from '../dtos/role.dto';
import { RolePermissionsDto } from '../dtos/permission.dto';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  constructor(private http: HttpClient) { }

  /**
   * Get all roles
   */
  getAllRoles(): Observable<any> {
    return this.http.get('admin/roles');
  }

  /**
   * Get role permissions by public ID
   */
  getRolePermissions(publicId: string): Observable<any> {
    return this.http.get(`admin/roles/${publicId}`);
  }

  /**
   * Create a new role
   */
  createRole(data: CreateRoleDto): Observable<any> {
    return this.http.post('admin/roles', data);
  }

  /**
   * Update an existing role
   */
  updateRole(publicId: string, data: UpdateRoleDto): Observable<any> {
    return this.http.put(`admin/roles/${publicId}`, data);
  }

  /**
   * Delete a role
   */
  deleteRole(publicId: string): Observable<any> {
    return this.http.delete(`admin/roles/${publicId}`);
  }
}
