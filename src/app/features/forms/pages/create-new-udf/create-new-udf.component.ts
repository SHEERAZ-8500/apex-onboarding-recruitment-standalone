import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/apis/api.service';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-new-udf',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-new-udf.component.html',
  styleUrls: ['./create-new-udf.component.scss']
})
export class CreateNewUdfComponent implements OnInit {
  // Form Code from URL
  formCode: string = '';

  // Form Fields
  fieldCode: string = '';
  label: string = '';
  fieldType: string = '';
  required: boolean = false;
  maxLength: number | null = null;
  precision: number | null = null;
  scale: number | null = null;
  validationRegex: string = '';
  displayOrder: number | null = null;

  // Dropdown State
  isFieldTypeDropdownOpen: boolean = false;
  selectedFieldType: string = '';

  // Field Type Options
  fieldTypes: string[] = [
    'STRING',
    'NUMBER',
    'DATE',
    'BOOLEAN',
    'EMAIL',
    'PHONE',
    'URL',
    'TEXTAREA'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private loader: LoaderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Get formCode from URL query params
    this.route.queryParams.subscribe(params => {
      this.formCode = params['formCode'] || '';
    });
  }

  // Field Type Dropdown
  toggleFieldTypeDropdown(event: Event): void {
    event.stopPropagation();
    this.isFieldTypeDropdownOpen = !this.isFieldTypeDropdownOpen;
  }

  selectFieldType(type: string, event: Event): void {
    event.stopPropagation();
    this.selectedFieldType = type;
    this.fieldType = type;
    this.isFieldTypeDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event): void {
    this.isFieldTypeDropdownOpen = false;
  }

  // Replace spaces with underscores in field code
  onFieldCodeInput(): void {
    this.fieldCode = this.fieldCode.replace(/\s+/g, '_');
  }

  // Submit Form
  onSubmit(): void {
    // Validation
    if ( !this.fieldCode || !this.label || !this.fieldType ) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    const payload: any = {
      fieldCode: this.fieldCode,
      label: this.label,
      fieldType: this.fieldType,
      required: this.required,
      maxLength: this.maxLength || 0,
      precision: this.precision || 0,
      scale: this.scale || 0,
      validationRegex: this.validationRegex || '',
      displayOrder: this.displayOrder
    };

    this.loader.show();

    this.apiService.createNewUDF(this.formCode,payload).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.toastr.success('UDF field created successfully');
        this.resetForm();
      },
      error: (error: any) => {
        this.loader.hide();
        this.toastr.error(error?.error?.message || 'Failed to create UDF field');
      }
    });
  }

  // Cancel
  onCancel(): void {
    this.router.navigate(['/panel/forms/view-all-forms']); 
  }

   

  // Reset Form
  resetForm(): void {
    this.fieldCode = '';
    this.label = '';
    this.fieldType = '';
    this.selectedFieldType = '';
    this.required = false;
    this.maxLength = null;
    this.precision = null;
    this.scale = null;
    this.validationRegex = '';
    this.displayOrder = null;
  }
}
