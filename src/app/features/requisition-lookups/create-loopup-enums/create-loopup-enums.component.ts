import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/apis/api.service';
import { LoaderService } from '../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-loopup-enums',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-loopup-enums.component.html',
  styleUrl: './create-loopup-enums.component.scss'
})
export class CreateLoopupEnumsComponent implements OnInit {
  // Form Fields
  enumName: string = '';
  description: string = '';
  values: string[] = [''];
  pageTitle: string = 'Create Lookup Enum';
  pageSubtitle: string = 'Define a new lookup enumeration with values';
  currentPath: string | undefined;
  isAddMode: boolean = false;
  selectedEnum: string = '';
  editCaseValues: string[] = [];
  selectEditEnum: string = '';
  enumCode: string = '';
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private loader: LoaderService,
    private toastr: ToastrService,
    private location: Location
  ) { }

  ngOnInit(): void {
    // Check the current route path
    this.currentPath = this.activatedRoute.snapshot.routeConfig?.path;

    // Get query parameter
    this.activatedRoute.queryParams.subscribe(params => {
      this.selectedEnum = params['enum'] || '';
      this.enumCode = params['enumCode'] || '';
      console.log('Selected Enum:', this.selectedEnum);
    });

    if (this.currentPath === 'add-new-enum-value') {
      this.pageTitle = 'Add New Enum Value';
      this.pageSubtitle = this.selectedEnum
        ? `Add a new value to ${this.selectedEnum.replace(/_/g, ' ')}`
        : 'Add a new value to existing enumeration';
      this.isAddMode = true;
    } else if (this.currentPath === 'edit-new-enum-value') {
      this.pageTitle = 'Edit Enum Value';
      this.pageSubtitle = this.selectedEnum
        ? `Edit values of ${this.selectedEnum.replace(/_/g, ' ')}`
        : 'Edit values of existing enumeration';
      this.isAddMode = true;
      this.editCaseValues = this.activatedRoute.snapshot.queryParams['allEnums'] || [];
      this.selectEditEnum = this.selectedEnum;
    }

    else {
      this.pageTitle = 'Create Lookup Enum';
      this.pageSubtitle = 'Define a new lookup enumeration with values';
      this.isAddMode = false;
    }
  }

  // Add new value field
  addValue(): void {
    this.values.push('');
  }

  // Remove value field
  removeValue(index: number): void {
    if (this.values.length > 1) {
      this.values.splice(index, 1);
    }
  }

  // TrackBy function to prevent re-rendering
  trackByIndex(index: number): number {
    return index;
  }

  // Submit Form
  onSubmit(): void {
    // Validation
    if (!this.enumName || !this.description) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    // Filter out empty values
    const filteredValues = this.values.filter(v => v.trim() !== '');

    if (filteredValues.length === 0) {
      this.toastr.error('Please add at least one enum value');
      return;
    }

    const payload = {
      enumName: this.enumName,
      description: this.description,
      values: filteredValues
    };

    console.log('Payload:', payload);

    this.loader.show();

    // Uncomment when API is ready
    this.apiService.createLookupEnum(payload).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.toastr.success('Lookup enum created successfully');
        this.resetForm();
      },
      error: (error: any) => {
        this.loader.hide();
        this.toastr.error(error?.error?.message || 'Failed to create lookup enum');
      }
    });


  }

  // Submit Values Only (Add Mode)
  onSubmitValues(): void {
    // Validation
    if (!this.selectedEnum) {
      this.toastr.error('Enum parameter is missing');
      return;
    }


    if (this.currentPath === 'add-new-enum-value') {
      const filteredValues = this.values.filter(v => v.trim() !== '');

      if (filteredValues.length === 0) {
        this.toastr.error('Please add at least one enum value');
        return;
      }
      const payload = {

        add: filteredValues
      };
      this.apiService.addNewEnum(this.selectedEnum, payload).subscribe((response) => {
        this.loader.hide();
        this.toastr.success('Enum values added successfully');
        this.resetForm();
        this.location.back();
      }, error => {
        this.loader.hide();
        this.toastr.error(error?.error?.message || 'Failed to add enum values');
      });
    } else {
      if (this.selectEditEnum.trim() === '') {
        this.toastr.error('Enum value cannot be empty');
        return;
      }
      this.editCaseValues.forEach((value, index) => {
        if (value === this.selectedEnum) {
          this.editCaseValues[index] = this.selectEditEnum;
        }
      });

      const payload = {

        replace: this.editCaseValues
      };
      this.apiService.addNewEnum(this.enumCode, payload).subscribe((response) => {
        this.loader.hide();
        this.toastr.success('Enum value updated successfully');
        this.resetForm();
        this.location.back();
      }, error => {
        this.loader.hide();
        this.toastr.error(error?.error?.message || 'Failed to update enum value');
      });
    }



    this.loader.show();

    // Uncomment when API is ready



  }

  // Cancel
  onCancel(): void {
    this.resetForm();
    this.location.back();
  }

  // Reset Form
  resetForm(): void {
    this.enumName = '';
    this.description = '';
    this.values = [''];
  }
}
