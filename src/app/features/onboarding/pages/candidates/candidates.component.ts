import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicFieldsSharingService } from '../../../../core/services/management-services/dynamic-fields-sharing.service';
import { CandidateCreateDto, CandidateDto } from '../../dtos/candidate.dto';
import { RequisitionDto } from '../../dtos/requisition.dto';
import { LookupDto, LookupDtoWhenTypeForm, CandidateTableListingDto } from '../../../../shared/models/common/common-dto-';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { OnboardingService } from '../../service/onboarding.service';
import { FormsService } from '../../../forms/services/forms.service';
import { PaginationComponent } from '../../../../shared/components/commons/components/pagination/pagination.component';

@Component({
  selector: 'app-create-candidates',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PaginationComponent],
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss']
})
export class CandidatesComponent implements OnInit {

  title = 'view';
  formTitle = "";

  // Section-wise candidate data
  candidate: CandidateCreateDto = new CandidateCreateDto();

  currentPage = 0; // Backend uses 0-based indexing
  itemsPerPage = 7;
  totalItems = 0;
  totalPages = 0;
  isSubmitted = false;

  // Dropdown state
  activeDropdown: string = '';

  // Backend field management - for static fields visibility
  backendFieldsMap: Record<string, boolean> = {};

  // Dropdown options
  requisitions: string[] = ['Req-101', 'Req-102', 'Req-103'];
  departments: string[] = ['IT', 'HR', 'Finance', 'Marketing'];
  designations: string[] = ['Manager', 'Developer', 'Analyst', 'Intern'];
  hiringManagers: string[] = ['John Doe', 'Jane Smith', 'Alice Johnson'];
  // genders: string[] = ['Male', 'Female', 'Other'];
  countries: string[] = ['USA', 'Pakistan', 'India', 'UK'];
  cities: string[] = ['New York', 'Lahore', 'Mumbai', 'London'];
  categories: string[] = ['General', 'OBC', 'SC', 'ST'];
  onboardingStatuses: string[] = ['Pending', 'Completed', 'Rejected'];
  candidateStatuses: string[] = ['New', 'In Process', 'Hired', 'Rejected'];
  genderEnumArray = []
  candidateEnumArray = []
  onboardingStatusEnumArray = []
  requsitionDropDownValue: LookupDtoWhenTypeForm[] = [];
  departmentDropDownValue: LookupDto[] = [];
  designationDropDownValue: LookupDto[] = [];
  requisitionDisplayValue: string = '';
  religionEnumArray = []
  selectedDesignationDisplay: string = '';
  // Sidebar Tabs Data
  sidebarTabs: any[] = [];
  editCandidatePublicId: string = '';
  activeTabId: number = 1;
  candidateTableListArray: CandidateTableListingDto[] = [];

