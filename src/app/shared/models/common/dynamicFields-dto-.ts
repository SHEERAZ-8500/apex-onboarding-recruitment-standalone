export class DynamicFieldDto {
  fieldCode: string = '';
  label: string = '';
  fieldType: string = '';
  systemDefined: boolean = false;
  createdDate: string = '';
  lookupTable: string = '';
  nullable: boolean = true;
  displayOrder: number = 0;
  required: boolean = false;
  linkedComponent: string = '';
  active: boolean = true;
  dbColumnName: string = '';
  maxLength: number | null = null;
  enumClass: string = '';
  enumValues: string[] = [];
  rowColumns: any[] = [];

  // UI state properties
  isDropdownOpen?: boolean = false;
  options?: any[] = [];
  optionsLoaded?: boolean = false;

  constructor(init?: Partial<DynamicFieldDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}