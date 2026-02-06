// RequisitionDto for RequisitionComponent


export class InterviewSchedulingDto {
  candidate: string = '';
  interviewer_user: string = '';
  interview_date: Date | null = null;
  start_time: string = '';
  location: string = '';
  meeting_url: string = '';
  interview_status: string = 'SCHEDULED';
  remarks: string = '';
  is_active: boolean = true;
  constructor(init?: Partial<InterviewSchedulingDto>) {
    Object.assign(this, init);
  }
}
// Define a class
export class AllFormsLisitngDto {
  createdDate: string;
  name: string;
  publicId: string;
  version: number;
  status: string;

  constructor(createdDate: string, name: string, publicId: string, version: number, status: string) {
    this.createdDate = createdDate;
    this.name = name;
    this.publicId = publicId;
    this.version = version;
    this.status = status;
  }
}

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


export class FormSubmissionDto {
  publicId!: string;
  formDefinitionPublicId!: string;
  formName!: string;
  submittedAt!: string;
  submittedBy!: string;


  constructor(data?: Partial<FormSubmissionDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}



export class RequestionLookupDto {
  code: string = '';
  name: string = '';
  description: string = '';
  status: boolean = true;
  internetAddress: string = '';
  emailAddress: string = '';
  telephone: string = '';

  constructor(init?: Partial<RequestionLookupDto>) {
    Object.assign(this, init);
  }
}

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

export class CreateFormDto {
  code: string = '';
  name: string = '';

  constructor(init?: Partial<CreateFormDto>) {
    Object.assign(this, init);
  }
}


export class CreateColumnDto {
  name: string = '';
  type: string = '';
  maxLength: number | null = null;
  precision: number | null = null;
  scale: number | null = null;
  nullable: boolean = true;
  displayOrder: number | null = null;

  constructor(init?: Partial<CreateColumnDto>) {
    Object.assign(this, init);
  }
}


export class createNewColumnInIndependentTableDto {
  name: string = '';
  type: string = '';
  maxLength: number | null = null;
  precision: number | null = null;
  scale: number | null = null;
  nullable: boolean = true;
  displayOrder: number | null = null;
  active: boolean = true;
  lookupComponentCode: string = '';



  constructor(init?: Partial<createNewColumnInIndependentTableDto>) {
    Object.assign(this, init);
  }
}


export class ReqFormDto {
  requisitionNumber: number | null = null;
  requisitionName: string = '';
  designationName: string = '';
  noOfInterviews: number | null = null;
  noOfEmployeeIntraCountry: number | null = null;
  noOfEmployeeInterCountry: number | null = null;
  requiredDate: Date | null = null;
  trainingRequired: boolean = true;
  description: string = '';
  status: boolean = true;

  constructor(init?: Partial<ReqFormDto>) {
    Object.assign(this, init);
  }
}


// CandidateDto for CandidatesComponent
export class CandidateDto {
  code: number | null = null;
  first_name: string = '';
  last_name: string = '';
  requisition_code: string = '';
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
    Object.assign(this, init);
  }
}


export class FinalScreeningFormDto {
  id: number | null = null;
  candidateID: number | null = null;
  status: string = '';
  DOJ: string = '';
  finalDeciosionRemarks: string = '';
  // payElement: string = '';
  // effectiveDate: string = '';
  // payFrequency: string = '';
  // amount: number | null = null;
  // remarks: string = '';
  is_active: boolean = true;

  constructor(init?: Partial<FinalScreeningFormDto>) {
    Object.assign(this, init);
  }
}





export class FieldConfigDto {
  source: 'CURRENT_USER' | string = 'CURRENT_USER';
  editable: boolean = false;
  selection: 'SINGLE' | 'MULTIPLE' = 'SINGLE';
}



export class RequisitionBackendFieldsDto {
  fieldCode: string = 'hiring_manager';
  label: string = 'Hiring Manager';
  fieldType: 'LOOKUP_TABLE' | string = 'LOOKUP_TABLE';
  systemDefined: boolean = true;
  createdDate: string = '';
  lookupTable: string = 'app_user';
  nullable: boolean = true;
  displayOrder: number = 7;
  lifecycleStatus: 'ACTIVE' | string = 'ACTIVE';
  required: boolean = false;
  linkedComponent: string = 'app_user';
  fieldConfig: FieldConfigDto = new FieldConfigDto();
  active: boolean = true;
  constructor(init?: Partial<RequisitionDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}


export class RequisitionDto {
  // requisitionId: number | null = null;
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


export class LookupDto {
  code: string = '';
  description: string = '';
  name: string = '';
  publicId: string = '';

  constructor(init?: Partial<LookupDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}


export class LookupDtoWhenTypeForm {
  code: string = ''
  publicId: string = ''

  summary: string = ''


