export class CreateColumnDto {
  name: string = '';
  label: string = '';
  columnName: string = '';
  dataType: string = '';
  type: string = '';
  required: boolean = false;
  maxLength!: number ;
  length!: number;
  precision!: number;
  scale!: number;
  displayOrder!: number;
  nullable: boolean = true;
  defaultValue: string = '';
  active: boolean = false;
  lookupComponentCode: string = '';
  constructor(init?: Partial<CreateColumnDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
