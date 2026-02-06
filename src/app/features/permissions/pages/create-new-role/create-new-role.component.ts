import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { PermissionService } from '../../../../core/services/management-services/permission.service';
import { PermissionsService } from '../../services/permissions.service';
import { CreateRoleDto } from '../../dtos/role.dto';

@Component({
  selector: 'app-create-new-role',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-new-role.component.html',
  styleUrl: './create-new-role.component.scss'
})
export class CreateNewRoleComponent {
  code: string = '';
  name: string = '';
  description: string = '';
  permissionCodes: string[] = [];

  expandedModules: { [key: string]: boolean } = {};

  permissionModules: any[] = []

  constructor(
    private loader: LoaderService,
    private permissionsService: PermissionsService,
    private toastr: ToastrService,
    private permissionService: PermissionService,
    private router: Router
  ) {
    this.permissionModules = this.permissionService.permissionModules
    // Set first module (ADMINISTRATION) to be expanded by default
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

  createRole() {
    if (!this.code || !this.name) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    const payload = new CreateRoleDto({
      code: this.code,
      name: this.name,
      description: this.description,
      permissionCodes: this.permissionCodes
    });

    this.loader.show();
    this.permissionsService.createRole(payload).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.toastr.success('Role created successfully!');
        this.router.navigate(['/panel/permissions/view-all-rols']);
      },
      error: (err) => {
        this.loader.hide();
        this.toastr.error('Failed to create role!');
      }
    });
  }

   cancel() {
    this.router.navigate(['/panel/permissions/view-all-rols']); 
  }
}
