export class RequisitionLookupDto {
  code: string = '';
  name: string = '';
  description: string = '';
  status: boolean = true;
  internetAddress: string = '';
  emailAddress: string = '';
  telephone: string = '';

  constructor(init?: Partial<RequisitionLookupDto>) {
    Object.assign(this, init);
  }
}
