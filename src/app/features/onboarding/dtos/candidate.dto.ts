export class CandidateDto {
  publicId: string = "";
  public_id: string = '';
  code: string = "";
  firstName: string = "";
  lastName: string = "";
  first_name: string = "";
  last_name: string = "";
  email: string = "";
  status:string =  '';
  selected?: boolean;
  requisition_code?: string = '';
  designation?: string = '';
  city: string = '';
  country: string = '';
  gender: string = '';
  religion: string = '';
  onboarding_status: string = '';
  contact_number1: string = '';
  contact_number2: string = '';
  application_date: string = '';
  expected_doj: string = '';
  linkedin_url: string = '';

  constructor(init?: Partial<CandidateDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
