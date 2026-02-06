export class IndependentTableDto {
  code: string = '';
  name: string = '';
  description: string = '';
  status: boolean = true;

  constructor(init?: Partial<IndependentTableDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
