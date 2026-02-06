export class FormDto {
  formCode!: string;
  displayName!: string;
  systemDefined!: boolean;
  status!: string;
  
  constructor(data?: Partial<FormDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
