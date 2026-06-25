import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import {
  DiscountRequest,
  DiscountService,
  DiscountStatus,
  DiscountType,
  Paginator,
} from '../discount-service';

type DecisionMode = 'APPROVE' | 'DECLINE' | null;

@Component({
  selector: 'app-admin-discounts',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterLink],
  templateUrl: './admin-discounts.html',
  styleUrl: './admin-discounts.scss',
})
export class AdminDiscountsComponent implements OnInit {
  discounts: DiscountRequest[] = [];
  paginator: Paginator | null = null;

  // Filters
  selectedStatus: DiscountStatus = 'PENDING';
  searchTerm = '';
  private searchTimeout: any;

  // Pagination
  currentPage = 1; // UI is 1 based
  itemsPerPage = 6;
  totalItems = 0;
  totalPagesCount = 0;

  isLoading = false;
  isSubmitting = false;

  // Custom modal
  showDecisionModal = false;
  selectedDiscount: DiscountRequest | null = null;
  decisionMode: DecisionMode = null;

  offeredType: DiscountType = 'PERCENTAGE';
  offeredValue: number | null = null;
  remarks = '';

  constructor(
    private adminDiscountsService: DiscountService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadDiscountRequests();
  }

  // Search is client-side because current API only accepts status/page/pageSize.
  get filteredDiscounts(): DiscountRequest[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.discounts;
    }

    return this.discounts.filter((discount) => {
      return (
        discount.bookingPublicId?.toLowerCase().includes(term) ||
        discount.requestedRemarks?.toLowerCase().includes(term) ||
        discount.status?.toLowerCase().includes(term) ||
        discount.requestedType?.toLowerCase().includes(term)
      );
    });
  }

  get isAnyFilterActive(): boolean {
    return !!this.searchTerm || this.selectedStatus !== 'PENDING';
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

  loadDiscountRequests(page = this.currentPage): void {
    this.isLoading = true;
    this.currentPage = page;

    // Backend page is zero-based
    const backendPage = this.currentPage - 1;

    this.adminDiscountsService
      .getDiscountRequests(
        this.selectedStatus,
        backendPage,
        this.itemsPerPage,
      )
      .subscribe({
        next: (response) => {
          this.discounts = response?.data ?? [];
          this.paginator = response?.paginator ?? null;

          this.totalItems = response?.paginator?.totalItems ?? 0;
          this.totalPagesCount = response?.paginator?.totalPages ?? 1;

          // API currentPage is zero-based
          this.currentPage = (response?.paginator?.currentPage ?? backendPage) + 1;

          this.isLoading = false;
        },

        error: (error: any) => {
          this.isLoading = false;
          this.discounts = [];
          this.totalItems = 0;
          this.totalPagesCount = 0;

          this.toastr.error(
            error?.error?.message || 'Unable to load discount requests.',
            'Error',
          );
        },
      });
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      // Current API has no search parameter, therefore only table filtering occurs.
    }, 300);
  }

  onStatusChange(): void {
    this.currentPage = 1;
    this.loadDiscountRequests();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'PENDING';
    this.currentPage = 1;
    this.loadDiscountRequests();
  }

  changePage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages ||
      page === this.currentPage ||
      this.isLoading
    ) {
      return;
    }

    this.currentPage = page;
    this.loadDiscountRequests();
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.loadDiscountRequests();
  }

  // ================= Status Badge =================

  getDiscountStatusBadgeClass(status: DiscountStatus): string {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'status-badge approved-badge';

      case 'DECLINED':
        return 'status-badge rejected-badge';

      case 'PENDING':
      default:
        return 'status-badge pending-badge';
    }
  }

  getDiscountStatusIcon(status: DiscountStatus): string {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'fa-solid fa-circle-check';

      case 'DECLINED':
        return 'fa-solid fa-circle-xmark';

      case 'PENDING':
      default:
        return 'fa-solid fa-clock';
    }
  }

  getDisplayStatus(status: DiscountStatus): string {
    const statusMap: Record<string, string> = {
      PENDING: 'Pending',
      APPROVED: 'Approved',
      DECLINED: 'Declined',
    };

    return statusMap[status] || status;
  }

  // ================= Decision Modal =================

  openDecisionModal(discount: DiscountRequest): void {
    this.selectedDiscount = discount;
    this.decisionMode = null;
    this.offeredType = discount.requestedType;
    this.offeredValue = null;
    this.remarks = '';
    this.showDecisionModal = true;
  }

  closeDecisionModal(): void {
    if (this.isSubmitting) {
      return;
    }

    this.showDecisionModal = false;
    this.selectedDiscount = null;
    this.decisionMode = null;
    this.offeredType = 'PERCENTAGE';
    this.offeredValue = null;
    this.remarks = '';
  }

  chooseDecision(mode: DecisionMode): void {
    this.decisionMode = mode;

    if (mode === 'APPROVE' && this.selectedDiscount) {
      this.offeredType = this.selectedDiscount.requestedType;
      this.offeredValue = null;
      this.remarks = '';
    }

    if (mode === 'DECLINE') {
      this.remarks = '';
    }
  }

  submitDecision(): void {
    if (!this.selectedDiscount || !this.decisionMode || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    if (this.decisionMode === 'APPROVE') {
      const payload: {
        offeredType?: DiscountType;
        offeredValue?: number;
        remarks?: string;
      } = {};

      if (this.offeredValue !== null && this.offeredValue !== undefined) {
        if (this.offeredValue <= 0) {
          this.toastr.error('Offered value must be greater than 0.');
          this.isSubmitting = false;
          return;
        }

        payload.offeredType = this.offeredType;
        payload.offeredValue = Number(this.offeredValue);
      }

      if (this.remarks.trim()) {
        payload.remarks = this.remarks.trim();
      }

      this.adminDiscountsService
        .approveDiscount(this.selectedDiscount.publicId, payload)
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.toastr.success(
              response?.message || 'Discount request approved.',
              'Success',
            );
            this.closeDecisionModal();
            this.loadDiscountRequests();
          },

          error: (error: any) => {
            this.isSubmitting = false;
            this.toastr.error(
              error?.error?.message || 'Unable to approve discount request.',
              'Error',
            );
          },
        });

      return;
    }

    const payload = this.remarks.trim()
      ? { remarks: this.remarks.trim() }
      : {};

    this.adminDiscountsService
      .declineDiscount(this.selectedDiscount.publicId, payload)
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.toastr.success(
            response?.message || 'Discount request declined.',
            'Success',
          );
          this.closeDecisionModal();
          this.loadDiscountRequests();
        },

        error: (error: any) => {
          this.isSubmitting = false;
          this.toastr.error(
            error?.error?.message || 'Unable to decline discount request.',
            'Error',
          );
        },
      });
  }

  getDiscountDisplay(discount: DiscountRequest): string {
    if (discount.requestedType === 'PERCENTAGE') {
      return `${discount.requestedValue}%`;
    }

    return `PKR ${Number(discount.requestedValue).toLocaleString()}`;
  }
}