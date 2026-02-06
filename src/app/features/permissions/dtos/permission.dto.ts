export class PermissionDto {
  code: string = '';
  name: string = '';
  description?: string = '';
  module?: string = '';

  constructor(init?: Partial<PermissionDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

export class PermissionModuleDto {
  key: string = '';
  label: string = '';
  icon: string = '';
  permissions: PermissionDto[] = [];

  constructor(init?: Partial<PermissionModuleDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

export class RolePermissionsDto {
  code: string = '';
  name: string = '';
  description: string = '';
  permissionCodes: string[] = [];
  publicId: string = '';

  constructor(init?: Partial<RolePermissionsDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
