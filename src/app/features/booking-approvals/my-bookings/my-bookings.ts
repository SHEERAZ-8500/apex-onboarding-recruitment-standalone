import { Component } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { LoaderService } from '../../../core/services/management-services/loader.service';
import {
  ClientBookingsService,
  ClientBookingListItem,
  ClientBookingDetail,
  ClientBookingStatus,
  BookingDocumentItem,
} from '../myBookings-service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, DatePipe],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.scss',
})
export class MyBookings {
  bookingList: ClientBookingListItem[] = [];

  // Pagination
  totalItems = 0;
  totalPagesCount = 0;
  currentPage = 1;
  itemsPerPage = 6;

  // Filter
  statusFilter: ClientBookingStatus | '' = '';

  // Detail modal
  showDetailsModal = false;
  bookingDetails: ClientBookingDetail | null = null;
  bookingDocuments: BookingDocumentItem[] = [];
  loadingDocuments = false;

  // Resubmit evidence
  resubmitFiles: File[] = [];
  resubmitting = false;

  constructor(
    private bookingsService: ClientBookingsService,
    private loader: LoaderService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  get isAnyFilterActive(): boolean {
    return !!this.statusFilter;
  }

  get totalPages(): number {
    return this.totalPagesCount || 1;
  }

  get totalPagesArray(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
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
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get lastItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  // ===================== 5.5 List my bookings =====================

  loadBookings(): void {
    this.loader.show();

    const statusValue: ClientBookingStatus | undefined = this.statusFilter || undefined;

    this.bookingsService
      .getMyBookings(this.currentPage - 1, this.itemsPerPage, statusValue)
      .subscribe({
        next: (response) => {
          this.loader.hide();

          this.bookingList = response?.data || [];
          this.totalItems = response?.paginator?.totalItems || 0;
          this.totalPagesCount = response?.paginator?.totalPages || 1;
          this.currentPage = (response?.paginator?.currentPage ?? 0) + 1;
        },
        error: (error: any) => {
          this.loader.hide();
          this.bookingList = [];

          this.toastr.error(
            error?.error?.message || 'Unable to load your bookings',
            'Error',
          );
        },
      });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadBookings();
  }

  resetFilters(): void {
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadBookings();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.loadBookings();
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.loadBookings();
  }

  // ===================== Status badge helpers =====================

  getBookingStatusBadgeClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'DECISION_PENDING':
        return 'status-badge pending-badge';
      case 'PAYMENT_REJECTED':
        return 'status-badge rejected-badge';
      case 'APPROVAL':
        return 'status-badge approval-badge';
      case 'ACCEPTANCE':
        return 'status-badge accepted-badge';
      case 'EXPIRED':
        return 'status-badge expired-badge';
      default:
        return 'status-badge';
    }
  }

  getBookingStatusIcon(status: string): string {
    switch (status?.toUpperCase()) {
      case 'DECISION_PENDING':
        return 'fa-solid fa-clock';
      case 'PAYMENT_REJECTED':
        return 'fa-solid fa-circle-xmark';
      case 'APPROVAL':
        return 'fa-solid fa-circle-check';
      case 'ACCEPTANCE':
        return 'fa-solid fa-file-signature';
      case 'EXPIRED':
        return 'fa-solid fa-hourglass-end';
      default:
        return 'fa-solid fa-circle';
    }
  }

  getDisplayStatus(status: string): string {
    const statusMap: Record<string, string> = {
      DECISION_PENDING: 'Pending',
      PAYMENT_REJECTED: 'Rejected',
      APPROVAL: 'Approved',
      ACCEPTANCE: 'Accepted',
      EXPIRED: 'Expired',
    };

    return statusMap[status] || status;
  }

  get canResubmit(): boolean {
    return this.bookingDetails?.status === 'PAYMENT_REJECTED';
  }

  // ===================== 5.6 / 5.8 View details + documents =====================

  viewBookingDetails(booking: ClientBookingListItem): void {
    this.loader.show();
    this.resubmitFiles = [];

    this.bookingsService.getBookingById(booking.publicId).subscribe({
      next: (response) => {
        this.bookingDetails = response?.data || null;
        this.showDetailsModal = true;
        this.loadDocuments(booking.publicId);
        this.loader.hide();
      },
      error: (error: any) => {
        this.loader.hide();
        this.toastr.error(
          error?.error?.message || 'Unable to load booking details',
          'Error',
        );
      },
    });
  }

  private loadDocuments(publicId: string): void {
    this.loadingDocuments = true;

    this.bookingsService.getBookingDocuments(publicId).subscribe({
      next: (response) => {
        this.loadingDocuments = false;
        this.bookingDocuments = response?.data || [];
      },
      error: () => {
        this.loadingDocuments = false;
        this.bookingDocuments = [];
        // Non-fatal: documents (e.g. intimation letter) may simply not exist yet.
      },
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.bookingDetails = null;
    this.bookingDocuments = [];
    this.resubmitFiles = [];
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // ===================== 5.7 Resubmit payment evidence =====================

  onResubmitFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach((file) => {
      const alreadyAdded = this.resubmitFiles.some(
        (f) => f.name === file.name && f.size === file.size,
      );
      if (!alreadyAdded) {
        this.resubmitFiles.push(file);
      }
    });

    input.value = '';
  }

  removeResubmitFile(index: number): void {
    this.resubmitFiles.splice(index, 1);
  }

  resubmitEvidence(): void {
    if (!this.bookingDetails?.publicId) return;

    if (this.resubmitFiles.length === 0) {
      this.toastr.error('Please attach at least one updated payment proof file', 'Files Required');
      return;
    }

    this.resubmitting = true;
    this.loader.show();

    this.bookingsService
      .resubmitEvidence(this.bookingDetails.publicId, this.resubmitFiles)
      .subscribe({
        next: (response) => {
          this.loader.hide();
          this.resubmitting = false;

          this.toastr.success(
            response?.message || 'Payment evidence re-submitted for review',
            'Submitted',
          );

          this.resubmitFiles = [];

          if (response?.data) {
            this.bookingDetails = response.data;
          }

          this.loadBookings();
        },
        error: (error: any) => {
          this.loader.hide();
          this.resubmitting = false;

          this.toastr.error(
            error?.error?.message || 'Unable to re-submit payment evidence',
            'Error',
          );
        },
      });
  }
}