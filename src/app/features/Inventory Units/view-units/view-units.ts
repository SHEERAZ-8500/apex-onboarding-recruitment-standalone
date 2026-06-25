import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { LoaderService } from '../../../core/services/management-services/loader.service';
import { InventoryService } from '../../Inventory Units/i-units-service';
type UnitStatus = 'AVAILABLE' | 'HELD' | 'BOOKED';
type AdminUnitStatus = 'AVAILABLE' | 'BOOKED';
type PropertyType = 'APARTMENT' | 'OFFICE';
@Component({
  selector: 'app-view-units',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DecimalPipe],
  templateUrl: './view-units.html',
  styleUrl: './view-units.scss',
})



export class ViewUnits {
  unitList: any[] = [];

  // Pagination
  totalItems = 0;
  totalPagesCount = 0;
  currentPage = 1;
  itemsPerPage = 6;

  // Filters
  searchTerm = '';
 statusFilter: UnitStatus | '' = '';
propertyTypeFilter: PropertyType | '' = '';
  activeFilter = '';

  // Status modal
  showStatusModal = false;
  selectedUnit: any = null;
 selectedStatus: AdminUnitStatus = 'AVAILABLE'

  private searchTimeout: any;

  constructor(
    private inventoryService: InventoryService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  ngOnInit(): void {
    this.loadUnits();
  }

  get isAnyFilterActive(): boolean {
    return !!(
      this.searchTerm ||
      this.statusFilter ||
      this.propertyTypeFilter ||
      this.activeFilter !== ''
    );
  }

  get totalPages(): number {
    return this.totalPagesCount || 1;
  }

  get totalPagesArray(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (current >= total - 2) {
        pages.push(total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(current - 2, current - 1, current, current + 1, current + 2);
      }
    }

    return pages;
  }

  get firstItem(): number {
    return this.totalItems === 0
      ? 0
      : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get lastItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

loadUnits(): void {
  this.loader.show();

  const activeValue =
    this.activeFilter === ''
      ? undefined
      : this.activeFilter === 'true';

  const statusValue: UnitStatus | undefined =
    this.statusFilter === '' ? undefined : this.statusFilter;

  const propertyTypeValue: PropertyType | undefined =
    this.propertyTypeFilter === '' ? undefined : this.propertyTypeFilter;

  this.inventoryService
    .getAllUnits(
      this.currentPage - 1,
      this.itemsPerPage,
      statusValue,
      propertyTypeValue,
      undefined,
      this.searchTerm.trim() || undefined,
      activeValue,
    )
    .subscribe({
      next: (response: any) => {
        this.loader.hide();

        this.unitList = response?.data || [];
        this.totalItems = response?.paginator?.totalItems || 0;
        this.totalPagesCount = response?.paginator?.totalPages || 1;
        this.currentPage = (response?.paginator?.currentPage ?? 0) + 1;
      },
      error: (error: any) => {
        this.loader.hide();
        this.toastr.error(
          error?.error?.message || 'Error fetching inventory units',
        );
        this.unitList = [];
      },
    });
}

  onSearch(): void {
    // Har key press par API call na ho, 500ms baad call hogi
    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.loadUnits();
    }, 500);
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadUnits();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.propertyTypeFilter = '';
    this.activeFilter = '';
    this.currentPage = 1;

    this.loadUnits();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.loadUnits();
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.loadUnits();
  }

  // ===== Status Update =====

  openStatusModal(unit: any): void {
    this.selectedUnit = unit;

    // HELD ho to dropdown default AVAILABLE rahega,
    // kyun ke HELD manually update nahi hota.
    this.selectedStatus =
      unit.status === 'BOOKED' ? 'BOOKED' : 'AVAILABLE';

    this.showStatusModal = true;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    this.selectedUnit = null;
    this.selectedStatus = 'AVAILABLE';
  }

  updateUnitStatus(): void {
    if (!this.selectedUnit?.publicId) {
      return;
    }

    this.loader.show();

    this.inventoryService
      .updateUnitStatus(this.selectedUnit.publicId, this.selectedStatus)
      .subscribe({
        next: (response: any) => {
          this.loader.hide();
          this.toastr.success(
            response?.message || 'Unit status updated successfully',
          );
          this.closeStatusModal();
          this.loadUnits();
        },
        error: (error: any) => {
          this.loader.hide();
          this.toastr.error(
            error?.error?.message || 'Unable to update unit status',
          );
        },
      });
  }

  // ===== Active Toggle =====

  toggleActiveStatus(unit: any, event: Event): void {
    const input = event.target as HTMLInputElement;
    const newActiveValue = input.checked;

    this.inventoryService
      .toggleUnitActiveStatus(unit.publicId, newActiveValue)
      .subscribe({
        next: (response: any) => {
          unit.isActive = newActiveValue;

          this.toastr.success(
            response?.message ||
              `Unit is now ${newActiveValue ? 'active' : 'inactive'}`,
          );
        },
        error: (error: any) => {
          // API fail ho to toggle wapis purani value par
          input.checked = !newActiveValue;

          this.toastr.error(
            error?.error?.message || 'Unable to update active status',
          );
        },
      });
  }

  // ===== Delete =====

  deleteUnit(unit: any): void {
    Swal.fire({
      title: 'Delete Unit?',
      text: `Are you sure you want to delete ${unit.unitNumber}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.loader.show();

      this.inventoryService.deleteUnit(unit.publicId).subscribe({
        next: (response: any) => {
          this.loader.hide();

          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: response?.message || 'Unit deleted successfully.',
            timer: 1800,
            showConfirmButton: false,
          });

          // Agar last item delete ho aur page empty ho jaye
          if (this.unitList.length === 1 && this.currentPage > 1) {
            this.currentPage--;
          }

          this.loadUnits();
        },
        error: (error: any) => {
          this.loader.hide();

          Swal.fire({
            icon: 'error',
            title: 'Cannot Delete',
            text:
              error?.error?.message ||
              'HELD or BOOKED unit cannot be deleted.',
          });
        },
      });
    });
  }

  // ===== Status Badge =====

  getUnitStatusBadgeClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'AVAILABLE':
        return 'status-badge available-badge';

      case 'HELD':
        return 'status-badge held-badge';

      case 'BOOKED':
        return 'status-badge booked-badge';

      default:
        return 'status-badge';
    }
  }

  getUnitStatusIcon(status: string): string {
    switch (status?.toUpperCase()) {
      case 'AVAILABLE':
        return 'fa-solid fa-circle-check';

      case 'HELD':
        return 'fa-solid fa-clock';

      case 'BOOKED':
        return 'fa-solid fa-calendar-check';

      default:
        return 'fa-solid fa-circle';
    }
  }
}