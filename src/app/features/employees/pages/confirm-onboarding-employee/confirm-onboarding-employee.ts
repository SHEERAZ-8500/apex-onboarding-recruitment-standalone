import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmployeesService } from '../../services/employees.service';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { OnboardingEmployeeDetailDto, ConfirmOnboardingFormDto } from '../../dtos/confirm-onboarding-employee.dto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirm-onboarding-employee',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './confirm-onboarding-employee.html',
  styleUrl: './confirm-onboarding-employee.scss',
})
export class ConfirmOnboardingEmployee implements OnInit {
  employeeCode: string = '';
  confirmForm!: FormGroup;
  employeeDetails: OnboardingEmployeeDetailDto | null = null;
  bloodGroupOptions: string[] = [];
  disabilityTypeOptions: string[] = [];
  genderOptions: string[] = []
  maritalStatusOptions: string[] = [];
  religionOptions: string[] = [];
  employeeTypeOptions: string[] = [];
  employeePublicId: string = '';
  lookupTableCodesObj: any = {
    employee_category: '',
    department: '',
    company_branch: '',
    job_title: ''

  };
  enumGroupOptions: string[] = [
    "blood_group",
    "disability_type",
    "gender",
    "marital_status",
    "religion",
    "employee_type"

  ];
  lookupTableCodes: string[] = [
    "employee_category",
    "department",
    "company_branch",
    "job_title"
  ];
  employeeCategoryOptions: any[] = [];
  departmentOptions: any[] = []
  companyBranchOptions: any[] = [];
  jobTitleOptions: any[] = [];
  onbaordingStatus: string = '';
  constructor(
    private employeesService: EmployeesService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private location: Location
  ) {
    this.initializeForm();
    for (const enumCode of this.enumGroupOptions) {
      this.getEnumsValues(enumCode);
    }

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.employeeCode = params['code'];
      this.onbaordingStatus = params['status'];
      if (this.employeeCode) {
        this.fetchOnboardingEmployeeDetails('EMPLOYEE', this.employeeCode);
      }
    });
  }

  initializeForm() {
    this.confirmForm = this.fb.group({
      full_name: [{ value: '', disabled: true }, Validators.required],
      father_name: ['', Validators.required],
      gender: ['', Validators.required],
      marital_status: ['', Validators.required],
      national_unique_id: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      country_code: ['', Validators.required],
      mobile_number: ['', Validators.required],
      emergency_contact: ['', Validators.required],
      disability: ['', Validators.required],
      religion: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      blood_group: ['', Validators.required],
      home_address: ['', Validators.required],
      district_name: ['', Validators.required],
      country: ['', Validators.required],
      linkedin_url: [''],
      employee_type: ['', Validators.required],
      date_of_joining: [{ value: '', disabled: true }, Validators.required],
      employee_category: ['', Validators.required],
      job_title: [{ value: '', disabled: true }, Validators.required],
      company_branch: ['', Validators.required],
      department: [{ value: '', disabled: true }, Validators.required],
      source: [''],
      remarks: [{ value: '', disabled: true }]
    });
  }

  fetchOnboardingEmployeeDetails(formCode: string, code: string) {
    this.loaderService.show();
    this.employeesService.getOnboardingEmployeeById(formCode, code).subscribe({
      next: (response) => {
        this.employeeDetails = response.data;
        this.populateForm(response.data);
        this.employeePublicId = response.data.publicId;
        for (const lookupCode of this.lookupTableCodes) {
          this.fetchAllLookupValues(lookupCode);
        }
        this.loaderService.hide();
      },
      error: (error: any) => {
        console.error('Error fetching onboarding employee details:', error);
        this.loaderService.hide();
      }
    });
  }

  populateForm(data: OnboardingEmployeeDetailDto) {
    if (data.data) {
      this.confirmForm.patchValue({
        full_name: data.data.full_name,
        email: data.data.email,
        date_of_joining: data.data.date_of_joining,
        job_title: data.data.job_title,
        department: data.data.department,
        remarks: data.data.remarks
      });
    }
  }

  onSubmit() {
    if (this.confirmForm.valid) {
      const formValue = this.confirmForm.getRawValue();
      // Add your submit logic here
      if (this.onbaordingStatus === 'NOT_STARTED') {
        this.employeesService.startOnboardingEmployee(this.employeePublicId).subscribe({
          next: (response: any) => {
            console.log('Onboarding started:', response);
            this.createEmployee()
          },
          error: (error: any) => {
            console.error('Error starting onboarding:', error);
          }
        });
      } else {
        this.createEmployee();

      }
    }
  }
  getEnumsValues(code: string) {
    this.employeesService.getLookupEnumByCode(code).subscribe({
      next: (response: any) => {
        if (code === 'blood_group') {
          this.bloodGroupOptions = response.data.values;
        }
        else if (code === 'disability_type') {
          this.disabilityTypeOptions = response.data.values;
        }
        else if (code === 'gender') {
          this.genderOptions = response.data.values;
        }
        else if (code === 'marital_status') {
          this.maritalStatusOptions = response.data.values;
        }
        else if (code === 'religion') {
          this.religionOptions = response.data.values;
        }
        else if (code === 'employee_type') {
          this.employeeTypeOptions = response.data.values;
        }
      },
      error: (error: any) => {
        console.error(`Error fetching enum values for ${code}:`, error);
      }
    });
  }
  createEmployee() {
    if (this.confirmForm.valid) {
      this.confirmForm.patchValue({
        job_title: this.lookupTableCodesObj.job_title,
        department: this.lookupTableCodesObj.department,
        // company_branch: this.lookupTableCodesObj.company_branch,
        // employee_category: this.lookupTableCodesObj.employee_category

      });
      const formValue = this.confirmForm.getRawValue();
      delete (formValue as any).email;
      let payload = {
        data: {
          ...formValue
        },
        rows: {}
      }
      this.employeesService.addEmployee('EMPLOYEE', this.employeeCode, payload).subscribe({
        next: (response: any) => {
          this.toastr.success('Employee confirmed successfully!');
          this.confirmEmployee();
        },
        error: (error: any) => {
          console.error('Error creating employee:', error);
          this.toastr.error('Failed to confirm employee. Please try again.');
        }
      });
    }
  }
  confirmEmployee() {

    this.employeesService.confirmOnboardingEmployee(this.employeePublicId).subscribe({
      next: (response: any) => {
        // this.toastr.success('Employee confirmed successfully!');
        this.location.back();
      },
      error: (error: any) => {
        // console.error('Error confirming employee:', error);
        // this.toastr.error('Failed to confirm employee. Please try again.');
      }
    });

  }

  fetchAllLookupValues(code: string) {
    this.employeesService.getLokupTableByCode(code).subscribe({
      next: (response: any) => {
        if (code === 'employee_category') {
          this.employeeCategoryOptions = response.data;
          let employeeCategoryControl = this.confirmForm.get('employee_category');
          let findingValue = this.employeeCategoryOptions.find((option: any) => option.code === employeeCategoryControl?.value);

          if (findingValue) {
            employeeCategoryControl?.setValue(findingValue.name);
            this.lookupTableCodesObj.employee_category = findingValue.code;
          }
        }
        else if (code === 'department') {

          this.departmentOptions = response.data;
          let departmentControl = this.confirmForm.get('department');
          let findingValue = this.departmentOptions.find((option: any) => option.code === departmentControl?.value);
          if (findingValue) {
            departmentControl?.setValue(findingValue.name);
            this.lookupTableCodesObj.department = findingValue.code;
          }
        }
        else if (code === 'company_branch') {
          this.companyBranchOptions = response.data;
          let companyBranchControl = this.confirmForm.get('company_branch');
          let findingValue = this.companyBranchOptions.find((option: any) => option.code === companyBranchControl?.value);
          if (findingValue) {
            companyBranchControl?.setValue(findingValue.name);
            this.lookupTableCodesObj.company_branch = findingValue.code;
          }
        }
        else if (code === 'job_title') {
          this.jobTitleOptions = response.data;
          let jobTitleControl = this.confirmForm.get('job_title');
          let findingValue = this.jobTitleOptions.find((option: any) => option.code === jobTitleControl?.value);
          if (findingValue) {
            jobTitleControl?.setValue(findingValue.name);
            this.lookupTableCodesObj.job_title = findingValue.code;
          }
        }
      },
      error: (error: any) => {
        console.error(`Error fetching lookup values for ${code}:`, error);
      }
    });
  }
}
