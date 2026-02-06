export class RequisitionDto {
  requisition_name: string = '';
  department: string = '';
  job_title: string = '';
  designation: string = '';
  required_count: number | null = null;
  required_date: string = '';
  job_description: string = '';
  hiring_manager: string = '';
  is_active: boolean = false;

  constructor(init?: Partial<RequisitionDto>) {
    Object.assign(this, init);
  }
}