  constructor(init?: Partial<LookupDtoWhenTypeForm>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

// Candidate Screening DTO
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


export class CandidateLisitngDto {

  publicId: string = "";
  code: string = ""
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  constructor(init?: Partial<CandidateLisitngDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }


}

export class PayElementDto {
  code: string = '';
  type: string = '';
  elementType: string = '';
  amount: number | null = null;
  percentage: number | null = null;
  description: string = '';
  status: boolean = false; // Checkbox
  fixed: boolean = false;  // Checkbox

  constructor(init?: Partial<PayElementDto>) {
    Object.assign(this, init);
  }
}



export class HrCandidateShortListingDto {
  code!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  publicId!: string;
  selected?: boolean;
  status!: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'INTERVIEWED' | 'SELECTED' | 'REJECTED' | 'CONVERTED';

  constructor(data?: Partial<HrCandidateShortListingDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}


export class InterviewFeedback {
  result!: string;
  remarks!: string;
  // interviewerPublicId!: string;

  constructor(data?: Partial<InterviewFeedback>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}



export class InterviewDto {
  publicId!: string;
  code!: string;
  candidatePublicId!: string;
  interviewerUserPublicId!: string;
  interviewDate!: string;     // e.g. '2026-01-28'
  startTime!: string;         // e.g. '02:50:00'
  interviewStatus!: string;   // e.g. 'SCHEDULED'
  location!: string;          // e.g. 'ONSITE'
  meetingUrl!: string;
  remarks!: string;

  constructor(init?: Partial<InterviewDto>) {
    Object.assign(this, init);
  }
}



export class JobRequisitionTableListingDto {
  publicId!: string;
  code!: string;

  requisitionName!: string;

  departmentPublicId!: string;
  departmentName!: string;

  designationPublicId!: string;
  designationName!: string;

  jobTitlePublicId!: string;
  jobTitleName!: string;

  requiredCount!: number;
  requiredDate!: string; // ISO date string (YYYY-MM-DD)

  createdDate!: string; // ISO datetime string
  isActive!: boolean;

  constructor(init?: Partial<JobRequisitionTableListingDto>) {
    Object.assign(this, init);
  }
}


export class CandidateTableListingDto {
  application_date!: string;
  city!: string;
  code!: string;
  contact_number1!: string;
  contact_number2!: string;
  country!: string;
  created_date!: string;

  department_name!: string;
  department_public_id!: string;
  designation_name!: string;
  designation_public_id!: string;

  email!: string;
  expected_doj!: string;
  first_name!: string;
  last_name!: string;
  gender!: '';
  is_active!: boolean;

  job_title_name!: string;
  job_title_public_id!: string; 

  linkedin_url!: string;
  onboarding_status!: '';
  public_id!: string;
  religion!: '';

  requisition_code!: string;
  requisition_name!: string;
  requisition_public_id!: string;
  status!: '';

  candidate_attachment!: [];
  candidate_experience!: [];
  candidate_qualification!: [];
  candidate_skills!: [];

  createdDate!: string;
  constructor(init?: Partial<CandidateTableListingDto>) {
    Object.assign(this, init);
  }
}


export class InterviewsTableListingDto {
  publicId!: string;
  code!: string;

  candidatePublicId!: string;
  candidateCode!: string;
  candidateFirstName!: string;
  candidateLastName!: string;
  candidateEmail!: string;

  interviewStatus!: string;
  interviewLocation!: string;
  interviewDate!: string;
  startTime!: string;

  interviewerUserPublicId!: string;

  requisitionPublicId!: string;
  requisitionCode!: string;
  requisitionName!: string;

  departmentPublicId!: string;
  departmentName!: string;

  jobTitlePublicId!: string;
  jobTitleName!: string;

  designationPublicId!: string;
  designationName!: string;

  isActive!: boolean;
  constructor(init?: Partial<InterviewsTableListingDto>) {
    Object.assign(this, init);
  }
}


export class ViewLookupValuesInTableDto {

  publicId!: string;
  code!: string;
  name!: string;
  description!: string;
  isActive!: boolean;
  constructor(init?: Partial<ViewLookupValuesInTableDto>) {
    Object.assign(this, init);
  }
}

export class ViewEnumValuesInTableDto {
  enumComponentCode!: string;
  displayName!: string;
  description!: string;
  systemDefined!: boolean;
  active!: boolean;
  enumClass!: string;
  values!: string[];
  valueCount!: number;
  createdDate!: string;
  constructor(init?: Partial<ViewEnumValuesInTableDto>) {
    Object.assign(this, init);
  }
}

export class ViewTTabsValuesInTableDto {
  fieldCode!: string;
  label!: string;
  fieldType!: string;
  required!: boolean;
  active!: boolean;
  displayOrder!: number;
  maxLength?: number;
  precision?: number;
  scale?: number;

  constructor(init?: Partial<ViewTTabsValuesInTableDto>) {
    Object.assign(this, init);
  }
}

