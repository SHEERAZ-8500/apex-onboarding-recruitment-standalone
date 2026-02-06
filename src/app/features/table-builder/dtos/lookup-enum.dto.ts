export class LookupEnumDto {
  code: string = '';
  name: string = '';
  description: string = '';
  status: boolean = true;

  constructor(init?: Partial<LookupEnumDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
