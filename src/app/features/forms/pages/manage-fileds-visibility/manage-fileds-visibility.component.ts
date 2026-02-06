import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/apis/api.service';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';

interface Field {
  fieldCode: string;
  label: string;
  fieldType: string;
  systemDefined: boolean;
  createdDate: string;
  dbColumnName?: string;
  maxLength?: number;
  nullable?: boolean;
  displayOrder: number;
  required: boolean;
  active: boolean;
  linkedComponent?: string;
  lookupTable?: string;
  enumClass?: string;
  enumValues?: string[];
}

interface FormData {
  formCode: string;
  displayName: string;
  baseTable: string;
  fields: Field[];
}

@Component({
  selector: 'app-manage-fileds-visibility',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-fileds-visibility.component.html',
  styleUrl: './manage-fileds-visibility.component.scss'
})
export class ManageFiledsVisibilityComponent implements OnInit {
  formCode: string = '';
  formData: FormData | null = null;
  fields: Field[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private loader: LoaderService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Get formCode from URL query params
    this.route.queryParams.subscribe(params => {
      this.formCode = params['formCode'] || '';
      if (this.formCode) {
        this.loadFormData();
      }
    });
  }

  // Load form data by ID
  loadFormData(): void {
    this.loader.show();
    this.apiService.getFormById(this.formCode).subscribe({
      next: (response: any) => {
        console.log('Form Data:', response);
        this.formData = response.data;
        this.fields = response.data.fields || [];
        this.loader.hide();
      },
      error: (error: any) => {
        console.error('Error fetching form data:', error);
        this.toastr.error(error?.error?.message || 'Failed to load form data');
        this.loader.hide();
      }
    });
  }

  // Toggle field active status
  toggleFieldStatus(field: Field): void {
    const newStatus = field.active;
    const status = newStatus ? 'activate' : 'deactivate';
    this.loader.show();
    this.apiService.manageFieldsVisibility(this.formCode, status, field.fieldCode).subscribe({
      next: (response: any) => {
        
        // field.active = newStatus;
        this.toastr.success(`Field ${newStatus ? 'activated' : 'deactivated'} successfully`);
        this.loader.hide();
      },
      error: (error: any) => {
        console.error('Error updating field status:', error);
        this.toastr.error(error?.error?.message || 'Failed to update field status');
        this.loader.hide();
      }
    });
  }

  // Get field type badge color
  getFieldTypeBadge(fieldType: string): string {
    const badges: { [key: string]: string } = {
      'STRING': 'badge-primary',
      'NUMBER': 'badge-success',
      'DATE': 'badge-info',
      'BOOLEAN': 'badge-warning',
      'LOOKUP_TABLE': 'badge-purple',
      'LOOKUP_ENUM': 'badge-orange',
      'ROW_TABLE': 'badge-pink'
    };
    return badges[fieldType] || 'badge-secondary';
  }
}
