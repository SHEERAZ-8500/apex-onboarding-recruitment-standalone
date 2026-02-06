export class LoginDto {
  email: string = '';
  password: string = '';

  constructor(init?: Partial<LoginDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
