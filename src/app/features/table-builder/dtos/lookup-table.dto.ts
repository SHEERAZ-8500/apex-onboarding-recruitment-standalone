export class LookupTableDto {
  code: string = '';
  name: string = '';
  description: string = '';
  status: boolean = true;

  constructor(init?: Partial<LookupTableDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
