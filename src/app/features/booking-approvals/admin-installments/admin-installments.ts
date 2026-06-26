import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../app/core/services/management-services/loader.service';
import {
  AdminInstallmentsService,
  GenerateInstallmentSchedulePayload,
  InstallmentResponse,
  InstallmentStatus,
  Paginator
} from '../admin-installments-service';

@Component({
  selector: 'app-admin-installments',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, DecimalPipe],
  templateUrl: './admin-installments.html',
  styleUrl: './admin-installments.scss'
})
export class AdminInstallments implements OnInit {
  installments: InstallmentResponse[] = [];

  selectedStatus: InstallmentStatus = 'SUBMITTED';
  statuses: InstallmentStatus[] = ['SUBMITTED', 'PENDING', 'OVERDUE', 'PAID'];

  page = 0;
  size = 6;
  searchTerm = '';
  private searchTimeout: any;

  paginator: Paginator = {
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  };

  isLoading = false;
  isSaving = false;

  // Status counts for tabs
  statusCounts: Record<InstallmentStatus, number> = {
    SUBMITTED: 0,
    PENDING: 0,
    OVERDUE: 0,
    PAID: 0
  };

  // Generate schedule modal
  showGenerateModal = false;
  selectedBookingPublicId = '';

  generateForm: GenerateInstallmentSchedulePayload = {
    numberOfInstallments: 3,
    frequencyMonths: 1,
    firstDueDate: ''
  };

  // Verify modal
  showVerifyModal = false;
  selectedInstallment: InstallmentResponse | null = null;

  // Reject modal
  showRejectModal = false;
  rejectReason = '';

  constructor(
    private installmentsService: AdminInstallmentsService,
    private toastr: ToastrService,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.loadInstallments();
  }

  get isAnyFilterActive(): boolean {
    return !!(this.searchTerm);
  }

  get totalPages(): number {
    return this.paginator.totalPages || 1;
  }

  get totalPagesArray(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    const current = this.page + 1;

    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else if (current <= 3) {
      pages.push(1, 2, 3, 4, 5);
    } else if (current >= total - 2) {
      pages.push(total - 4, total - 3, total - 2, total - 1, total);
    } else {
      pages.push(current - 2, current - 1, current, current + 1, current + 2);
    }
    return pages;
  }

  get firstItem(): number {
    return this.paginator.totalItems === 0
      ? 0
      : this.page * this.size + 1;
  }

  get lastItem(): number {
    return Math.min((this.page + 1) * this.size, this.paginator.totalItems);
  }

  loadInstallments(): void {
    this.isLoading = true;
    this.loader.show();

    // FIX: Pass only 3 arguments (status, page, size) - remove searchTerm
    this.installmentsService
      .getInstallments(this.selectedStatus, this.page, this.size)
      .subscribe({
        next: (response) => {
          this.installments = response?.data ?? [];
          this.paginator = response?.paginator ?? {
            currentPage: 0,
            totalItems: 0,
            totalPages: 0
          };
          this.isLoading = false;
          this.loader.hide();
        },
        error: () => {
          this.installments = [];
          this.isLoading = false;
          this.loader.hide();
        }
      });
  }

