export class EmployeeDto {
  publicId?: string = '';
  code?: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber?: string = '';
  department?: string = '';
  designation?: string = '';
  status?: string = 'ACTIVE';

  constructor(init?: Partial<EmployeeDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
