export class CandidateScreeningSalaryRowDto {
  payElement: string = '';
  amount: number = 0;
  payFrequency: string = 'MONTHLY';
  currency: string = 'PKR';
  effectiveDate: string = '';
  remarks: string = '';

  constructor(init?: Partial<CandidateScreeningSalaryRowDto>) {
    Object.assign(this, init);
  }
}

export class CandidateScreeningDto {
  status: string = 'SELECTED';
  dateOfJoining: string = '';
  remarks: string = '';
  salaryRows: CandidateScreeningSalaryRowDto[] = [];

  constructor(init?: Partial<CandidateScreeningDto>) {
    Object.assign(this, init);
  }
}
