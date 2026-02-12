export class CandidateDto {
  code: number | null = null;
  first_name: string = '';
  last_name: string = '';
  requisition: string = '';
  email: string = '';
  contact_number1: string = '';
  contact_number2: string = '';
  application_date: Date | null = null;
  // department: string = '';
  designation: string = '';
  expected_doj: Date | null = null;
  gender: string = '';
  linkedin_url: string = '';
  religion: string = '';
  country: string = '';
  city: string = '';
  // category: string = '';
  onboarding_status: string = 'IN_PROGRESS';
  status: string = 'APPLIED';
  remarks: string = '';
  is_active: boolean = true;


  constructor(init?: Partial<CandidateDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