  // If you want to implement search, you need to handle it on the backend
  // or filter the results client-side. Here's a client-side filter approach:
  get filteredInstallments(): InstallmentResponse[] {
    if (!this.searchTerm.trim()) {
      return this.installments;
    }
    const term = this.searchTerm.toLowerCase().trim();
    return this.installments.filter(item => 
      item.bookingPublicId?.toLowerCase().includes(term) ||
      item.publicId?.toLowerCase().includes(term)
    );
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.page = 0;
      // If your API supports search, call loadInstallments()
      // Otherwise, just use client-side filtering
      // this.loadInstallments();
    }, 500);
  }

  onStatusChange(status: InstallmentStatus): void {
    if (this.selectedStatus === status) return;
    this.selectedStatus = status;
    this.page = 0;
    this.loadInstallments();
  }

  onStatusFilterChange(): void {
    this.page = 0;
    this.loadInstallments();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'SUBMITTED';
    this.page = 0;
    this.loadInstallments();
  }

  changePage(page: number): void {
    if (page < 0 || page >= this.paginator.totalPages || page === this.page) {
      return;
    }
    this.page = page;
    this.loadInstallments();
  }

  onItemsPerPageChange(): void {
    this.page = 0;
    this.loadInstallments();
  }

  refresh(): void {
    this.loadInstallments();
  }

  // Status badge styles
  getStatusBadgeClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'SUBMITTED':
        return 'status-badge submitted-badge';
      case 'PENDING':
        return 'status-badge pending-badge';
      case 'OVERDUE':
        return 'status-badge overdue-badge';
      case 'PAID':
        return 'status-badge paid-badge';
      default:
        return 'status-badge';
    }
  }

  getStatusIcon(status: string): string {
    switch (status?.toUpperCase()) {
      case 'SUBMITTED':
        return 'fa-solid fa-clock';
      case 'PENDING':
        return 'fa-solid fa-hourglass-half';
      case 'OVERDUE':
        return 'fa-solid fa-triangle-exclamation';
      case 'PAID':
        return 'fa-solid fa-circle-check';
      default:
        return 'fa-solid fa-circle';
    }
  }

  getStatusCount(status: InstallmentStatus): number {
    return this.statusCounts[status] || 0;
  }

  openGenerateModal(bookingPublicId = ''): void {
    this.selectedBookingPublicId = bookingPublicId;
    this.generateForm = {
      numberOfInstallments: 3,
      frequencyMonths: 1,
      firstDueDate: ''
    };
    this.showGenerateModal = true;
  }

  closeGenerateModal(): void {
    if (this.isSaving) return;
    this.showGenerateModal = false;
    this.selectedBookingPublicId = '';
  }

  generateSchedule(): void {
    const bookingPublicId = this.selectedBookingPublicId.trim();
    if (!bookingPublicId) {
      this.toastr.error('Booking Public ID is required.');
      return;
    }
    if (!this.generateForm.numberOfInstallments || this.generateForm.numberOfInstallments < 1) {
      this.toastr.error('Number of installments must be at least 1.');
      return;
    }
    if (!this.generateForm.frequencyMonths || this.generateForm.frequencyMonths < 1) {
      this.toastr.error('Frequency months must be at least 1.');
      return;
    }
    if (!this.generateForm.firstDueDate) {
      this.toastr.error('Please select the first due date.');
      return;
    }

    this.isSaving = true;
    this.loader.show();

    const payload: GenerateInstallmentSchedulePayload = {
      numberOfInstallments: Number(this.generateForm.numberOfInstallments),
      frequencyMonths: Number(this.generateForm.frequencyMonths),
      firstDueDate: this.generateForm.firstDueDate
    };

    this.installmentsService
      .generateSchedule(bookingPublicId, payload)
      .subscribe({
        next: (response) => {
          this.isSaving = false;
          this.loader.hide();
          this.showGenerateModal = false;
          this.toastr.success(response?.message || 'Installment schedule generated successfully.');
          this.selectedStatus = 'PENDING';
          this.page = 0;
          this.loadInstallments();
        },
        error: (error) => {
          this.isSaving = false;
          this.loader.hide();
          if (error?.status === 409) {
            this.toastr.error(error?.error?.message || 'Schedule cannot be regenerated because payment evidence already exists.');
            return;
          }
          this.toastr.error(error?.error?.message || 'Unable to generate installment schedule.');
        }
      });
  }

  openVerifyModal(installment: InstallmentResponse): void {
    this.selectedInstallment = installment;
    this.showVerifyModal = true;
  }

  closeVerifyModal(): void {
    if (this.isSaving) return;
    this.showVerifyModal = false;
    this.selectedInstallment = null;
  }

  verifyInstallment(): void {
    if (!this.selectedInstallment?.publicId) return;

    this.isSaving = true;
    this.loader.show();

    this.installmentsService
      .verifyInstallment(this.selectedInstallment.publicId)
      .subscribe({
        next: (response) => {
          this.isSaving = false;
          this.loader.hide();
          this.showVerifyModal = false;
          this.selectedInstallment = null;
          this.toastr.success(response?.message || 'Installment payment verified successfully.');
          this.loadInstallments();
        },
        error: (error) => {
          this.isSaving = false;
          this.loader.hide();
          this.toastr.error(error?.error?.message || 'Unable to verify installment payment.');
        }
      });
  }

  openRejectModal(installment: InstallmentResponse): void {
    this.selectedInstallment = installment;
    this.rejectReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal(): void {
    if (this.isSaving) return;
    this.showRejectModal = false;
    this.selectedInstallment = null;
    this.rejectReason = '';
  }

  rejectInstallment(): void {
    if (!this.selectedInstallment?.publicId) return;

    const reason = this.rejectReason.trim();
    if (!reason) {
      this.toastr.error('Please enter a rejection reason.');
      return;
    }

    this.isSaving = true;
    this.loader.show();

    this.installmentsService
      .rejectInstallment(this.selectedInstallment.publicId, { reason })
      .subscribe({
        next: (response) => {
          this.isSaving = false;
          this.loader.hide();
          this.showRejectModal = false;
          this.selectedInstallment = null;
          this.rejectReason = '';
          this.toastr.success(response?.message || 'Installment payment rejected successfully.');
          this.loadInstallments();
        },
        error: (error) => {
          this.isSaving = false;
          this.loader.hide();
          this.toastr.error(error?.error?.message || 'Unable to reject installment payment.');
        }
      });
  }

  getInstallmentNumber(installment: InstallmentResponse, index: number): number {
    return installment.installmentNumber ?? installment.sequenceNumber ?? this.page * this.size + index + 1;
  }

  getProofUrl(installment: InstallmentResponse): string | null {
    return installment.paymentProofUrl || installment.proofUrl || null;
  }

  canAudit(installment: InstallmentResponse): boolean {
    return installment.status === 'SUBMITTED';
  }
}