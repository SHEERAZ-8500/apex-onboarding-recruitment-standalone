import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicFieldDto } from '../../../../shared/models/common/dynamicFields-dto-';
import { EmployeesService } from '../../services/employees.service';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { FormsService } from '../../../forms/services/forms.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent {
  title = 'view';
  formTitle = ""

  // Services and dependencies
  loaderService: LoaderService;
  formsService: FormsService;
  router: Router;
  activatedRoute: ActivatedRoute;
  employeesService: EmployeesService;
  toastr: ToastrService;

  dynamicFields: DynamicFieldDto[] = [];
  rowTableFields: DynamicFieldDto[] = [];
  mode: 'view' | 'create' | 'edit' = 'view';
  sidebarTabs: any[] = [];
  selectedRowTableField: DynamicFieldDto | null = null;
  showNewRowField: boolean = false;

  constructor(
    router: Router,
    activatedRoute: ActivatedRoute,
    employeesService: EmployeesService,
    formsService: FormsService,
    loaderService: LoaderService,
    toastr: ToastrService) {
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.employeesService = employeesService;
    this.formsService = formsService;
    this.loaderService = loaderService;
    this.toastr = toastr;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.title = data['title'];
      if (this.title === 'view') {

        // set view mode loigc
        //  this.fetchSkills()
      }
      if (this.title === 'edit') {
        this.formTitle = "Edit Employee"
        // Initialize sidebar tabs for edit mode
        this.initializeSidebarTabs();
        this.loadDynamicFields();
        this.getFormFileds()
      }
      if (this.title === 'create') {
        this.formTitle = "Create New Employee"
        // Initialize sidebar tabs for create mode
        this.initializeSidebarTabs();
        this.loadDynamicFields();
        this.getFormFileds()
      }
    });
  }

  // Initialize the base sidebar tabs (tabs 1-12)
  initializeSidebarTabs(): void {
    this.sidebarTabs = [
      { id: 1, name: 'Personal Details', icon: 'fa-user', active: true },
      { id: 2, name: 'Identification', icon: 'fa-id-card', active: false },
      { id: 3, name: 'Contact Information', icon: 'fa-phone', active: false },
      { id: 4, name: 'Job Details', icon: 'fa-briefcase', active: false },
      { id: 5, name: 'Education', icon: 'fa-graduation-cap', active: false },
      { id: 6, name: 'Experience', icon: 'fa-building', active: false },
      { id: 7, name: 'Skills', icon: 'fa-cogs', active: false },
      { id: 8, name: 'Certifications', icon: 'fa-certificate', active: false },
      { id: 9, name: 'Documents', icon: 'fa-file-alt', active: false },
      { id: 10, name: 'Emergency Contact', icon: 'fa-phone-square', active: false },
      { id: 11, name: 'Banking Details', icon: 'fa-university', active: false },
      { id: 12, name: 'Dependents', icon: 'fa-users', active: false }
    ];
  }

  // Load dynamic fields from the form
  loadDynamicFields(): void {
    this.formsService.getFormById('EMPLOYEE_REQUISITION', 'USER_DEFINED').subscribe((res: any) => {
      const allFields = res.data.fields || [];

      // Map to DTOs to ensure all properties have default values
      const mappedFields = allFields.map((f: any) => new DynamicFieldDto(f));

      // Separate ROW fields for tabs and other fields for display
      this.dynamicFields = mappedFields.filter((f: DynamicFieldDto) => f.fieldType !== 'ROW');
      this.rowTableFields = mappedFields.filter((f: DynamicFieldDto) => f.fieldType === 'ROW');

      // Add ROW fields as new tabs in sidebar
      this.rowTableFields.forEach((field: DynamicFieldDto, index: number) => {
        if (field.active) {
          this.sidebarTabs.push({
            id: 13 + index,
            name: field.label,
            icon: 'fa-table',
            active: false,
            rowTableField: field // Store reference to the field
          });
        }
      });
    });
  }


  // View States
  showForm = false;
  isEdit = false;
  showViewModal = false;

  // Table Controls
  itemsPerPage = 7;
  currentPage = 1;
  searchText = '';
  selectedErp = '';

  // Active Tab Management
  activeTabId = 1; // Default: Personal Details (Employees Form)

  // Main Employee Form Data (Complete Employees Form from your code)
  employeeFormData = {
    // Basic Information (from your screenshot and original form)
    code: '',
    legacyCode: '',
    name: '',
    fatherName: '',
    employeeCategory: '',
    gender: '',
    jobTitle: '',
    company: '',
    manager: '',
    department: '',
    dob: '',
    nationality: '',
    mobileNumber: '',
    email: '',
    dateOfJoining: '',
    homeAddress: '',
    bloodGroup: '',
    sponsor: '',
    contractNo: '',
    employeeGrade: '',
    religion: '',
    maritalStatus: '',
    medicalInsuranceNo: '',
    emergencyContact: '',
    visaType: '',
    visaIqamaId: '',
    visaExpiryDate: '',
    bankName: '',
    accountNumber: '',
    remarks: '',
    currentStatus: '',
    project: '',
    lastIncrementDate: '',
    lastIncrementAmount: '',
    paymentMethod: '',
    disability: '',
    employeeType: '',
    buildingNumber: '',
    streetName: '',
    districtName: '',
    country: '',
    city: '',
    countryCode: '',
    active: true,

    // Personal Details from screenshot
    employeeId: '4222',
    otherId: 'emp05',
    firstName: 'akash',
    middleName: 'Automation',
    lastName: 'lala',
    driversLicense: 'GJ3234263',
    licenseExpiry: '2025-02-15',
    nationality2: 'Micronesian', // Different name to avoid conflict
    maritalStatus2: 'Married', // Different name to avoid conflict
    dob2: '2010-11-18',
    gender2: 'Male', // Different name to avoid conflict
  };

  // Dropdown Options (from your original code)
  dropdownOptions = {
    employeeCategories: ['Category A', 'Category B', 'Category C', 'Category D'],
    genders: ['Male', 'Female', 'Other'],
    jobTitles: ['Admin Officer', 'Manager', 'Developer', 'HR Executive'],
    companies: ['Company A', 'Company B', 'Company C'],
    managers: ['John Doe', 'Jane Smith', 'Robert Johnson'],
    departments: ['HR', 'IT', 'Finance', 'Operations'],
    nationalities: ['Saudi', 'Pakistani', 'Indian', 'American', 'Micronesian'],
    sponsors: ['Yes', 'No'],
    employeeGrades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'],
    maritalStatuses: ['Single', 'Married', 'Divorced', 'Widowed'],
    visaTypes: ['Employment', 'Business', 'Visit'],
    currentStatuses: ['Active', 'Inactive', 'On Leave', 'Terminated'],
    projects: ['Project A', 'Project B', 'Project C'],
    paymentMethods: ['Bank Transfer', 'Cash', 'Cheque'],
    disabilities: ['Yes', 'No'],
    employeeTypes: ['Permanent', 'Contract', 'Temporary'],
    countries: ['Saudi Arabia', 'Pakistan', 'India', 'USA'],
    cities: ['Riyadh', 'Jeddah', 'Karachi', 'Lahore']
  };

  // Sidebar Tabs Data (All modal tabs moved to sidebar) - Will be populated dynamically from form fields

  // Profile Image
  profileImage: string = 'assets/images/default-avatar.png';
  profileImageFile: File | null = null;

  // Sample Data for Table
  employees = [
    {
      sr: 1,
      code: 'EMP-00001',
      legacyCode: 'LG001',
      name: 'John Doe',
      jobTitle: 'Admin Officer',
      project: 'Project A',
      email: 'john@example.com',
      mobileNo: '1234567890',
      status: 'Active'
    },
    {
      sr: 2,
      code: 'EMP-00002',
      legacyCode: 'LG002',
      name: 'Jane Smith',
      jobTitle: 'Manager',
      project: 'Project B',
      email: 'jane@example.com',
      mobileNo: '0987654321',
      status: 'Active'
    },
    {
      sr: 3,
      code: 'EMP-00003',
      legacyCode: 'LG003',
      name: 'Robert Johnson',
      jobTitle: 'Developer',
      project: 'Project C',
      email: 'robert@example.com',
      mobileNo: '5555555555',
      status: 'Inactive'
    }
  ];

  fetchEmployees() {
    return this.employees;
  }

  // Dynamic Fields Data
  dynamicFieldsData: { [key: string]: any } = {};
  rowTableData: { [fieldCode: string]: { [columnCode: string]: any } } = {}; // Store row column data

  // Data for other tabs
  otherTabsData = [
    { name: 'John Doe', email: 'john@example.com', contact: '1234567890', address: '123 Street' },
    { name: 'Jane Smith', email: 'jane@example.com', contact: '0987654321', address: '456 Avenue' }
  ];
  // Pagination Methods
  get paginatedEmployees() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.employees.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.employees.length / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get currentPageStart() {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  // Form Method
  onNew() {
    this.showForm = true;
    this.isEdit = false;
    this.resetForm();
    this.setActiveTab(1); // Reset to Personal Details tab
    this.router.navigate(['/panel/employees-master-data/create-new-employees']);


  }

  editEmployee(index: number) {
    this.showForm = true;
    this.isEdit = true;
    // Load employee data
    const emp = this.employees[index];
    this.employeeFormData.code = emp.code;
    this.employeeFormData.legacyCode = emp.legacyCode;
    this.employeeFormData.name = emp.name;
    this.employeeFormData.jobTitle = emp.jobTitle;
    this.employeeFormData.project = emp.project;
    this.employeeFormData.email = emp.email;
    this.employeeFormData.mobileNumber = emp.mobileNo;
    this.employeeFormData.currentStatus = emp.status;
    this.setActiveTab(1); // Reset to Personal Details tab
    this.router.navigate(['/panel/employees-master-data/edit-employees']);

  }

  viewEmployee(index: number) {
    this.showViewModal = true;
  }

  closeModals() {
    this.showViewModal = false;
  }

  resetForm() {
    // Reset all form data
    this.employeeFormData = {
      code: '',
      legacyCode: '',
      name: '',
      fatherName: '',
      employeeCategory: '',
      gender: '',
      jobTitle: '',
      company: '',
      manager: '',
      department: '',
      dob: '',
      nationality: '',
      mobileNumber: '',
      email: '',
      dateOfJoining: '',
      homeAddress: '',
      bloodGroup: '',
      sponsor: '',
      contractNo: '',
      employeeGrade: '',
      religion: '',
      maritalStatus: '',
      medicalInsuranceNo: '',
      emergencyContact: '',
      visaType: '',
      visaIqamaId: '',
      visaExpiryDate: '',
      bankName: '',
      accountNumber: '',
      remarks: '',
      currentStatus: '',
      project: '',
      lastIncrementDate: '',
      lastIncrementAmount: '',
      paymentMethod: '',
      disability: '',
      employeeType: '',
      buildingNumber: '',
      streetName: '',
      districtName: '',
      country: '',
      city: '',
      countryCode: '',
      active: true,
      employeeId: '',
      otherId: '',
      firstName: '',
      middleName: '',
      lastName: '',
      driversLicense: '',
      licenseExpiry: '',
      nationality2: '',
      maritalStatus2: '',
      dob2: '',
      gender2: 'Male'
    };
  }

  saveEmployee() {
    // Prepare complete data with dynamic fields
    const completeData = {
      data: {
        ...this.employeeFormData,
        ...this.dynamicFieldsData,
      },
      rows: this.getRowTableFieldsData() // Get data from all row table tabs
    };


    this.showForm = false;
    this.loaderService.show();
    this.employeesService.saveFormData('EMPLOYEE_REQUISITION', completeData).subscribe({
      next: (res: any) => {
        console.log('Employee saved successfully:', res);
        this.toastr.success('Employee data saved successfully');
        this.loaderService.hide();
      },
      error: (err: any) => {
        console.error('Error saving employee data:', err);
        this.toastr.error('Failed to save employee data');
        this.loaderService.hide();
      }
    });
  }

  // Get all row table fields data in required format
  getRowTableFieldsData() {
    const rows: { [key: string]: any[] } = {};

    this.rowTableFields.forEach((field: DynamicFieldDto) => {
      // Each row table field becomes an array of objects
      const rowArray: any[] = [];

      // Collect data from each row table field's columns as a single object
      if (field.rowColumns && field.rowColumns.length > 0) {
        const rowObject: { [key: string]: any } = {};

        field.rowColumns.forEach((column: any) => {
          // Use fieldCode as key and selectedValue as value
          if (column.fieldCode) {
            rowObject[column.fieldCode] = column.selectedValue || null;
          }
        });

        // Add the row object to the array (currently single row, can be extended for multiple rows)
        rowArray.push(rowObject);
      }

      // Store under the parent field's fieldCode as an array
      rows[field.fieldCode] = rowArray;
    });

    return rows;
  }

  cancelForm() {
    this.showForm = false;
    this.router.navigate(['/panel/employees-master-data/view-all-employees']);

  }

  setActiveTab(tabId: number) {
    this.activeTabId = tabId;
    this.sidebarTabs.forEach(tab => {
      tab.active = tab.id === tabId;
    });
  }

  // Validation
  isFormValid(): boolean {
    return !!this.employeeFormData.code && !!this.employeeFormData.name && !!this.employeeFormData.email;
  }

  // Profile Image Methods
  onProfileImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Search Filter
  get filteredEmployees() {
    if (!this.searchText) return this.employees;
    const search = this.searchText.toLowerCase();
    return this.employees.filter(emp =>
      emp.name.toLowerCase().includes(search) ||
      emp.code.toLowerCase().includes(search) ||
      emp.email.toLowerCase().includes(search)
    );
  }

  // Dynamic Fields Methods
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown')) {
      this.dynamicFields.forEach(f => f.isDropdownOpen = false);

      // Close row column dropdowns
      this.rowTableFields.forEach(field => {
        if (field.rowColumns) {
          field.rowColumns.forEach((col: any) => col.isDropdownOpen = false);
        }
      });
    }
  }

  toggleDynamicDropdown(field: any, event: Event) {
    event.stopPropagation();
    field.isDropdownOpen = !field.isDropdownOpen;

    // Close other dropdowns
    this.dynamicFields.forEach(f => {
      if (f !== field) f.isDropdownOpen = false;
    });

    // Load options on first open if not already loaded
    if (field.isDropdownOpen && !field.optionsLoaded) {
      if (field.fieldType === 'LOOKUP_TABLE' && field.lookupTable) {
        this.loadLookupTableOptions(field);
      }
    }
  }

  selectDynamicOption(field: any, option: any, event: Event) {
    event.stopPropagation();
    if (field.fieldType === 'LOOKUP_ENUM') {
      this.dynamicFieldsData[field.fieldCode] = option;
    } else {
      this.dynamicFieldsData[field.fieldCode] = option.id || option.code || option;
    }
    field.isDropdownOpen = false;
  }

  getSelectedDisplayText(field: any): string {
    const selectedValue = this.dynamicFieldsData[field.fieldCode];
    if (!selectedValue) {
      return 'Select ' + field.label;
    }
    if (field.options) {
      const option = field.options.find((opt: any) =>
        (opt.id || opt.code) === selectedValue
      );
      return option?.displayText || option?.name || selectedValue;
    }
    return selectedValue;
  }

  loadLookupTableOptions(field: any) {
    this.employeesService.getLokupTableByCode(field.lookupTable).subscribe({
      next: (res: any) => {
        field.options = res.data || [];
        field.optionsLoaded = true;
      },
      error: (err) => {
        console.error('Error loading lookup table options:', err);
        field.options = [];
        field.optionsLoaded = true;
      }
    });
  }

  // Row Table Column Methods
  toggleRowColumnDropdown(column: any, event: Event) {
    event.stopPropagation();
    column.isDropdownOpen = !column.isDropdownOpen;

    // Load options on first open if not already loaded
    if (column.isDropdownOpen && !column.optionsLoaded) {
      if (column.fieldType === 'LOOKUP_TABLE' && column.lookupTable) {
        this.loadRowColumnLookupOptions(column);
      }
    }
  }

  selectRowColumnOption(column: any, option: any, event: Event) {
    event.stopPropagation();
    if (column.fieldType === 'LOOKUP_ENUM') {
      column.selectedValue = option;
    } else {
      column.selectedValue = option.id || option.code || option;
    }
    column.isDropdownOpen = false;
  }

  getRowColumnDisplayText(column: any): string {
    const selectedValue = column.selectedValue;
    if (!selectedValue) {
      return 'Select ' + (column.label || column.name);
    }
    if (column.options) {
      const option = column.options.find((opt: any) =>
        (opt.id || opt.code) === selectedValue
      );
      return option?.displayText || option?.name || selectedValue;
    }
    return selectedValue;
  }

  loadRowColumnLookupOptions(column: any) {

    this.employeesService.getLokupTableByCode(column.linkedComponent).subscribe({
      next: (res: any) => {
        column.options = res.data || [];
        column.optionsLoaded = true;
      },
      error: (err) => {
        console.error('Error loading row column lookup options:', err);
        column.options = [];
        column.optionsLoaded = true;
      }
    });
  }

  getFormFileds() {
    this.formsService.getFormByFormCode('EMPLOYEE_REQUISITION').subscribe({
      next: (res: any) => {
        console.log('Form Fields:', res);

        // safety check
        if (res?.data?.fields && Array.isArray(res.data.fields)) {
          res.data.fields.forEach((field: any) => {

          });
        }
      },
      error: (err: any) => {
        console.error('Error fetching form fields:', err);
      }
    });
  }

}