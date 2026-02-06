import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/apis/api.service';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-new-row',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-new-row.component.html',
  styleUrl: './create-new-row.component.scss'
})
export class CreateNewRowComponent implements OnInit {
  formCode: string = '';
  fieldCode: string = '';
  label: string = '';
  rowComponentCode: string = '';
  selectedRowLabel: string = '';
  displayOrder: number | null = null;
  selectTable: any = [];
  isRowDropdownOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private loader: LoaderService,
    private toastr: ToastrService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.formCode = params['formCode'] || '';
    });
    this.loadIndependentTables();
  }

  loadIndependentTables(): void {
    this.loader.show();
    this.apiService.getAllIndependentTables().subscribe({
      next: (response: any) => {
        console.log('Independent Row Tables:', response);
        this.selectTable = response.data;
        this.loader.hide();
      },
      error: (error: any) => {
        console.error('Error fetching independent row tables:', error);
        this.loader.hide();
      }
    });
  }

  toggleRowDropdown(event: Event): void {
    event.stopPropagation();
    this.isRowDropdownOpen = !this.isRowDropdownOpen;
  }

  selectRowComponent(item: any, event: Event): void {
    event.stopPropagation();
    this.rowComponentCode = item.rowComponentCode;
    this.selectedRowLabel = item.displayName;
    this.isRowDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeRowDropdown(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown')) {
      this.isRowDropdownOpen = false;
    }
  }

  onSubmit(): void {
    if (!this.fieldCode || !this.label || !this.rowComponentCode || !this.displayOrder) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    const payload = {
      fieldCode: this.fieldCode,
      label: this.label,
      rowComponentCode: this.rowComponentCode,
      displayOrder: this.displayOrder
    };

    this.loader.show();
    this.apiService.createNewUDDIndependentTable(this.formCode, payload).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.toastr.success('Row field created successfully');
        this.resetForm();
        this.location.back();
      },
      error: (error: any) => {
        this.loader.hide();
        this.toastr.error(error?.error?.message || 'Failed to create row field');
      }
    });
  }

  onCancel(): void {
    this.resetForm();
    this.router.navigate(['/panel/forms/view-all-forms']);
  }

  resetForm(): void {
    this.fieldCode = '';
    this.label = '';
    this.rowComponentCode = '';
    this.selectedRowLabel = '';
    this.displayOrder = null;
    this.isRowDropdownOpen = false;
  }
}
