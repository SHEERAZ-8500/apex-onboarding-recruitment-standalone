import { Component } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { LoaderService } from '../../../core/services/management-services/loader.service';
import {
  BookingApprovalService,
  BookingListItem,
  BookingStatus,
} from '../booking-app-service';

type ActionType = 'APPROVE' | 'DISAPPROVE' | 'ACCEPT' | '';

@Component({
  selector: 'app-booking-approval',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, DatePipe],
  templateUrl: './booking-approval.html',
  styleUrl: './booking-approval.scss',
})
export class BookingApproval {
  bookingList: BookingListItem[] = [];

  // Pagination
  totalItems = 0;
  totalPagesCount = 0;
  currentPage = 1;
  itemsPerPage = 6;

  // Filters
  searchTerm = '';
  statusFilter: BookingStatus | '' = '';

  private searchTimeout: any;

  // Action modal
  showActionModal = false;
  selectedBooking: BookingListItem | null = null;
  selectedAction: ActionType = '';

  internalNote = '';
  rejectionReason = '';
  releaseUnit = false;

  // View detail modal
  showDetailsModal = false;
  bookingDetails: any = null;

  isSubmitting = false;

  constructor(
    private bookingService: BookingApprovalService,
    private loader: LoaderService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  get isAnyFilterActive(): boolean {
    return !!(this.searchTerm || this.statusFilter);
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
    return this.totalItems === 0
      ? 0
      : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get lastItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  loadBookings(): void {
    this.loader.show();

    const statusValue: BookingStatus | undefined =
      this.statusFilter || undefined;

    this.bookingService
      .getAllBookings(
        this.currentPage - 1,
        this.itemsPerPage,
        statusValue,
        this.searchTerm.trim() || undefined,
      )
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
            error?.error?.message || 'Unable to load booking approvals',
            'Error',
          );
        },
      });
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.loadBookings();
    }, 500);
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadBookings();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadBookings();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.loadBookings();
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.loadBookings();
  }

  // ================= Status Badge =================

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


  // Status mapping for display (Single word)
getDisplayStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'DECISION_PENDING': 'Pending',
    'PAYMENT_REJECTED': 'Rejected',
    'APPROVAL': 'Approved',
    'ACCEPTANCE': 'Accepted',
    'EXPIRED': 'Expired'
  };
  
  return statusMap[status] || status;
}
  // ================= Action Modal =================

  openActionModal(booking: BookingListItem): void {
    this.selectedBooking = booking;
    this.selectedAction = '';
    this.internalNote = '';
    this.rejectionReason = '';
    this.releaseUnit = false;
    this.showActionModal = true;
  }

  closeActionModal(): void {
    this.showActionModal = false;
    this.selectedBooking = null;
    this.selectedAction = '';
    this.internalNote = '';
    this.rejectionReason = '';
    this.releaseUnit = false;
  }

  selectAction(action: ActionType): void {
    this.selectedAction = action;
    this.internalNote = '';
    this.rejectionReason = '';
    this.releaseUnit = false;
  }

  get actionTitle(): string {
    switch (this.selectedAction) {
      case 'APPROVE':
        return 'Approve Payment';

      case 'DISAPPROVE':
        return 'Disapprove Payment';

      case 'ACCEPT':
        return 'Accept & Allocate Booking';

      default:
        return 'Select Booking Action';
    }
  }

  submitAction(): void {
    if (!this.selectedBooking?.publicId || !this.selectedAction) {
      return;
    }

    if (
      this.selectedAction === 'DISAPPROVE' &&
      !this.rejectionReason.trim()
    ) {
      this.toastr.error('Please enter rejection reason');
      return;
    }

    if (!this.internalNote.trim()) {
      this.toastr.error('Please enter internal note');
      return;
    }

    this.isSubmitting = true;
    this.loader.show();

    const publicId = this.selectedBooking.publicId;

    if (this.selectedAction === 'DISAPPROVE') {
      this.bookingService
        .disapprovePayment(publicId, {
          reason: this.rejectionReason.trim(),
          internalNote: this.internalNote.trim(),
          releaseUnit: this.releaseUnit,
        })
        .subscribe({
          next: (response: any) => {
            this.handleActionSuccess(
              response?.message || 'Payment disapproved successfully',
            );
          },
          error: (error: any) => this.handleActionError(error),
        });

      return;
    }

    if (this.selectedAction === 'APPROVE') {
      this.bookingService
        .approvePayment(publicId, {
          internalNote: this.internalNote.trim(),
        })
        .subscribe({
          next: (response: any) => {
            this.handleActionSuccess(
              response?.message || 'Payment approved successfully',
            );
          },
          error: (error: any) => this.handleActionError(error),
        });

      return;
    }

    if (this.selectedAction === 'ACCEPT') {
      this.bookingService
        .acceptBooking(publicId, {
          internalNote: this.internalNote.trim(),
        })
        .subscribe({
          next: (response: any) => {
            this.handleActionSuccess(
              response?.message || 'Booking accepted successfully',
            );
          },
          error: (error: any) => this.handleActionError(error),
        });
    }
  }

  private handleActionSuccess(message: string): void {
    this.loader.hide();
    this.isSubmitting = false;

    this.toastr.success(message, 'Success');
    this.closeActionModal();
    this.loadBookings();
  }

  private handleActionError(error: any): void {
    this.loader.hide();
    this.isSubmitting = false;

    this.toastr.error(
      error?.error?.message || 'Unable to process booking action',
      'Error',
    );
  }

  // ================= Details Modal =================

  viewBookingDetails(booking: BookingListItem): void {
    this.loader.show();

    this.bookingService.getBookingById(booking.publicId).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.bookingDetails = response?.data || response;
        this.showDetailsModal = true;
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

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.bookingDetails = null;
  }
}