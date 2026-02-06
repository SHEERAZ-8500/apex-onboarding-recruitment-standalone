export class RoleDto {
  code: string = '';
  name: string = '';
  description?: string = '';
  publicId?: string = '';

  constructor(init?: Partial<RoleDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
