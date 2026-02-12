import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DynamicFieldsSharingService } from '../../../../core/services/management-services/dynamic-fields-sharing.service';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { InterviewSchedulingDto } from '../../dtos/interview.dto';
import { HrCandidateShortListingDto, InterviewsTableListingDto, LookupDto } from '../../../../shared/models/common/common-dto-';
import { OnboardingService } from '../../service/onboarding.service';
import { FormsService } from '../../../forms/services/forms.service';
import { PaginationComponent } from '../../../../shared/components/commons/components/pagination/pagination.component';

@Component({
  selector: 'app-interview-scheduling',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PaginationComponent],
  templateUrl: './interview-scheduling.component.html',
  styleUrls: ['./interview-scheduling.component.scss']
})
export class InterviewSchedulingComponent implements OnInit {

  title = 'view';
  formTitle = "";
  // Form Fields as DTO
  interview: InterviewSchedulingDto = new InterviewSchedulingDto();


  currentPage = 0; // Backend uses 0-based indexing
  itemsPerPage = 7;
  totalItems = 0;
  totalPages = 0;
  editInterviewPublicId: string = '';
  isSubmitted = false;

  // Dropdown States
  isCandidateDropdownOpen: boolean = false;
  isLocationDropdownOpen: boolean = false;
  isInterviewerDropdownOpen: boolean = false;
  isStatusDropdownOpen: boolean = false;

  // Backend field management - for static fields visibility
  backendFieldsMap: Record<string, boolean> = {};
  fieldConfigMap: Record<string, any> = {};

  // Display values for dropdowns
  selectedInterviewerDisplay: string = '';
  selectedCandidate: string = ''
  // Dropdown Options
  candidateOptions: HrCandidateShortListingDto[] = [];

  locationOptions: string[] = [];

  interviewTableListArray: InterviewsTableListingDto[] = [];

  interviewerOptions: any[] = [
    { id: 'CURRENT_USER', name: 'Current User', department: 'Admin' },

  ];

  statusOptions: string[] = [];

  // ...existing code for dropdown options...

  // Sidebar Tabs Data
  sidebarTabs: any[] = [];
  activeTabId: number = 1;

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

        this.getInterviewsData();

