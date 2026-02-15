export class OnboardingEmployeeDto {
  public_id: string = '';
  code: string = '';
  full_name: string = '';
  email: string = '';
  employment_status: string = '';
  onboarding_status: string = '';
  date_of_joining: string = '';
  department_public_id: string = '';
  department_name: string = '';
  job_title_public_id: string = '';
  job_title_name: string = '';
  created_date: string = '';

  constructor(init?: Partial<OnboardingEmployeeDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

export class PaginatorDto {
  currentPage: number = 0;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(init?: Partial<PaginatorDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

export class OnboardingEmployeesListResponseDto {
  success: boolean = false;
  message: string = '';
  data: OnboardingEmployeeDto[] = [];
  paginator: PaginatorDto = new PaginatorDto();

  constructor(init?: Partial<OnboardingEmployeesListResponseDto>) {
    if (init) {
      Object.assign(this, init);
      if (init.data) {
        this.data = init.data.map(item => new OnboardingEmployeeDto(item));
      }
      if (init.paginator) {
        this.paginator = new PaginatorDto(init.paginator);
      }
    }
  }
}
