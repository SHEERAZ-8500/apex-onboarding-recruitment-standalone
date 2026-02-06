export class ResetPasswordDto {
  email?: string = '';
  token?: string = '';
  password?: string = '';
  confirmPassword?: string = '';

  constructor(init?: Partial<ResetPasswordDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
