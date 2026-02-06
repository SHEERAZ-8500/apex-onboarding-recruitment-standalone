export class UserDto {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  roleCode: string = '';
  address: string = '';
  publicId?: string = '';

  constructor(init?: Partial<UserDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
