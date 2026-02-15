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
  employeePublicId: string = '';
  enumGroupOptions: string[] = [
    "blood_group",
    "disability_type",
    "gender",
    "marital_status",
    "religion"

  ];
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
      console.log('Form Submitted:', formValue);
      // Add your submit logic here
      this.employeesService.startOnboardingEmployee(this.employeePublicId).subscribe({
        next: (response: any) => {
          console.log('Onboarding started:', response);
        },
        error: (error: any) => {
          console.error('Error starting onboarding:', error);
        }
      });
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
      },
      error: (error: any) => {
        console.error(`Error fetching enum values for ${code}:`, error);
      }
    });
  }
  createEmployee() {
    if (this.confirmForm.valid) {
      const formValue = this.confirmForm.getRawValue();

      this.employeesService.addEmployee('EMPLOYEE', this.employeeCode, formValue).subscribe({
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
}
