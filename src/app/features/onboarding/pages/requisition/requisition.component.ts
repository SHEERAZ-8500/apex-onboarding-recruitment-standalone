import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicFieldsSharingService } from '../../../../core/services/management-services/dynamic-fields-sharing.service';
import { RequisitionDto } from '../../dtos/requisition.dto';
import { LookupDto, JobRequisitionTableListingDto } from '../../../../shared/models/common/common-dto-';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { OnboardingService } from '../../service/onboarding.service';
import { FormsService } from '../../../forms/services/forms.service';
import { PaginationComponent } from '../../../../shared/components/commons/components/pagination/pagination.component';

@Component({
  selector: 'app-requisition-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PaginationComponent],
  templateUrl: './requisition.component.html',
  styleUrls: ['./requisition.component.scss']
})
export class RequisitionComponent implements OnInit {

  title = 'view';
  formTitle = "";

  // Form fields as DTO
  requisition: RequisitionDto = new RequisitionDto();
  currentPage = 0; // Backend uses 0-based indexing
  itemsPerPage = 7;
  totalItems = 0;
  totalPages = 0;
  editJobRequisitionCode = '';
  // Dropdown state
  activeDropdown: string = '';
  

  // Dropdown options
  departments: LookupDto[] = [];
  jobTitles: LookupDto[] = [];
  designations: LookupDto[] = [];
  hiringManagers = ['Alice', 'Bob', 'Charlie'];
  backendFieldsMap: Record<string, boolean> = {};
  fieldConfigMap: Record<string, any> = {};
  lookupFields = ['job_title', 'designation', 'department']
  loadedLookups: Record<string, boolean> = {};
  jobRequisitionsArray: JobRequisitionTableListingDto[] = [];
  // Sidebar Tabs Data
  sidebarTabs: any[] = [];
  activeTabId: number = 1;
  departMentDropDownValue: string = '';
  jobTitleDropDownValue: string = '';
  designationDropDownValue: string = '';
  hiringManagerDropDownValue: string = '';
  editRequisitionPublicId: string = '';
  isSubmitted = false;
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
    // this.loader.show();



