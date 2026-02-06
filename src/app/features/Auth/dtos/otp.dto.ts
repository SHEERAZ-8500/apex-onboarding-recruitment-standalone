export class OtpDto {
  preAuthToken: string = '';
  otp: string = '';

  constructor(init?: Partial<OtpDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
