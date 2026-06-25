import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import {
  
  DiscountRequest,
  DiscountService,
  DiscountStatus,
  DiscountType,
  Paginator
} from '../discount-service';
import {  } from '../booking-app-service';

type DecisionMode = 'APPROVE' | 'DECLINE' | null;

@Component({
  selector: 'app-admin-discounts',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule, DatePipe],
  templateUrl: './admin-discounts.html',
  styleUrl: './admin-discounts.scss'
})
export class AdminDiscountsComponent implements OnInit {
  @ViewChild('decisionModal') decisionModal!: TemplateRef<unknown>;

  discounts: DiscountRequest[] = [];
  paginator: Paginator | null = null;

  selectedStatus: DiscountStatus = 'PENDING';
  currentPage = 0;
  pageSize = 10;

  isLoading = false;
  isSubmitting = false;

  selectedDiscount: DiscountRequest | null = null;
  decisionMode: DecisionMode = null;

  offeredType: DiscountType = 'PERCENTAGE';
  offeredValue: number | null = null;
  remarks = '';

  readonly statuses: DiscountStatus[] = ['PENDING', 'APPROVED', 'DECLINED'];

  constructor(
    private adminDiscountsService: DiscountService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadDiscountRequests();
  }

  loadDiscountRequests(page = this.currentPage): void {
    this.isLoading = true;
    this.currentPage = page;

    this.adminDiscountsService
      .getDiscountRequests(this.selectedStatus, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.discounts = response.data ?? [];
          this.paginator = response.paginator ?? null;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.discounts = [];
        }
      });
  }

  onStatusChange(): void {
    this.currentPage = 0;
    this.loadDiscountRequests(0);
  }

  openDecisionModal(discount: DiscountRequest): void {
    this.selectedDiscount = discount;
    this.decisionMode = null;

    // Approve fields initially blank hain.
    // Blank payload ka matlab: requested discount exactly approve karna.
    this.offeredType = discount.requestedType;
    this.offeredValue = null;
    this.remarks = '';

    this.modalService.open(this.decisionModal, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });
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

  submitDecision(modal: { close: () => void }): void {
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

      // Fields optional hain.
      // Agar value empty ho to backend submitted request ko exact approve karega.
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
            this.toastr.success(response.message || 'Discount request approved.');
            modal.close();
            this.loadDiscountRequests();
          },
          error: () => {
            this.isSubmitting = false;
          }
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
          this.toastr.success(response.message || 'Discount request declined.');
          modal.close();
          this.loadDiscountRequests();
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
  }

  getStatusClass(status: DiscountStatus): string {
    switch (status) {
      case 'APPROVED':
        return 'status-approved';
      case 'DECLINED':
        return 'status-declined';
      default:
        return 'status-pending';
    }
  }

  getDiscountDisplay(discount: DiscountRequest): string {
    if (discount.requestedType === 'PERCENTAGE') {
      return `${discount.requestedValue}%`;
    }

    return `PKR ${Number(discount.requestedValue).toLocaleString()}`;
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.loadDiscountRequests(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.paginator && this.currentPage < this.paginator.totalPages - 1) {
      this.loadDiscountRequests(this.currentPage + 1);
    }
  }
}