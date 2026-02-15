export class OnboardingEmployeeDataDto {
  onboarding_status: string = '';
  job_title: string = '';
  department: string = '';
  employment_status: string = '';
  remarks: string = '';
  date_of_joining: string = '';
  email: string = '';
  full_name: string = '';
  code: string = '';
  is_active: boolean = true;

  constructor(init?: Partial<OnboardingEmployeeDataDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

export class OnboardingEmployeeDetailDto {
  publicId: string = '';
  code: string = '';
  data: OnboardingEmployeeDataDto = new OnboardingEmployeeDataDto();

  constructor(init?: Partial<OnboardingEmployeeDetailDto>) {
    if (init) {
      Object.assign(this, init);
      if (init.data) {
        this.data = new OnboardingEmployeeDataDto(init.data);
      }
    }
  }
}

export class OnboardingEmployeeDetailResponseDto {
  success: boolean = false;
  message: string = '';
  data: OnboardingEmployeeDetailDto = new OnboardingEmployeeDetailDto();

  constructor(init?: Partial<OnboardingEmployeeDetailResponseDto>) {
    if (init) {
      Object.assign(this, init);
      if (init.data) {
        this.data = new OnboardingEmployeeDetailDto(init.data);
      }
    }
  }
}

export class ConfirmOnboardingFormDto {
  full_name: string = '';
  father_name: string = '';
  gender: string = '';
  marital_status: string = '';
  national_unique_id: string = '';
  date_of_birth: string = '';
  country_code: string = '';
  mobile_number: string = '';
  emergency_contact: string = '';
  disability: string = '';
  religion: string = '';
  email: string = '';
  blood_group: string = '';
  home_address: string = '';
  district_name: string = '';
  country: string = '';
  linkedin_url: string = '';
  employee_type: string = '';
  date_of_joining: string = '';
  employee_category: string = '';
  job_title: string = '';
  company_branch: string = '';
  department: string = '';
  source: string = '';
  remarks: string = '';

  constructor(init?: Partial<ConfirmOnboardingFormDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
