import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/apis/api.service';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-udd',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-udd.component.html',
  styleUrl: './create-udd.component.scss'
})
export class CreateUddComponent implements OnInit {
  // Form Code from URL
  formCode: string = '';
  step: string = '';

  // Form Fields
  fieldCode: string = '';
  label: string = '';
  enumComponentCode: string = '';
  selectedEnumLabel: string = '';
  displayOrder: number | null = null;
  selectTable: any = [];
  isEnumDropdownOpen: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private loader: LoaderService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Get formCode and step from URL query params
    this.route.queryParams.subscribe(params => {
      this.formCode = params['formCode'] || '';
      this.step = params['step'] || '';
    });
    if (this.step) {
      this.selectLinkType(this.step);
    }
  }

  // Select link type and update URL
  selectLinkType(stepValue: string): void {
    this.step = stepValue;
    this.selectTable = [];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { formCode: this.formCode, step: stepValue },
      queryParamsHandling: 'merge'
    });
    if (stepValue === '1') {
      this.loader.show();
      this.apiService.getAllLookUpTables().subscribe({
        next: (response: any) => {
          // console.log('Lookup Tables:', response);
          this.selectTable = response.data;
          this.loader.hide();
        },
        error: (error: any) => {
          // console.error('Error fetching lookup tables:', error);
          this.loader.hide();
        }
      });
    } else if (stepValue === '2') {
      this.loader.show();
      this.apiService.getAllLookupEnums().subscribe({
        next: (response: any) => {
          // console.log('Lookup Enums:', response);  
          this.selectTable = response.data;

          this.loader.hide();
        },
        error: (error: any) => {
          // console.error('Error fetching lookup enums:', error);
          this.loader.hide();
        }
      });
    } 
    // else if (stepValue === '3') {
    //   this.loader.show();
    //   // Uncomment when API is ready
    //   this.apiService.getAllIndependentTables().subscribe({
    //     next: (response: any) => {
    //       console.log('Independent Row Tables:', response);
    //       this.selectTable = response.data;
    //       this.loader.hide();
    //     },
    //     error: (error: any) => {
    //       console.error('Error fetching independent row tables:', error);
    //       this.loader.hide();
    //     }
    //   });
      

    // }
  }

  // Change step (go back to selection)
  changeStep(): void {
    this.step = '';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { formCode: this.formCode, step: null },
      queryParamsHandling: 'merge'
    });
    this.resetForm();
  }

  // Replace spaces with underscores in field code
  onFieldCodeInput(): void {
    this.fieldCode = this.fieldCode.replace(/\s+/g, '_');
  }

  // Toggle Enum Dropdown
  toggleEnumDropdown(event: Event): void {
    event.stopPropagation();
    this.isEnumDropdownOpen = !this.isEnumDropdownOpen;
  }

  // Select Enum Component
  selectEnumComponent(item: any, event: Event): void {
    event.stopPropagation();
    this.enumComponentCode = this.step === '1' ? item.componentCode : this.step === '2' ? item.enumComponentCode : item.rowComponentCode;
    this.selectedEnumLabel = `${item.displayName}`;
    this.isEnumDropdownOpen = false;
    
  }

  // Close dropdown on document click
  @HostListener('document:click', ['$event'])
  closeEnumDropdown(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown')) {
      this.isEnumDropdownOpen = false;
    }
  }

  // Submit Form
  onSubmit(): void {
    // Validation
    if (!this.fieldCode || !this.label || !this.enumComponentCode || !this.displayOrder) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    const payload = {
      fieldCode: this.fieldCode,
      label: this.label,
      [this.step === '1' ? 'lookupComponentCode' : this.step === '2' ? 'enumComponentCode' : 'rowComponentCode']: this.enumComponentCode,
      displayOrder: this.displayOrder
    };


    this.loader.show();

    // Uncomment when API is ready
    const apiMethod = this.step === '1'
      ? this.apiService.createNewUDDLookupTable(this.formCode, payload)
      : this.step === '2'
      ? this.apiService.createNewUDDLookupEnum(this.formCode, payload)
      : this.apiService.createNewUDDIndependentTable(this.formCode, payload);

    apiMethod.subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.toastr.success('UDD field created successfully');
        this.resetForm();
      },
      error: (error: any) => {
        this.loader.hide();
        this.toastr.error(error?.error?.message || 'Failed to create UDD field');
      }
    });


  }

  // Cancel
  onCancel(): void {
    this.resetForm();
    this.router.navigate(['/panel/forms/view-all-forms']);
  }

  // Reset Form
  resetForm(): void {
    this.fieldCode = '';
    this.label = '';
    this.enumComponentCode = '';
    this.selectedEnumLabel = '';
    this.displayOrder = null;
    this.isEnumDropdownOpen = false;
  }
}
