import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CandidateDto } from '../../dtos/candidate.dto';
import { FinalScreeningFormDto, LookupDto } from '../../../../shared/models/common/common-dto-';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { DynamicFieldsSharingService } from '../../../../core/services/management-services/dynamic-fields-sharing.service';
import { OnboardingService } from '../../service/onboarding.service';
import { FormsService } from '../../../forms/services/forms.service';
import { PaginationComponent } from '../../../../shared/components/commons/components/pagination/pagination.component';

@Component({
  selector: 'app-final-screening',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './final-screening.component.html',
  styleUrls: ['./final-screening.component.scss']
})
export class FinalScreeningComponent implements OnInit {

  finalScreening: FinalScreeningFormDto = new FinalScreeningFormDto();

  // Backend field management - for static fields visibility
  backendFieldsMap: Record<string, boolean> = {};
  fieldConfigMap: Record<string, any> = {};

  // Dropdown state
  activeDropdown: string = ''

  // Dropdown options
  candidateLisitng: CandidateDto[] = [];
  selectedCandidateInfo = {
    firstName: '',
    lastName: '',
  }
  candidateIds: string[] = ['CAN-001', 'CAN-002', 'CAN-003', 'CAN-004'];
  requisitions: string[] = ['REQ-2024-001', 'REQ-2024-002', 'REQ-2024-003'];
  interviewerStatuses: string[] = ['Scheduled', 'Completed', 'Rescheduled', 'Cancelled'];
  interviewerNames: string[] = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis'];
  finalStatuses: string[] = ['Selected', 'Rejected', 'On Hold', 'Pending'];
  payElements: LookupDto[] = [];
  payFrequencies: string[] = ['Monthly', 'Bi-Monthly', 'Weekly', 'Yearly'];

  // Sidebar Tabs Data
  sidebarTabs: any[] = [];
  activeTabId: number = 1;

  constructor(private router: Router, public dynamicFieldsService: DynamicFieldsSharingService,
    private toastr: ToastrService,
    private loader: LoaderService,
    private onboardingService: OnboardingService,
    private formsService: FormsService) { }


  ngOnInit(): void {
    this.getFormFileds();

    this.loader.show();
    this.dynamicFieldsService.loadDynamicFields('FINAL_DECISION', 'USER_DEFINED', [])
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
  }

  // Toggle Dropdown open/close
  toggleDropdown(event: Event, field: string): void {
    event.stopPropagation();
    
    if (field === 'candidateId') {
      if (this.candidateLisitng.length === 0) {
        this.allCandidate()
      }
    }if (field === 'payElement') {
      if (this.payElements.length === 0) {
        this.fetchLookupOptions('PAY_ELEMENT');
      }
    }
    if (this.activeDropdown === field) {
      this.activeDropdown = '';
    } else {
      this.activeDropdown = field;
    }
  }

  // Select option from dropdown
  selectOption(field: string, value: any, event: Event): void {
    event.stopPropagation();
    if (field === 'candidateId') {

      this.selectedCandidateInfo.firstName = value.firstName;
      this.selectedCandidateInfo.lastName = value.lastName;
    }
    (this.finalScreening as any)[field] = value;
    this.activeDropdown = '';
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
  }

  // Save candidate data
  saveFinalScreening(): void {

    // condtion please fill all required fields
    if (
      !this.finalScreening.candidateID ||
      !this.finalScreening.status
      // !this.finalScreening.payElement ||
      // !this.finalScreening.payFrequency ||
      // !this.finalScreening.amount
    ) {
      this.toastr.warning('Please fill all required fields');
      return;
    }

    const completeData = this.dynamicFieldsService.getCompleteFormData(this.finalScreening);

    this.loader.show();


    // For now just show success
    setTimeout(() => {
      this.toastr.success('Candidate data saved successfully');
      this.loader.hide();
    }, 1000);
  }


  onCancel(): void {
    this.router.navigate(['/panel']);
  }

  getFormFileds() {
    this.formsService.getFormByFormCode('FINAL_DECISION').subscribe({
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
            if (field.fieldCode === 'pay_element') {
              this.payElements = field.enumValues || [];
            }
            if (field.fieldCode === 'pay_frequency') {
              this.payFrequencies = field.enumValues || [];
            }
            if (field.fieldCode === 'final_status') {
              this.finalStatuses = field.enumValues || [];
            }
            if (field.fieldCode === 'is_active') {
              this.finalScreening['is_active'] = true;
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
  allCandidate() {
    this.onboardingService.getAllCandidates().subscribe({
      next: (res: any) => {
        console.log('All Candidates:', res);
        this.candidateLisitng = res.data || [];
      },
      error: (err: any) => {
        console.error('Error fetching candidates:', err);
      }
    });
  }
    fetchLookupOptions(fieldCode: string): void {
      this.formsService.getLokupTableByCode(fieldCode).subscribe({
        next: (res: any) => {
          let data: LookupDto[] = res?.data || [];
  
          if (fieldCode === 'PAY_ELEMENT') {
            this.payElements = data;
          }
          
  
        },
        error: (err: any) => {
          console.error(`Error fetching lookup options for ${fieldCode}:`, err);
        }
      });
    }
}