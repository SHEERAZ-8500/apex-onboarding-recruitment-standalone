export class CreateFormDto {
  name: string = '';
  code: string = '';
  formCode: string = '';
  displayName: string = '';
  status: string = 'ACTIVE';
  
  constructor(init?: Partial<CreateFormDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

