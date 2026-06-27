import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { LoaderService } from '../../../core/services/management-services/loader.service';
import {
  DiscountsService,
  DiscountHistoryItem,
  DiscountType,
} from '../discount-by-agent-service';

/**
 * Embeddable widget: drop this into an agent's booking detail screen.
 * Covers 6.1 (request a discount) + 6.2 (view discount history) for ONE booking.
 *
 * Usage:
 *   <app-discount-panel
 *     [bookingPublicId]="booking.publicId"
 *     [bookingStatus]="booking.status">
 *   </app-discount-panel>
 *
 * Note: only SALES_PERSON / B2B_AGENT roles should see the "Request Discount"
 * button per the spec (DISCOUNTS_REQUEST permission) — gate that on the
 * consuming page however you already gate role-based UI elsewhere, e.g.:
 *   <app-discount-panel ... [canRequest]="currentUserIsAgent"></app-discount-panel>
 */
@Component({
  selector: 'app-discount-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, DatePipe],
  templateUrl: './discount-panel.html',
  styleUrl: './discount-panel.scss',
})
export class DiscountPanel implements OnInit {
  @Input({ required: true }) bookingPublicId!: string;
  @Input() bookingStatus = '';
  /** Whether the current user is allowed to request a discount (SALES_PERSON / B2B_AGENT). */
  @Input() canRequest = true;

  @Output() discountRequested = new EventEmitter<DiscountHistoryItem>();

  history: DiscountHistoryItem[] = [];
  loadingHistory = false;

  showRequestForm = false;
  discountType: DiscountType = 'FIXED_AMOUNT';
  discountValue: number | null = null;
  remarks = '';
  submitting = false;

  private readonly openStatuses = ['PENDING', 'COUNTER_OFFERED'];

  constructor(
    private discountsService: DiscountsService,
    private loader: LoaderService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  // ===================== Derived state =====================

  get hasOpenRequest(): boolean {
    return this.history.some((item) => this.openStatuses.includes(item.status));
  }

  get bookingPastAcceptance(): boolean {
    return this.bookingStatus === 'ACCEPTANCE';
  }

  get canOpenRequestForm(): boolean {
    return this.canRequest && !this.hasOpenRequest && !this.bookingPastAcceptance;
  }

  get blockedReason(): string {
    if (this.bookingPastAcceptance) {
      return 'This booking has already been accepted — discounts can no longer be requested.';
    }
    if (this.hasOpenRequest) {
      return 'There is already a pending discount request on this booking. Wait for a decision before requesting another.';
    }
    return '';
  }

  get valueLabel(): string {
    return this.discountType === 'PERCENTAGE' ? 'Percentage (%)' : 'Amount';
  }

  // ===================== 6.2 Load history =====================

  loadHistory(): void {
    this.loadingHistory = true;

    this.discountsService.getDiscountHistory(this.bookingPublicId).subscribe({
      next: (response) => {
        this.loadingHistory = false;
        this.history = response?.data || [];
      },
      error: (error: any) => {
        this.loadingHistory = false;
        this.history = [];

        this.toastr.error(
          error?.error?.message || 'Unable to load discount history',
          'Error',
        );
      },
    });
  }

  // ===================== Status badge helpers =====================

  getStatusBadgeClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'status-badge pending-badge';
      case 'COUNTER_OFFERED':
        return 'status-badge countered-badge';
      case 'APPROVED':
        return 'status-badge accepted-badge';
      case 'REJECTED':
        return 'status-badge rejected-badge';
      case 'WITHDRAWN':
        return 'status-badge expired-badge';
      default:
        return 'status-badge';
    }
  }

  getStatusIcon(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'fa-solid fa-clock';
      case 'COUNTER_OFFERED':
        return 'fa-solid fa-rotate';
      case 'APPROVED':
        return 'fa-solid fa-circle-check';
      case 'REJECTED':
        return 'fa-solid fa-circle-xmark';
      case 'WITHDRAWN':
        return 'fa-solid fa-ban';
      default:
        return 'fa-solid fa-circle';
    }
  }

  formatDiscountValue(item: { type: DiscountType; value: number }): string {
    return item.type === 'PERCENTAGE' ? `${item.value}%` : `${item.value}`;
  }

  // ===================== 6.1 Request discount form =====================

  openRequestForm(): void {
    this.showRequestForm = true;
    this.discountType = 'FIXED_AMOUNT';
    this.discountValue = null;
    this.remarks = '';
  }

  closeRequestForm(): void {
    this.showRequestForm = false;
    this.discountValue = null;
    this.remarks = '';
  }

  submitRequest(): void {
    if (this.discountValue === null || this.discountValue <= 0) {
      this.toastr.error('Please enter a valid discount value', 'Invalid Value');
      return;
    }

    if (this.discountType === 'PERCENTAGE' && this.discountValue > 100) {
      this.toastr.error('Percentage discount cannot exceed 100%', 'Invalid Value');
      return;
    }

    this.submitting = true;
    this.loader.show();

    this.discountsService
      .requestDiscount({
        bookingPublicId: this.bookingPublicId,
        type: this.discountType,
        value: this.discountValue,
        remarks: this.remarks.trim() || undefined,
      })
      .subscribe({
        next: (response) => {
          this.loader.hide();
          this.submitting = false;

          this.toastr.success(
            response?.message || 'Discount request submitted for review',
            'Submitted',
          );

          this.closeRequestForm();
          this.loadHistory();

          if (response?.data) {
            this.discountRequested.emit(response.data);
          }
        },
        error: (error: any) => {
          this.loader.hide();
          this.submitting = false;

          this.toastr.error(
            error?.error?.message || 'Unable to submit discount request',
            'Error',
          );
        },
      });
  }
}