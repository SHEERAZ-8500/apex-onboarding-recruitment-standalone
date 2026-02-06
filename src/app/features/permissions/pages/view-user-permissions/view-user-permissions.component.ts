import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { PermissionService } from '../../../../core/services/management-services/permission.service';
import { PermissionsService } from '../../services/permissions.service';
import { UpdateRoleDto } from '../../dtos/role.dto';
import { PaginationComponent } from '../../../../shared/components/commons/components/pagination/pagination.component';

@Component({
  selector: 'app-view-user-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule,PaginationComponent],
  templateUrl: './view-user-permissions.component.html',
  styleUrl: './view-user-permissions.component.scss'
})
export class ViewUserPermissionsComponent {
  code: string = '';
  name: string = '';
  description: string = '';
  permissionCodes: string[] = [];
  publicId: string = '';
  expandedModules: { [key: string]: boolean } = {};

  permissionModules: any[] = []

  constructor(
    private loader: LoaderService,
    private permissionsService: PermissionsService,
    private toastr: ToastrService,
    private permissionService: PermissionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.permissionModules = this.permissionService.permissionModules
        if (this.permissionModules.length > 0) {
      this.expandedModules[this.permissionModules[0].key] = true;
    }
  }

  toggleModule(moduleKey: string) {
    this.expandedModules[moduleKey] = !this.expandedModules[moduleKey];
  }

  isPermissionSelected(code: string): boolean {
    return this.permissionCodes.includes(code);
  }

  togglePermission(code: string) {
    const index = this.permissionCodes.indexOf(code);
    if (index > -1) {
      this.permissionCodes.splice(index, 1);
    } else {
      this.permissionCodes.push(code);
    }
  }

  getSelectedCount(moduleKey: string): number {
    const module = this.permissionModules.find(m => m.key === moduleKey);
    if (!module) return 0;
    return module.permissions.filter((p: any) => this.permissionCodes.includes(p.code)).length;
  }

  updateRole() {
    if (!this.code || !this.name) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    const payload = new UpdateRoleDto({
      code: this.code,
      name: this.name,
      description: this.description,
      permissionCodes: this.permissionCodes
    });

    this.loader.show();
    this.permissionsService.updateRole(this.publicId, payload).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.toastr.success('Role updated successfully!');
        this.router.navigate(['/panel/permissions/view-all-rols']);
      },
      error: (err) => {
        this.loader.hide();
        this.toastr.error('Failed to update role!');
      }
    });
  }

  ngOnInit(): void {
    this.publicId = this.route.snapshot.queryParamMap.get('publicId') || '';
    this.getUserPermissions();


  }
  getUserPermissions() {
    this.loader.show();

    this.permissionsService.getRolePermissions(this.publicId).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.code = res.data.code;
        this.name = res.data.name;
        this.description = res.data.description;
        this.permissionCodes = res.data.permissionCodes || [];
      },
      error: (err: any) => {
        this.loader.hide();
        this.toastr.error('Failed to load role permissions', 'Error');
      }
    });
  }


    // Cancel
  onCancel(): void {
    this.router.navigate(['/panel/permissions/view-all-rols']);

  }
}
