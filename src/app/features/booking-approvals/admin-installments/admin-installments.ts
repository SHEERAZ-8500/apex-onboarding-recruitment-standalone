import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
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
    totalPages: 0,
    itemsPerPage: 6,
  };

  isLoading = false;
  isSaving = false;

  // Status counts for tabs — pulled from the 4 status endpoints in parallel
  // (backend doesn't expose a single "counts" endpoint per docs section 6.2)
  statusCounts: Record<InstallmentStatus, number> = {
    SUBMITTED: 0,
    PENDING: 0,
    OVERDUE: 0,
    PAID: 0
  };

  // Generate schedule modal
  showGenerateModal = false;
  selectedBookingPublicId = '';
  /** True when the modal was opened from an accepted-booking entry point
   *  (e.g. ?bookingId=... query param after Accept Booking) — locks the
   *  field so admins can't generate schedules for arbitrary booking IDs. */
  lockedBookingId = false;

  generateForm: GenerateInstallmentSchedulePayload = {
    numberOfInstallments: 3,
    frequencyMonths: 1,
    firstDueDate: ''
  };

  minDueDate = this.todayIso();

  // Verify modal
  showVerifyModal = false;
  selectedInstallment: InstallmentResponse | null = null;

  // Reject modal
  showRejectModal = false;
  rejectReason = '';

  // View Proof modal — backend returns `evidence` as an ARRAY (multiple
  // files possible), so a simple <a target="_blank"> link isn't enough.
  showProofModal = false;
  proofInstallment: InstallmentResponse | null = null;
  previewUrl: string | null = null;
  previewIsImage = false;

  constructor(
    private installmentsService: AdminInstallmentsService,
    private toastr: ToastrService,
    private loader: LoaderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInstallments();
    this.loadStatusCounts();

    // Entry point from an accepted booking (Booking Approval -> Accept ->
    // "Generate Schedule" should navigate here with ?bookingId=<publicId>)
    const incomingBookingId = this.route.snapshot.queryParamMap.get('bookingId');
    if (incomingBookingId) {
      this.openGenerateModal(incomingBookingId, true);
    }
  }

  private todayIso(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
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

  /**
   * Missing #5 fix — tabs were always showing 0 because statusCounts was
   * never populated. Backend has no single "counts" endpoint per the docs,
   * so we hit all 4 status queues in parallel (size=1, we only need
   * paginator.totalItems) and populate the badges from that.
   */
  loadStatusCounts(): void {
    forkJoin({
      SUBMITTED: this.installmentsService.getInstallments('SUBMITTED', 0, 1),
      PENDING: this.installmentsService.getInstallments('PENDING', 0, 1),
      OVERDUE: this.installmentsService.getInstallments('OVERDUE', 0, 1),
      PAID: this.installmentsService.getInstallments('PAID', 0, 1)
    }).subscribe({
      next: (results) => {
        this.statusCounts = {
          SUBMITTED: results.SUBMITTED?.paginator?.totalItems ?? 0,
          PENDING: results.PENDING?.paginator?.totalItems ?? 0,
          OVERDUE: results.OVERDUE?.paginator?.totalItems ?? 0,
          PAID: results.PAID?.paginator?.totalItems ?? 0
        };
      },
      error: () => {
        // Silently keep zeros — counts are a nice-to-have, not blocking.
      }
    });
  }

  /**
   * Client-side filter, kept as a fallback. NOTE: the docs (section 6.2)
   * only document `status`, `page`, `size` as query params — there is no
   * documented `search` param, so this stays client-side-only unless your
   * backend confirms a search param exists.
   */
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
      // Client-side filtering only — see note on filteredInstallments above.
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
    this.loadStatusCounts();
  }

  // ================= Permission hook (wire your real service here) =================
  /**
   * Missing #6 fix. Replace the `true` fallback with your actual permission
   * service check for INSTALLMENTS_VERIFY, e.g.
   * `this.permissionService.has('INSTALLMENTS_VERIFY')`.
   */
  get canVerifyInstallments(): boolean {
    return true;
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

  /**
   * Missing #1 fix — opening with a bookingPublicId (from the Accepted
   * Booking entry point) locks the field so admins can't free-type an
   * arbitrary booking ID. Manual entry is still allowed as a fallback for
   * admins working off a booking number they already have, but the
   * preferred flow is navigating here from Booking Approval after Accept.
   */
  openGenerateModal(bookingPublicId = '', locked = false): void {
    this.selectedBookingPublicId = bookingPublicId;
    this.lockedBookingId = locked;
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
    this.lockedBookingId = false;

    // Clear the query param so a page refresh doesn't reopen the modal.
    if (this.route.snapshot.queryParamMap.get('bookingId')) {
      this.router.navigate([], { queryParams: {} });
    }
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

    // Missing #3 fix — frequencyMonths is optional per docs (defaults to 1
    // / monthly). Don't hard-require it, just fall back silently.
    const frequencyMonths = this.generateForm.frequencyMonths && this.generateForm.frequencyMonths > 0
      ? this.generateForm.frequencyMonths
      : 1;

    if (!this.generateForm.firstDueDate) {
      this.toastr.error('Please select the first due date.');
      return;
    }

    // Missing #2 fix — firstDueDate must be today or later.
    const selectedDate = new Date(this.generateForm.firstDueDate + 'T00:00:00');
    const today = new Date(this.todayIso() + 'T00:00:00');
    if (selectedDate < today) {
      this.toastr.error('First due date cannot be in the past.');
      return;
    }

    this.isSaving = true;
    this.loader.show();

    const payload: GenerateInstallmentSchedulePayload = {
      numberOfInstallments: Number(this.generateForm.numberOfInstallments),
      frequencyMonths: Number(frequencyMonths),
      firstDueDate: this.generateForm.firstDueDate
    };

    this.installmentsService
      .generateSchedule(bookingPublicId, payload)
      .subscribe({
        next: (response) => {
          this.isSaving = false;
          this.loader.hide();
          this.showGenerateModal = false;
          this.lockedBookingId = false;
          this.toastr.success(response?.message || 'Installment schedule generated successfully.');
          this.selectedStatus = 'PENDING';
          this.page = 0;
          this.loadInstallments();
          this.loadStatusCounts();
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
          this.loadStatusCounts();
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
          this.loadStatusCounts();
        },
        error: (error) => {
          this.isSaving = false;
          this.loader.hide();
          this.toastr.error(error?.error?.message || 'Unable to reject installment payment.');
        }
      });
  }

  getInstallmentNumber(installment: InstallmentResponse, index: number): number {
    return installment.sequenceNo ?? this.page * this.size + index + 1;
  }

  hasProof(installment: InstallmentResponse): boolean {
    return !!installment.evidence?.length;
  }

  /** Opens a modal listing every evidence file for this installment. */
  openProofModal(installment: InstallmentResponse): void {
    this.proofInstallment = installment;
    this.previewUrl = null;
    this.showProofModal = true;
  }

  closeProofModal(): void {
    this.showProofModal = false;
    this.proofInstallment = null;
    this.previewUrl = null;
  }

  isImageEvidence(contentType: string): boolean {
    // NOTE: sample payload sends `contentType: "text/plain"` for a .png
    // file (backend metadata bug) — fall back to checking the file
    // extension so the preview still renders correctly.
    return !!contentType && contentType.startsWith('image/');
  }

  looksLikeImage(evidence: { fileName: string; contentType: string }): boolean {
    if (this.isImageEvidence(evidence.contentType)) return true;
    return /\.(png|jpe?g|gif|webp|bmp)$/i.test(evidence.fileName || '');
  }

  formatFileSize(bytes: number): string {
    if (!bytes && bytes !== 0) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  openPreview(evidence: { downloadUrl: string; fileName: string; contentType: string }): void {
    this.previewUrl = evidence.downloadUrl;
    this.previewIsImage = this.looksLikeImage(evidence);
  }

  closePreview(): void {
    this.previewUrl = null;
  }

  canAudit(installment: InstallmentResponse): boolean {
    return installment.status === 'SUBMITTED' && this.canVerifyInstallments;
  }
}