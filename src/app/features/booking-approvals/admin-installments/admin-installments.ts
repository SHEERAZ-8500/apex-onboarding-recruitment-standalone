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
  size = 10;

  paginator: Paginator = {
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  };

  isLoading = false;
  isSaving = false;

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

  onStatusChange(status: InstallmentStatus): void {
    if (this.selectedStatus === status) return;

    this.selectedStatus = status;
    this.page = 0;
    this.loadInstallments();
  }

  refresh(): void {
    this.loadInstallments();
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

    if (
      !this.generateForm.numberOfInstallments ||
      this.generateForm.numberOfInstallments < 1
    ) {
      this.toastr.error('Number of installments must be at least 1.');
      return;
    }

    if (
      !this.generateForm.frequencyMonths ||
      this.generateForm.frequencyMonths < 1
    ) {
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

          this.toastr.success(
            response?.message || 'Installment schedule generated successfully.'
          );

          this.selectedStatus = 'PENDING';
          this.page = 0;
          this.loadInstallments();
        },
        error: (error) => {
          this.isSaving = false;
          this.loader.hide();

          if (error?.status === 409) {
            this.toastr.error(
              error?.error?.message ||
                'Schedule cannot be regenerated because payment evidence already exists.'
            );
            return;
          }

          this.toastr.error(
            error?.error?.message || 'Unable to generate installment schedule.'
          );
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

          this.toastr.success(
            response?.message || 'Installment payment verified successfully.'
          );

          this.loadInstallments();
        },
        error: (error) => {
          this.isSaving = false;
          this.loader.hide();

          this.toastr.error(
            error?.error?.message || 'Unable to verify installment payment.'
          );
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

          this.toastr.success(
            response?.message || 'Installment payment rejected successfully.'
          );

          this.loadInstallments();
        },
        error: (error) => {
          this.isSaving = false;
          this.loader.hide();

          this.toastr.error(
            error?.error?.message || 'Unable to reject installment payment.'
          );
        }
      });
  }

  previousPage(): void {
    if (this.page <= 0 || this.isLoading) return;

    this.page--;
    this.loadInstallments();
  }

  nextPage(): void {
    if (
      this.page >= this.paginator.totalPages - 1 ||
      this.isLoading ||
      this.paginator.totalPages === 0
    ) {
      return;
    }

    this.page++;
    this.loadInstallments();
  }

  getInstallmentNumber(installment: InstallmentResponse, index: number): number {
    return (
      installment.installmentNumber ??
      installment.sequenceNumber ??
      this.page * this.size + index + 1
    );
  }

  getProofUrl(installment: InstallmentResponse): string | null {
    return installment.paymentProofUrl || installment.proofUrl || null;
  }

  canAudit(installment: InstallmentResponse): boolean {
    return installment.status === 'SUBMITTED';
  }

  statusClass(status: InstallmentStatus): string {
    return `status-${status.toLowerCase()}`;
  }
}