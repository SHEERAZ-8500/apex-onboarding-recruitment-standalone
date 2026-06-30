import { Component } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { LoaderService } from '../../../core/services/management-services/loader.service';
import {
  BookingApprovalService,
  BookingListItem,
  BookingStatus,
  BookingDetail,
} from '../booking-app-service';

type ActionType = 'APPROVE' | 'DISAPPROVE' | 'ACCEPT' | '';

/**
 * ============================================================
 * WORKFLOW MAP (matches docs section "Booking Approval Workflow")
 * ============================================================
 * DECISION_PENDING  -> admin can Approve Payment / Disapprove Payment
 * PAYMENT_REJECTED  -> no admin action, waiting for customer re-submit
 * APPROVAL          -> payment already approved, admin can Disapprove
 *                      (catch a bad payment even after approval) / Accept
 * ACCEPTANCE        -> terminal, unit BOOKED, view only
 * EXPIRED           -> terminal, sweeper closed it, view only
 * ============================================================
 *
 * NOTE: replace this with your actual permission service. Kept as a
 * standalone method so it's a single place to wire real RBAC checks
 * (BOOKINGS_APPROVE / PAYMENTS_VERIFY / DOCUMENTS_MANAGE) without
 * touching the rest of the component.
 */
interface ActionVisibility {
  approve: boolean;
  disapprove: boolean;
  accept: boolean;
  none: boolean;
}

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

  // ================= Action Modal =================
  showActionModal = false;
  selectedBooking: BookingListItem | null = null;
  selectedAction: ActionType = '';
  availableActions: ActionVisibility = {
    approve: false,
    disapprove: false,
    accept: false,
    none: true,
  };

  internalNote = '';
  rejectionReason = '';
  releaseUnit = false;

  // Two-step confirm ("Are you sure?") before the API actually fires
  confirmStep = false;

  isSubmitting = false;

  // ================= Details Modal =================
  showDetailsModal = false;
  bookingDetails: BookingDetail | null = null;
  loadingDetails = false;

  // ================= Intimation Letter =================
  showLetterModal = false;
  letterFile: File | null = null;
  letterUploading = false;
  letterUploadProgress = 0;

  // ================= Image / file preview =================
  previewUrl: string | null = null;
  previewType: 'image' | 'other' = 'other';

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

  // ================= Status Badge / Color =================

  getBookingStatusBadgeClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'DECISION_PENDING':
        return 'status-badge pending-badge'; // yellow
      case 'PAYMENT_REJECTED':
        return 'status-badge rejected-badge'; // red
      case 'APPROVAL':
        return 'status-badge approval-badge'; // blue
      case 'ACCEPTANCE':
        return 'status-badge accepted-badge'; // green
      case 'EXPIRED':
        return 'status-badge expired-badge'; // gray
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

  // ================= Permission hook (wire your real service here) =================

  private hasPermission(code: 'BOOKINGS_APPROVE' | 'PAYMENTS_VERIFY' | 'DOCUMENTS_MANAGE'): boolean {
    return true;
  }

  get canVerifyPayments(): boolean {
    return this.hasPermission('PAYMENTS_VERIFY');
  }

  get canApproveBookings(): boolean {
    return this.hasPermission('BOOKINGS_APPROVE');
  }

  get canManageDocuments(): boolean {
    return this.hasPermission('DOCUMENTS_MANAGE');
  }

  // ================= Workflow-based action visibility (Missing #1, #2, #20) =================

  getAvailableActions(status: BookingStatus | string): ActionVisibility {
    switch (status) {
      case 'DECISION_PENDING':
        return {
          approve: this.canVerifyPayments,
          disapprove: this.canVerifyPayments,
          accept: false,
          none: !this.canVerifyPayments,
        };

      case 'APPROVAL':
        return {
          approve: false,
          disapprove: this.canVerifyPayments,
          accept: this.canApproveBookings,
          none: !this.canVerifyPayments && !this.canApproveBookings,
        };

      case 'PAYMENT_REJECTED':
      case 'ACCEPTANCE':
      case 'EXPIRED':
      default:
        return { approve: false, disapprove: false, accept: false, none: true };
    }
  }

  isProcessable(status: string): boolean {
    const actions = this.getAvailableActions(status);
    return actions.approve || actions.disapprove || actions.accept;
  }

  // ================= Action Modal =================

  openActionModal(booking: BookingListItem): void {
    this.selectedBooking = booking;
    this.availableActions = this.getAvailableActions(booking.status);
    this.selectedAction = '';
    this.internalNote = '';
    this.rejectionReason = '';
    this.releaseUnit = false;
    this.confirmStep = false;
    this.showActionModal = true;
  }

  closeActionModal(): void {
    this.showActionModal = false;
    this.selectedBooking = null;
    this.selectedAction = '';
    this.internalNote = '';
    this.rejectionReason = '';
    this.releaseUnit = false;
    this.confirmStep = false;
  }

  selectAction(action: ActionType): void {
    this.selectedAction = action;
    this.internalNote = '';
    this.rejectionReason = '';
    this.releaseUnit = false;
    this.confirmStep = false;
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

  /** Missing #13 — validation before allowing the confirm step to open */
  private validateBeforeConfirm(): boolean {
    if (this.selectedAction === 'DISAPPROVE') {
      if (!this.rejectionReason.trim()) {
        this.toastr.error('Rejection reason is required');
        return false;
      }
      if (!this.internalNote.trim()) {
        this.toastr.error('Internal note is required');
        return false;
      }
    }

    if (this.selectedAction === 'APPROVE' && !this.internalNote.trim()) {
      this.toastr.error('Internal note is required');
      return false;
    }

    if (this.selectedAction === 'ACCEPT' && !this.internalNote.trim()) {
      this.toastr.error('Internal note is required');
      return false;
    }

    return true;
  }

  /** Step 1 -> Step 2 ("Are you sure?") — Missing #12 */
  requestConfirmation(): void {
    if (!this.selectedAction) return;
    if (!this.validateBeforeConfirm()) return;
    this.confirmStep = true;
  }

  cancelConfirmation(): void {
    this.confirmStep = false;
  }

  /** Step 2 -> actually fire the API */
  submitAction(): void {
    if (!this.selectedBooking?.publicId || !this.selectedAction) {
      return;
    }

    this.isSubmitting = true;
    this.loader.show();

    const publicId = this.selectedBooking.publicId;
    const trimmedNote = this.internalNote.trim() || undefined;

    if (this.selectedAction === 'DISAPPROVE') {
      this.bookingService
        .disapprovePayment(publicId, {
          reason: this.rejectionReason.trim(),
          internalNote: trimmedNote,
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
        .approvePayment(publicId, { internalNote: trimmedNote })
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
        .acceptBooking(publicId, { internalNote: trimmedNote })
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

  /** Missing #17 — auto-refresh table + open detail modal (if same booking) */
  private handleActionSuccess(message: string): void {
    this.loader.hide();
    this.isSubmitting = false;

    this.toastr.success(message, 'Success');

    const affectedId = this.selectedBooking?.publicId;
    this.closeActionModal();
    this.loadBookings();

    if (affectedId && this.showDetailsModal && this.bookingDetails?.publicId === affectedId) {
      this.refreshDetails(affectedId);
    }
  }

  private handleActionError(error: any): void {
    this.loader.hide();
    this.isSubmitting = false;
    this.confirmStep = false;

    this.toastr.error(
      error?.error?.message || 'Unable to process booking action',
      'Error',
    );
  }

  // ================= Details Modal (Missing #3, #8, #9, #10, #11) =================

  viewBookingDetails(booking: BookingListItem): void {
    this.bookingDetails = null;
    this.showDetailsModal = true;
    this.loadingDetails = true;

    this.bookingService.getBookingById(booking.publicId).subscribe({
      next: (response) => {
        this.loadingDetails = false;
        this.bookingDetails = response?.data || null;
      },

      error: (error: any) => {
        this.loadingDetails = false;

        this.toastr.error(
          error?.error?.message || 'Unable to load booking details',
          'Error',
        );
        this.showDetailsModal = false;
      },
    });
  }

  private refreshDetails(publicId: string): void {
    this.loadingDetails = true;

    this.bookingService.getBookingById(publicId).subscribe({
      next: (response) => {
        this.loadingDetails = false;
        this.bookingDetails = response?.data || null;
      },
      error: () => {
        this.loadingDetails = false;
      },
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.bookingDetails = null;
  }

  /** Missing #9 — pull only the rejection events out of the full timeline */
  get rejectionHistory() {
    return (this.bookingDetails?.timeline || []).filter(
      (item) => item.action === 'PAYMENT_REJECTED' || item.action === 'BOOKING_DISAPPROVED',
    );
  }

  /** Icon per timeline action — Missing #3 */
  getTimelineIcon(action: string): string {
    switch (action) {
      case 'BOOKING_SUBMITTED':
        return 'fa-solid fa-paper-plane';
      case 'PAYMENT_REJECTED':
        return 'fa-solid fa-circle-xmark';
      case 'PROOF_RESUBMITTED':
      case 'CUSTOMER_RESUBMITTED':
        return 'fa-solid fa-rotate';
      case 'PAYMENT_APPROVED':
        return 'fa-solid fa-circle-check';
      case 'BOOKING_ACCEPTED':
        return 'fa-solid fa-file-signature';
      case 'INTIMATION_LETTER_UPLOADED':
        return 'fa-solid fa-file-pdf';
      case 'EXPIRED':
        return 'fa-solid fa-hourglass-end';
      default:
        return 'fa-solid fa-circle-dot';
    }
  }

  getTimelineDotClass(action: string): string {
    switch (action) {
      case 'PAYMENT_REJECTED':
        return 'dot-danger';
      case 'PAYMENT_APPROVED':
        return 'dot-info';
      case 'BOOKING_ACCEPTED':
        return 'dot-success';
      default:
        return '';
    }
  }

  // ================= Evidence (Missing #4, #5, #16) =================

  formatFileSize(bytes: number): string {
    if (!bytes && bytes !== 0) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  isImageEvidence(contentType: string): boolean {
    return !!contentType && contentType.startsWith('image/');
  }

  openPreview(downloadUrl: string, contentType: string): void {
    this.previewUrl = downloadUrl;
    this.previewType = this.isImageEvidence(contentType) ? 'image' : 'other';
  }

  closePreview(): void {
    this.previewUrl = null;
  }

  // ================= Intimation Letter (Missing #14, #15) =================

  canUploadLetter(): boolean {
    return this.bookingDetails?.status === 'ACCEPTANCE' && this.canManageDocuments;
  }

  openLetterModal(): void {
    this.letterFile = null;
    this.letterUploadProgress = 0;
    this.showLetterModal = true;
  }

  closeLetterModal(): void {
    if (this.letterUploading) return;
    this.showLetterModal = false;
    this.letterFile = null;
  }

  onLetterFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;

    if (file && file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
      this.toastr.error('Only PDF or image files are allowed');
      input.value = '';
      this.letterFile = null;
      return;
    }

    this.letterFile = file;
  }

  uploadLetter(): void {
    if (!this.letterFile || !this.bookingDetails?.publicId) {
      this.toastr.error('Please choose a file first');
      return;
    }

    this.letterUploading = true;
    this.letterUploadProgress = 0;

    // Simple indeterminate-to-near-complete progress feel; swap for real
    // HttpEvent progress reporting if the service exposes reportProgress.
    const progressTimer = setInterval(() => {
      if (this.letterUploadProgress < 90) {
        this.letterUploadProgress += 10;
      }
    }, 150);

    this.bookingService
      .uploadIntimationLetter(this.bookingDetails.publicId, this.letterFile)
      .subscribe({
        next: (response: any) => {
          clearInterval(progressTimer);
          this.letterUploadProgress = 100;
          this.letterUploading = false;

          this.toastr.success(
            response?.message || 'Intimation letter uploaded successfully',
            'Success',
          );

          this.showLetterModal = false;
          this.letterFile = null;

          if (this.bookingDetails?.publicId) {
            this.refreshDetails(this.bookingDetails.publicId);
          }
        },

        error: (error: any) => {
          clearInterval(progressTimer);
          this.letterUploading = false;
          this.letterUploadProgress = 0;

          this.toastr.error(
            error?.error?.message || 'Unable to upload intimation letter',
            'Error',
          );
        },
      });
  }
}