  constructor(
    private router: Router,
    public dynamicFieldsService: DynamicFieldsSharingService,
    private toastr: ToastrService,
    private loader: LoaderService,
    private onboardingService: OnboardingService,
    private formsService: FormsService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    // Load dynamic fields and tabs
    this.loader.show();



    this.activatedRoute.data.subscribe(data => {
      this.title = data['title'];
      if (this.title === 'view') {

        this.getCandidateData();
        // set view mode loigc
        //  this.fetchSkills()
      }
      if (this.title === 'edit') {
        this.formTitle = "Edit Skill"
        this.dynamicFieldsService.loadDynamicFields('CANDIDATE', 'USER_DEFINED', [])
          .then(() => {
            // Get tabs from service
            this.sidebarTabs = this.dynamicFieldsService.sidebarTabs;
            this.activeTabId = this.dynamicFieldsService.activeTabId;
            const field = this.sidebarTabs[this.activeTabId - 1]?.rowTableField;
            if (field) {
              this.dynamicFieldsService.initializeRowTable(field);
            }
            // Now load candidate data after dynamic fields are ready
            this.getCandidateData();

            this.loader.hide();
          })
          .catch((err) => {
            console.error('Error loading dynamic fields:', err);
            this.toastr.error('Failed to load dynamic fields');
            this.loader.hide();
          });
        this.activatedRoute.queryParams.subscribe(params => {
          const id = params['id'];
          const currentPage = params['currentPage'];
          this.currentPage = currentPage;
          this.editCandidatePublicId = id;

          // Removed getCandidateData from here as it's now called after dynamic fields load


          // console.log(id);
        })

        this.getFormFileds();

      }
      if (this.title === 'create') {
        this.formTitle = "Create New Skill"
        // Clear any existing row table data from previous session
        this.dynamicFieldsService.rowTableData = {};

        this.dynamicFieldsService.loadDynamicFields('CANDIDATE', 'USER_DEFINED', [])
          .then(() => {
            // Get tabs from service
            this.sidebarTabs = this.dynamicFieldsService.sidebarTabs;
            this.activeTabId = this.dynamicFieldsService.activeTabId;
            const field = this.sidebarTabs[this.activeTabId - 1]?.rowTableField;
            if (field) {
              this.dynamicFieldsService.initializeRowTable(field);
            }

            this.loader.hide();
          })
          .catch((err) => {
            console.error('Error loading dynamic fields:', err);
            this.toastr.error('Failed to load dynamic fields');
            this.loader.hide();
          });

        this.getFormFileds();


      }
    });

  }


  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }


  changePage(page: number) {

    const apiPage = page - 1;
    if (apiPage < 0 || apiPage >= this.totalPages) return;
    this.currentPage = apiPage;
    this.getCandidateData();

  }


  // filteredRequisitions() {
  //   if (!this.searchText.trim()) return this.requisition;

  //   return this.requisition.filter(this.requisition =>
  //     this.requisition.requisition_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
  //     this.requisition.department.toLowerCase().includes(this.searchText.toLowerCase())
  //   );
  // }

  hideForm() {
    this.resetForm();

  }

  cancelForm() {
    // this.hideForm();
    this.router.navigate(['/panel/onboarding/view-all-candidates']);
  }

  // deleteSkill(index: number) {
  //   this.requisition.splice(index, 1);

  //   if (this.currentPage > this.totalPages && this.totalPages > 0) {
  //     this.currentPage = this.totalPages;
  //   }
  //   this.updatePagination();
  // }

  editSkill() {
    this.router.navigate(['/panel/onboarding/edit-candidates']);


  }

  // // updateSkill() {
  // //   if (this.editIndex === null) return;

  // //   this.requisition[this.editIndex] = {
  // //     code: this.requisition.,
  // //     name: this.skillName,
  // //   };

  //   this.hideForm();
  // }

  onNew() {
    this.resetForm();
    // this.showForm = true;
    this.router.navigate(['/panel/onboarding/create-new-candidates']);
  }

  // createSkill() {
  //   if (!this.skillCode || !this.skillName) return;

  //   this.skills.push({
  //     code: this.skillCode,
  //     name: this.skillName,
  //   });

  //   this.hideForm();
  // }


  // Toggle Dropdown open/close
  toggleDropdown(event: Event, field: string): void {
    event.stopPropagation(); // Prevent document click from closing
    if (this.activeDropdown === field) {
      this.activeDropdown = ''; // Close if already open
    } else {
      this.activeDropdown = field; // Open selected
    }
    if (field === 'requisition') {
      this.fetchLookupOptionsWhenLokupTypeForm('job_requisition');
    }
    if (field === 'department') {
      this.fetchLookupOptions('department');
    }
    if (field === 'designation') {
      this.fetchLookupOptions('designation');
    }
  }

  // Select option from dropdown
  selectOption(field: string, value: any, event: Event): void {
    event.stopPropagation();

    if (field === 'requisition' && value.code) {
      // For requisition, store code and display summary
      this.candidate.requisition = value.code;
      this.requisitionDisplayValue = value.summary;
    } else if (field === 'designation') {
      this.candidate.designation = value.code;
      this.selectedDesignationDisplay = value.name;
    } else {
      (this.candidate as any)[field] = value;
    }

    this.activeDropdown = ''; // Close dropdown
  }

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  closeDropdowns(event: Event): void {
    this.activeDropdown = '';
    this.dynamicFieldsService.closeAllDropdowns();
  }

  // Set active tab
  setActiveTab(tabId: number): void {
    this.activeTabId = tabId;
    this.dynamicFieldsService.setActiveTab(tabId);
    const field = this.sidebarTabs[this.activeTabId - 1]?.rowTableField;

    if (field) {
      this.dynamicFieldsService.initializeRowTable(field);
    }
  }

  // Add current row data to table
  addRowToTable(): void {
    const field = this.sidebarTabs[this.activeTabId - 1]?.rowTableField;
    if (!field) return;

    const added = this.dynamicFieldsService.addRowFromCurrentFields(field);
    if (added) {
      this.toastr.success('Entry added successfully');
    } else {
      this.toastr.warning('Please fill at least one field');
    }
  }

  // Remove row from table
  removeRowFromTable(fieldCode: string, index: number): void {
    this.dynamicFieldsService.removeRow(fieldCode, index);
    this.toastr.success('Entry removed successfully');
  }

  // Get saved rows for current tab
  getSavedRowsForCurrentTab(): any[] {
    const field = this.sidebarTabs[this.activeTabId - 1]?.rowTableField;
    if (!field) return [];
    return this.dynamicFieldsService.getSavedRows(field.fieldCode);
  }

  // Save candidate data
  saveCandidate(): void {
    this.isSubmitted = true;

    if (
      !this.candidate.code ||
      !this.candidate.first_name ||
      !this.candidate.last_name ||
      !this.candidate.requisition

    ) {
      this.toastr.warning('Please fill all required fields');
      return;
    }


    delete (this.candidate as any).designation;
    delete (this.candidate as any).category;
    delete (this.candidate as any).remarks;
    if (this.title === 'edit') {
      delete (this.candidate as any).candidate_attachment;
      delete (this.candidate as any).candidate_experience;
      delete (this.candidate as any).candidate_qualification;
      delete (this.candidate as any).candidate_skills;
      delete (this.candidate as any).public_id;
      delete (this.candidate as any).requisition_public_id;
      delete (this.candidate as any).requisition_code;
      delete (this.candidate as any).requisition_name;
      delete (this.candidate as any).department_public_id;
      delete (this.candidate as any).department_name;
      delete (this.candidate as any).job_title_public_id;
      delete (this.candidate as any).job_title_name;
      delete (this.candidate as any).designation_public_id;
      delete (this.candidate as any).designation_name;
      delete (this.candidate as any).created_date;
      // delete (this.candidate as any).is_active;



    }
    // debugger
    // console.log("RowTableData:", this.dynamicFieldsService.rowTableData);


    this.candidate.onboarding_status = 'IN_PROGRESS';
    this.candidate.status = 'APPLIED';

    const completeData = this.dynamicFieldsService.getCompleteFormDataMultiple(this.candidate);

    if (this.title === 'create') {
      this.loader.show();

      // API call to save data
      this.formsService.saveFormData('CANDIDATE', completeData).subscribe({
        next: (res: any) => {
          this.toastr.success('Candidate data saved successfully');
          this.loader.hide();
          // Clear row table data after successful save
          this.dynamicFieldsService.rowTableData = {};
          this.router.navigate(['/panel/onboarding/view-all-candidates']);
        },
        error: (err: any) => {
          console.error('Error saving candidate data:', err);
          this.toastr.error('Failed to save candidate data');
          this.loader.hide();
        }
      });
    } else {
      // const cleanedRows: any = {};

      // Object.keys(completeData.rows).forEach(tableKey => {

      //   cleanedRows[tableKey] = completeData.rows[tableKey].map((row: any) => {

      //     const { is_active, created_date, ...rest } = row;
      //     return rest;

      //   });

      // });

      // completeData.rows = cleanedRows;

      this.formsService.updateFormData('CANDIDATE', this.candidate.code, completeData).subscribe({
        next: (res: any) => {
          this.toastr.success('Candidate data updated successfully');
          // Clear row table data after successful update
          this.dynamicFieldsService.rowTableData = {};
          this.router.navigate(['/panel/onboarding/view-all-candidates']);
        }
        , error: (err: any) => {
          console.error('Error updating candidate data:', err);
          this.toastr.error('Failed to update candidate data');
        }
      });
    }

    // For now just show success

  }

  onCancel(): void {
    this.router.navigate(['/panel/onboarding/view-all-candidates']);
  }
  getFormFileds() {
    this.formsService.getFormByFormCode('CANDIDATE').subscribe({
      next: (res: any) => {
        console.log('Form Fields:', res);

        // safety check
        if (res?.data?.fields && Array.isArray(res.data.fields)) {
          res.data.fields.forEach((field: any) => {
            this.backendFieldsMap[field.fieldCode] = field.active;
            if (field.fieldCode === 'gender') {
              this.genderEnumArray = field.enumValues || [];
            }
            if (field.fieldCode === 'status') {
              this.candidateEnumArray = field.enumValues || [];
            }
            if (field.fieldCode === 'onboarding_status') {
              this.onboardingStatusEnumArray = field.enumValues || [];
            }
            if (field.fieldCode === 'religion') {
              this.religionEnumArray = field.enumValues || [];
            }
          });
        }
      },
      error: (err: any) => {
        console.error('Error fetching form fields:', err);
      }
    });
  }

  isFieldActive(fieldCode: string): boolean {
    return this.backendFieldsMap[fieldCode] !== false;
  }
  fetchLookupOptions(fieldCode: string): void {
    this.formsService.getLokupTableByCode(fieldCode).subscribe({
      next: (res: any) => {
        let data: LookupDto[] = res?.data || [];

        if (fieldCode === 'department') {
          this.departmentDropDownValue = data;
        }
        if (fieldCode === 'designation') {
          this.designationDropDownValue = data;
        }

      },
      error: (err: any) => {
        console.error(`Error fetching lookup options for ${fieldCode}:`, err);
      }
    });
  }
  fetchLookupOptionsWhenLokupTypeForm(fieldCode: string): void {

    this.formsService.getLokupTableByCodeWithFormType(fieldCode).subscribe({
      next: (res: any) => {

        let data = res?.data || [];
        if (fieldCode === 'job_requisition') {
          this.requsitionDropDownValue = data;
        }


      },
      error: (err: any) => {
        console.error(`Error fetching lookup options for ${fieldCode}:`, err);
      }
    });
  }




  resetForm(): void {
    // Reset candidate object
    this.candidate = new CandidateCreateDto();
    // Reset dropdown display values
    this.genderEnumArray = [];
    this.candidateEnumArray = [];
    this.onboardingStatusEnumArray = [];
    this.requsitionDropDownValue = [];
    this.departmentDropDownValue = [];
    this.designationDropDownValue = [];
    this.requisitionDisplayValue = '';
    // Reset loaded lookups to allow fresh fetch on next form
    // Reset dynamic fields
    this.dynamicFieldsService.resetDynamicFields();
  }

  getCandidateData() {

    this.onboardingService.getAllCandidatesTables(this.currentPage, this.itemsPerPage, this.editCandidatePublicId).subscribe({
      next: (res: any) => {
        this.loader.hide();

        this.candidateTableListArray = res.data || [];
        if (this.title === 'edit') {

          this.candidate = this.candidateTableListArray.find(c => c.public_id === this.editCandidatePublicId) as any;
          let data = this.candidateTableListArray.find(c => c.public_id === this.editCandidatePublicId) as any
          this.requisitionDisplayValue = data.requisition_name || ''
          this.selectedDesignationDisplay = data.designation_name || ''
          this.candidate.requisition = data.requisition_code || ''
          // Populate dynamic fields data from backend
          console.log('📊 Full candidate data from backend:', data);
          this.populateDynamicFieldsFromBackend(data);
        }
        if (res.paginator) {
          this.currentPage = res.paginator.currentPage;
          this.totalItems = res.paginator.totalItems;
          this.totalPages = res.paginator.totalPages;
          // console.log('Pagination:', res.paginator);
        }


      },
      error: (err: any) => {
        console.error('Error fetching requisition data:', err);
        this.loader.hide();

      }
    });
  }

  populateDynamicFieldsFromBackend(data: any) {

    console.log('\n🔄 Starting populateDynamicFieldsFromBackend...');

    // Populate single dynamic fields (non-ROW fields)
    this.dynamicFieldsService.dynamicFields.forEach(field => {
      if (data[field.fieldCode]) {
        this.dynamicFieldsService.dynamicFieldsData[field.fieldCode] = data[field.fieldCode];
      }
    });

    console.log('🔍 Available rowTableFields:', this.dynamicFieldsService.rowTableFields.map(f => f.fieldCode));
    console.log('🔍 Backend data keys:', Object.keys(data).filter(k =>
      ['candidate_attachment', 'candidate_experience', 'candidate_qualification', 'candidate_skills'].includes(k)
    ));

    // Populate ROW table fields with backend data by matching field codes
    this.dynamicFieldsService.rowTableFields.forEach((field) => {
      console.log(`\n📋 Processing field: ${field.fieldCode}`);
      console.log(`   Label: ${field.label}`);
      console.log(`   Has rowColumns: ${!!field.rowColumns}, Count: ${field.rowColumns?.length || 0}`);

      // Get the data for this specific field by fieldCode directly from data object
      let rowDataArray = data[field.fieldCode];

      console.log(`   Data type: ${Array.isArray(rowDataArray) ? 'array' : typeof rowDataArray}`);
      console.log(`   Data:`, rowDataArray);

      if (rowDataArray && Array.isArray(rowDataArray) && rowDataArray.length > 0) {
        console.log(`   ✅ Found ${rowDataArray.length} rows for ${field.fieldCode}`);

        // Populate the entire table with all rows from backend
        this.dynamicFieldsService.populateRowTableFromBackend(field.fieldCode, rowDataArray);
        console.log(`   ✅ Populated table with ${rowDataArray.length} rows`);
      } else {
        if (!rowDataArray) {
          console.log(`   ❌ No data found in backend response for ${field.fieldCode}`);
        } else if (!Array.isArray(rowDataArray)) {
          console.log(`   ❌ Data is not an array for ${field.fieldCode}:`, typeof rowDataArray);
        } else {
          console.log(`   ⚠️ Empty array for ${field.fieldCode}`);
        }
      }
    });

    console.log('\n✅ Dynamic fields population completed\n');
  }
  deleteCandidate(value: any) {
    let status = ''

    if (value.is_active) {
      status = 'deactivate'
    } else {
      status = 'activate'
    }
    this.formsService.deletValueInFromTbale('CANDIDATE', value.code, status).subscribe({
      next: (res: any) => {
        this.toastr.success('Candidate deleted successfully');
        this.getCandidateData(); // Refresh the list after deletion
      },
      error: (err: any) => {
        console.error('Error deleting candidate:', err);
        this.toastr.error('Failed to delete candidate');
      }
    });
  }

}