    this.activatedRoute.data.subscribe(data => {
      this.title = data['title'];
      if (this.title === 'view') {
        this.getRequisitionData();

        // set view mode loigc
        //  this.fetchSkills()
      }
      if (this.title === 'edit') {
        this.formTitle = "Edit Requisition"
        this.activatedRoute.queryParams.subscribe(params => {
          const id = params['id'];
          const currentPage = params['currentPage'];
          this.currentPage = currentPage;
          this.editRequisitionPublicId = id;
          this.getRequisitionData();



          // console.log(id);
        })
        this.dynamicFieldsService.loadDynamicFields('JOB_REQUISITION', 'USER_DEFINED', [])
          .then(() => {
            // Get tabs from service
            this.sidebarTabs = this.dynamicFieldsService.sidebarTabs;
            this.activeTabId = this.dynamicFieldsService.activeTabId;
            console.log('sidebarTabs:', this.sidebarTabs);
            if (this.sidebarTabs.length > 1) {
              console.log('rowTableField:', this.sidebarTabs[1]?.rowTableField);
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
      if (this.title === 'create') {
        this.formTitle = "Create New Requisition"
        this.dynamicFieldsService.loadDynamicFields('JOB_REQUISITION', 'USER_DEFINED', [])
          .then(() => {
            // Get tabs from service
            this.sidebarTabs = this.dynamicFieldsService.sidebarTabs;
            this.activeTabId = this.dynamicFieldsService.activeTabId;
            console.log('sidebarTabs:', this.sidebarTabs);
            if (this.sidebarTabs.length > 1) {
              console.log('rowTableField:', this.sidebarTabs[1]?.rowTableField);
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
    this.getRequisitionData();

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
    this.router.navigate(['/panel/onboarding/view-all-requisitions']);
  }

  // deleteSkill(index: number) {
  //   this.requisition.splice(index, 1);

  //   if (this.currentPage > this.totalPages && this.totalPages > 0) {
  //     this.currentPage = this.totalPages;
  //   }
  //   this.updatePagination();
  // }

  editSkill() {
    this.router.navigate(['/panel/onboarding/edit-requisition']);


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
    this.router.navigate(['/panel/onboarding/create-new-requisition']);
  }

  // createSkill() {
  //   if (!this.skillCode || !this.skillName) return;

  //   this.skills.push({
  //     code: this.skillCode,
  //     name: this.skillName,
  //   });

  //   this.hideForm();
  // }


  // Dropdown toggle
  toggleDropdown(event: Event, dropdownId: string) {
    event.stopPropagation();

    // Fetch lookup options on first click
    if (this.lookupFields.includes(dropdownId) && !this.loadedLookups[dropdownId]) {
      this.fetchLookupOptions(dropdownId);
      this.loadedLookups[dropdownId] = true;
    }

    this.activeDropdown = this.activeDropdown === dropdownId ? '' : dropdownId;
  }

  selectOption(field: string, value: LookupDto, event: Event) {
    event.stopPropagation();
    if (field === 'department') this.departMentDropDownValue = value.name;
    if (field === 'job_title') this.jobTitleDropDownValue = value.name;
    if (field === 'designation') this.designationDropDownValue = value.name;
    if (field === 'hiring_manager') this.hiringManagerDropDownValue = value.name;

    (this.requisition as any)[field] = value.code;
    this.activeDropdown = '';
  }
  selectHiringManager(field: string, value: string, event: Event) {
    event.stopPropagation();
    
    if (field === 'hiring_manager') this.hiringManagerDropDownValue = value;

    (this.requisition as any)[field] = value;
    this.activeDropdown = '';
  }

  @HostListener('document:click', ['$event'])
  closeDropdowns(event: Event) {
    this.activeDropdown = '';
    this.dynamicFieldsService.closeAllDropdowns();
  }

  // Set active tab
  setActiveTab(tabId: number): void {
    this.activeTabId = tabId;
    this.dynamicFieldsService.setActiveTab(tabId);
  }

  // Save requisition data
  saveRequisition(): void {
     this.isSubmitted = true;

    if (
      !this.requisition.requisition_name ||
      !this.requisition.department ||
      !this.requisition.job_title ||
      !this.requisition.designation ||
      // !this.requisition.hiring_manager ||
      !this.requisition.required_date
    ) {
      this.toastr.warning('Please fill all required fields');
      return;
    }
    // Remove hiring_manager if its source is 'current user'
   if (this.fieldConfigMap['hiring_manager']?.source === 'CURRENT_USER') {
  (this.requisition as any).hiring_manager = null;
}


    const completeData = this.dynamicFieldsService.getCompleteFormData(this.requisition);
    // console.log('Saving Requisition Data:', completeData);
    // API call to save data
    if (this.title === 'create') {
      this.loader.show();

      this.formsService.saveFormData('JOB_REQUISITION', completeData).subscribe({
        next: (res: any) => {
          this.toastr.success('Requisition created successfully');
          this.loader.hide();
          // Reset form after successful save
          this.resetForm();
          this.router.navigate(['/panel/onboarding/view-all-requisition']);
        },
        error: (err: any) => {
          console.error('Error saving requisition:', err);
          this.toastr.error('Failed to save requisition');
          this.loader.hide();
        }
      });
    } else {
      // Edit mode - update existing requisition
      this.formsService.updateFormData('JOB_REQUISITION', this.editJobRequisitionCode, completeData).subscribe({
        next: (res: any) => {
          this.toastr.success('Requisition updated successfully');
          this.loader.hide();
          // Reset form after successful update
          this.resetForm();
          this.router.navigate(['/panel/onboarding/view-all-requisition']);
        }
        ,
        error: (err: any) => {
          console.error('Error updating requisition:', err);
          this.toastr.error('Failed to update requisition');
          this.loader.hide();
        }
      });

    }


  }

  onCancel(): void {
    this.router.navigate(['/panel/onboarding/view-all-requisition']);
  }

  getFormFileds() {
    this.formsService.getFormByFormCode('JOB_REQUISITION').subscribe({
      next: (res: any) => {
        console.log('Form Fields:', res);

        // safety check
        if (res?.data?.fields && Array.isArray(res.data.fields)) {
          res.data.fields.forEach((field: any) => {
            this.backendFieldsMap[field.fieldCode] = field.active;
            // Store field config including source
            if (field.fieldConfig) {
              this.fieldConfigMap[field.fieldCode] = field.fieldConfig;
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
          this.departments = data;
        }
        if (fieldCode === 'job_title') {
          this.jobTitles = data;
        }
        if (fieldCode === 'designation') {
          this.designations = data;
        }

      },
      error: (err: any) => {
        console.error(`Error fetching lookup options for ${fieldCode}:`, err);
      }
    });
  }

  resetForm(): void {
    // Reset requisition object
    this.requisition = new RequisitionDto();
    // Reset dropdown display values
    this.departMentDropDownValue = '';
    this.jobTitleDropDownValue = '';
    this.designationDropDownValue = '';
    this.hiringManagerDropDownValue = '';
    // Reset loaded lookups to allow fresh fetch on next form
    this.loadedLookups = {};
    // Reset dynamic fields
    this.dynamicFieldsService.resetDynamicFields();
  }

  getRequisitionData() {
    this.loader.show();
    this.onboardingService.getAlljobsRequisiton(this.currentPage, this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.loader.hide();

        this.jobRequisitionsArray = res.data || [];
        if (this.title === 'edit') {

          let data = this.jobRequisitionsArray.find(jr => jr.publicId === this.editRequisitionPublicId) as any;
          this.editJobRequisitionCode = data.code
          this.requisition.requisition_name = data.requisitionName;
          this.requisition.department = data.departmentPublicId;
          this.departMentDropDownValue = data.departmentName;
          this.requisition.job_title = data.jobTitlePublicId;
          this.jobTitleDropDownValue = data.jobTitleName;
          this.requisition.designation = data.designationPublicId;
          this.designationDropDownValue = data.designationName;
          this.requisition.hiring_manager = data.hiringManager;
          this.hiringManagerDropDownValue = data.hiringManager;
          this.requisition.required_date = data.requiredDate;
          this.requisition.required_count = data.requiredCount || null;
          this.requisition.job_description = data.jobDescription || '';
          this.requisition.is_active = data.isActive;
          // Populate other fields as necessary
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
  deleteRequisition(value: any) {
    let status = ''
    if (value.isActive) {
      status = 'deactivate'
    }
    else {
      status = 'activate'
    }
    this.loader.show();
    this.formsService.deletValueInFromTbale('job-requisition', value.code, status).subscribe({
      next: (res: any) => {
        this.toastr.success('Requisition deleted successfully');
        this.getRequisitionData();
        this.loader.hide();
      }
      ,
      error: (err: any) => {
        console.error('Error deleting requisition:', err);
        this.toastr.error('Failed to delete requisition');
        this.loader.hide();
      }
    });
  }
}