        // set view mode loigc
        //  this.fetchSkills()
      }
      if (this.title === 'edit') {
        this.loader.show();
        this.formTitle = "Edit Skill"
        this.dynamicFieldsService.loadDynamicFields('INTERVIEW', 'USER_DEFINED', [])
          .then(() => {
            // Get tabs from service
            this.sidebarTabs = this.dynamicFieldsService.sidebarTabs;
            this.activeTabId = this.dynamicFieldsService.activeTabId;
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
          this.editInterviewPublicId = id;

          this.getInterviewsData();


          // console.log(id);
        })

        this.getFormFileds();


      }
      if (this.title === 'create') {
        this.formTitle = "Create New Skill"
        this.dynamicFieldsService.loadDynamicFields('INTERVIEW', 'USER_DEFINED', [])
          .then(() => {
            // Get tabs from service
            this.sidebarTabs = this.dynamicFieldsService.sidebarTabs;
            this.activeTabId = this.dynamicFieldsService.activeTabId;
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


  // ✅ Pagination

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }


  changePage(page: number) {
    const apiPage = page - 1;
    if (apiPage < 0 || apiPage >= this.totalPages) return;
    this.currentPage = apiPage;
    this.getInterviewsData();

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
    this.router.navigate(['/panel/onboarding/view-all-interview-scheduling']);
  }

  // deleteSkill(index: number) {
  //   this.requisition.splice(index, 1);

  //   if (this.currentPage > this.totalPages && this.totalPages > 0) {
  //     this.currentPage = this.totalPages;
  //   }
  //   this.updatePagination();
  // }

  editSkill() {
    this.router.navigate(['/panel/onboarding/edit-interview-scheduling']);


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
    this.router.navigate(['/panel/onboarding/create-new-interview-scheduling']);
  }

  // createSkill() {
  //   if (!this.skillCode || !this.skillName) return;

  //   this.skills.push({
  //     code: this.skillCode,
  //     name: this.skillName,
  //   });

  //   this.hideForm();
  // }


  // Dropdown Handlers
  toggleCandidateDropdown(event: Event, field: string): void {
    event.stopPropagation();
    this.isCandidateDropdownOpen = !this.isCandidateDropdownOpen;
    // Close other dropdowns
    this.isLocationDropdownOpen = false;
    this.isInterviewerDropdownOpen = false;
    this.isStatusDropdownOpen = false;
    if (field === 'candidate') {
      this.shortListedCandidates()

    }
  }

  toggleLocationDropdown(event: Event): void {
    event.stopPropagation();
    this.isLocationDropdownOpen = !this.isLocationDropdownOpen;
    // Close other dropdowns
    this.isCandidateDropdownOpen = false;
    this.isInterviewerDropdownOpen = false;
    this.isStatusDropdownOpen = false;
  }

  toggleInterviewerDropdown(event: Event): void {
    event.stopPropagation();
    this.isInterviewerDropdownOpen = !this.isInterviewerDropdownOpen;
    // Close other dropdowns
    this.isCandidateDropdownOpen = false;
    this.isLocationDropdownOpen = false;
    this.isStatusDropdownOpen = false;
  }

  toggleStatusDropdown(event: Event): void {
    event.stopPropagation();
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
    // Close other dropdowns
    this.isCandidateDropdownOpen = false;
    this.isLocationDropdownOpen = false;
    this.isInterviewerDropdownOpen = false;
  }

  // Selection Handlers
  selectCandidate(candidate: any, event: Event): void {
    event.stopPropagation();
    this.selectedCandidate = `${candidate.firstName} ${candidate.lastName}`;
    this.interview.candidate = candidate.publicId;
    this.isCandidateDropdownOpen = false;
  }

  selectLocation(location: string, event: Event): void {
    event.stopPropagation();
    this.interview.location = location;
    this.isLocationDropdownOpen = false;

    // Auto-set meeting URL if virtual location selected
    if (location.includes('Virtual')) {
      if (location.includes('Google Meet')) {
        this.interview.meeting_url = 'https://meet.google.com/';
      } else if (location.includes('Zoom')) {
        this.interview.meeting_url = 'https://zoom.us/j/';
      }
    }
  }

  selectInterviewer(interviewer: any, event: Event): void {
    event.stopPropagation();
    (this.interview as any).interviewer_user = interviewer.name;
    this.selectedInterviewerDisplay = interviewer.name;
    this.isInterviewerDropdownOpen = false;
  }

  selectStatus(status: string, event: Event): void {
    event.stopPropagation();
    this.interview.interview_status = status;
    this.isStatusDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeAllDropdowns(event: Event): void {
    this.isCandidateDropdownOpen = false;
    this.isLocationDropdownOpen = false;
    this.isInterviewerDropdownOpen = false;
    this.isStatusDropdownOpen = false;
    this.dynamicFieldsService.closeAllDropdowns();
  }

  // Set active tab
  setActiveTab(tabId: number): void {
    this.activeTabId = tabId;
    this.dynamicFieldsService.setActiveTab(tabId);
  }

  // Save interview scheduling data
  saveInterview(): void {

 this.isSubmitted = true;
    if (
      !this.interview.candidate ||
      !this.interview.interview_date ||
      !this.interview.start_time ||
      !this.interview.location ||
      !this.interview.interview_status

    ) {
      this.toastr.warning('Please fill all required fields');
      return;
    }
    // Remove interviewer if its source is 'current user'
    if (this.fieldConfigMap['interviewer_user']?.source === 'CURRENT_USER') {
      delete (this.interview as any).interviewer_user;
    }

    // Format start_time to HH:mm:ss if it exists and is in HH:mm format
    if (this.interview.start_time && this.interview.start_time.length === 5) {
      this.interview.start_time = this.interview.start_time + ':00';
    }
    this.interview.interview_status = 'SCHEDULED'
    const completeData = this.dynamicFieldsService.getCompleteFormData(this.interview);

    if (this.title === 'create') {
      this.loader.show();
      // API call to save data
      this.formsService.saveFormData('INTERVIEW', completeData).subscribe({
        next: (res: any) => {
          this.toastr.success('Interview scheduled successfully');
          this.loader.hide();
          this.resetForm();
          this.router.navigate(['/panel/onboarding/view-all-interview-scheduling']);
        },
        error: (err: any) => {
          console.error('Error saving interview:', err);
          this.toastr.error('Failed to schedule interview');
          this.loader.hide();
        }
      });
    }else{
       this.formsService.updateFormData('INTERVIEW', this.interviewTableListArray[0].code, completeData).subscribe({
        next: (res: any) => {
          this.toastr.success('Interview updated successfully');
          this.loader.hide();
          this.resetForm();
          this.router.navigate(['/panel/onboarding/view-all-interview-scheduling']);
        },
        error: (err: any) => {
          console.error('Error updating interview:', err);
          this.toastr.error('Failed to update interview');
          this.loader.hide();
        }
      });
    }


  }

  onCancel(): void {
    this.router.navigate(['/panel/onboarding/view-all-interview-scheduling']);
  }

  resetForm(): void {
    // Reset interview object
    this.interview = new InterviewSchedulingDto();
    this.interview.is_active = true;

    // Reset dropdown display values
    this.selectedCandidate = '';
    this.selectedInterviewerDisplay = '';

    // Reset dynamic fields
    this.dynamicFieldsService.resetDynamicFields();
  }

  getFormFileds() {
    this.formsService.getFormByFormCode('INTERVIEW').subscribe({
      next: (res: any) => {
        console.log('Form Fields:', res);

        // safety check
        if (res?.data?.fields && Array.isArray(res.data.fields)) {
          res.data.fields.forEach((field: any) => {
            this.backendFieldsMap[field.fieldCode] = field.active;            // Store field config including source
            if (field.fieldConfig) {
              this.fieldConfigMap[field.fieldCode] = field.fieldConfig;
            }
            if (field.fieldCode === 'location') {
              this.locationOptions = field.enumValues || [];
            }
            if (field.fieldCode === 'interview_status') {
              this.statusOptions = field.enumValues || [];
            }
            if (field.fieldCode === 'is_active') {
              this.interview['is_active'] = true;
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
        // if (fieldCode === 'candidate') {
        //   this.candidateOptions = data;
        // }


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
        if (fieldCode === 'candidate') {
          this.candidateOptions = data;
        }


      },
      error: (err: any) => {
        console.error(`Error fetching lookup options for ${fieldCode}:`, err);
      }
    });
  }

  getInterviewsData() {
    this.loader.show();
    this.onboardingService.getAllInterviewTables(this.currentPage, this.itemsPerPage, this.editInterviewPublicId).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.interviewTableListArray = res.data || [];
        if (this.title === 'edit') {
          if (this.interviewTableListArray) {

            let data = this.interviewTableListArray.find(interview => interview.candidatePublicId === this.editInterviewPublicId) as any;
            this.selectedCandidate = data.candidateFirstName + ' ' + data.candidateLastName;
            this.interview.candidate = data.candidatePublicId;
            this.interview.interview_date = data.interviewDate;
            this.interview.start_time = data.startTime;
            this.interview.location = data.interviewLocation;
            this.interview.interviewer_user = data.interviewerUserPublicId;
            this.selectedInterviewerDisplay = 'Current User';
            this.interview.interview_status = data.interviewStatus;
            this.interview.is_active = data.isActive;
            this.interview.meeting_url = data.meetingUrl;
            if (data.remarks === 'none') {
              data.remarks = '';
            }
            this.interview.remarks = data.remarks;
          }

        }
        if (res.paginator) {
          this.currentPage = res.paginator.currentPage;
          this.totalItems = res.paginator.totalItems;
          this.totalPages = res.paginator.totalPages;
          // console.log('Pagination:', res.paginator);
        }



      },
      error: (err: any) => {
        console.error('Error fetching Interviews data:', err);
        this.loader.hide();


      }
    });
  }

  shortListedCandidates() {
    if (this.candidateOptions.length > 0) {
      return
    }
    this.onboardingService.getAllCandidates('SHORTLISTED').subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.candidateOptions = res.data;
      },
      error: (err: any) => {
        console.error('Error fetching shortlisted candidates data:', err);
      }
    });
  }
    deleteInterview(value: any) {
    let status = ''
    if (value.isActive) {
      status = 'deactivate'
    }
    else {
      status = 'activate'
    }
    this.loader.show();
    this.formsService.deletValueInFromTbale('interview', value.code, status).subscribe({
      next: (res: any) => {
        this.toastr.success('Interview deleted successfully');
        this.getInterviewsData();
        this.loader.hide();
      }
      ,
      error: (err: any) => {
        // console.error('Error deleting interview:', err);
        this.toastr.error('Failed to delete interview');
        this.loader.hide();
      }
    });
  }
}