export class RoleDto {
  code: string = '';
  name: string = '';
  description?: string = '';
  publicId?: string = '';
  permissionCodes?: string[] = [];

  constructor(init?: Partial<RoleDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

export class CreateRoleDto {
  code: string = '';
  name: string = '';
  description: string = '';
  permissionCodes: string[] = [];

  constructor(init?: Partial<CreateRoleDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

export class UpdateRoleDto {
  code: string = '';
  name: string = '';
  description: string = '';
  permissionCodes: string[] = [];

  constructor(init?: Partial<UpdateRoleDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
