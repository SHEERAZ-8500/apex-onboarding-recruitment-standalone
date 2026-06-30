import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../app/core/services/management-services/loader.service';
import { BookingRow } from '../admin-booking-acceptance.svc';
import {
  AdminInstallmentsService,
  GenerateInstallmentSchedulePayload,
} from '../admin-installments-service';

@Component({
  selector: 'app-generate-installment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './generate-installments-modal.html',
  styleUrl: './generate-installments-modal.scss',
})
export class GenerateInstallmentModal implements OnInit {
  /** Full booking row — passed in from the parent table so the modal
   *  never needs to fetch or have the admin type a publicId by hand. */
  @Input() booking!: BookingRow;

  @Output() closed = new EventEmitter<void>();
  @Output() generated = new EventEmitter<BookingRow>();

  isSaving = false;
  minDueDate = this.todayIso();

  form: GenerateInstallmentSchedulePayload = {
    numberOfInstallments: 3,
    frequencyMonths: 1,
    firstDueDate: '',
  };

  constructor(
    private installmentsService: AdminInstallmentsService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  ngOnInit(): void {
    this.form = {
      numberOfInstallments: 3,
      frequencyMonths: 1,
      firstDueDate: '',
    };
  }

  private todayIso(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  /** Outstanding = effectivePrice - bookingAmount, per docs 6.1 calc rule. */
  get outstandingAmount(): number {
    if (!this.booking) return 0;
    return (this.booking.effectivePrice ?? this.booking.totalPrice ?? 0) - (this.booking.bookingAmount ?? 0);
  }

  /** Live preview of the split, mirroring the backend's half-up rounding
   *  rule (last installment absorbs the rounding remainder). */
  get previewInstallments(): number[] {
    const n = Number(this.form.numberOfInstallments) || 0;
    if (n < 1) return [];

    const total = this.outstandingAmount;
    const base = Math.round((total / n) * 100) / 100;
    const amounts = new Array(n).fill(base);

    const sumSoFar = base * (n - 1);
    amounts[n - 1] = Math.round((total - sumSoFar) * 100) / 100;

    return amounts;
  }

  close(): void {
    if (this.isSaving) return;
    this.closed.emit();
  }

  generate(): void {
    if (!this.booking?.publicId) {
      this.toastr.error('No booking selected.');
      return;
    }
    if (!this.form.numberOfInstallments || this.form.numberOfInstallments < 1) {
      this.toastr.error('Number of installments must be at least 1.');
      return;
    }
    if (!this.form.firstDueDate) {
      this.toastr.error('Please select the first due date.');
      return;
    }

    const selectedDate = new Date(this.form.firstDueDate + 'T00:00:00');
    const today = new Date(this.todayIso() + 'T00:00:00');
    if (selectedDate < today) {
      this.toastr.error('First due date cannot be in the past.');
      return;
    }

    const frequencyMonths = this.form.frequencyMonths && this.form.frequencyMonths > 0
      ? Number(this.form.frequencyMonths)
      : 1;

    const payload: GenerateInstallmentSchedulePayload = {
      numberOfInstallments: Number(this.form.numberOfInstallments),
      frequencyMonths,
      firstDueDate: this.form.firstDueDate,
    };

    this.isSaving = true;
    this.loader.show();

    this.installmentsService.generateSchedule(this.booking.publicId, payload).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.loader.hide();
        this.toastr.success(response?.message || 'Installment schedule generated successfully.');
        this.generated.emit(this.booking);
      },
      error: (error) => {
        this.isSaving = false;
        this.loader.hide();
        if (error?.status === 409) {
          this.toastr.error(
            error?.error?.message ||
              'Schedule cannot be generated/regenerated — payment evidence already exists for this booking.',
          );
          return;
        }
        this.toastr.error(error?.error?.message || 'Unable to generate installment schedule.');
      },
    });
  }
}