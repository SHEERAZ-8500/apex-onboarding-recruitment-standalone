import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { LoaderService } from '../../../core/services/management-services/loader.service';
import { HoldsService, HoldResponse } from '../holds-service';
import {
  ClientBookingsService,
  ClientBookingDetail,
} from '../myBookings-service';

/**
 * Embeddable widget: drop this into a Unit listing/detail page.
 * Handles the full 5.1 -> 5.4 client flow for ONE unit:
 *   Place Hold -> Countdown -> Submit Booking (with payment proof) -> Release (optional)
 *
 * Usage:
 *   <app-unit-hold-booking
 *     [unitPublicId]="unit.publicId"
 *     [unitNumber]="unit.unitNumber"
 *     [isAgentMode]="false"
 *     (bookingSubmitted)="onBookingSubmitted($event)">
 *   </app-unit-hold-booking>
 */
@Component({
  selector: 'app-unit-hold-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './unit-hold-booking.html',
  styleUrl: './unit-hold-booking.scss',
})
export class UnitHoldBooking implements OnInit, OnDestroy {
  @Input({ required: true }) unitPublicId!: string;
  @Input() unitNumber = '';
  /** Set true for agent/salesperson screens so they can submit on a customer's behalf. */
  @Input() isAgentMode = false;

  @Output() bookingSubmitted = new EventEmitter<ClientBookingDetail>();
  @Output() holdReleased = new EventEmitter<void>();

  currentHold: HoldResponse | null = null;
  secondsRemaining = 0;

  loadingHold = false;
  placingHold = false;
  releasing = false;
  submitting = false;

  showSubmitForm = false;
  notes = '';
  customerPublicId = '';
  selectedFiles: File[] = [];

  private countdownHandle: any = null;

  constructor(
    private holdsService: HoldsService,
    private bookingsService: ClientBookingsService,
    private loader: LoaderService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.refreshCurrentHold();
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  // ===================== Derived state =====================

  get holdsThisUnit(): boolean {
    return !!this.currentHold && this.currentHold.unitPublicId === this.unitPublicId;
  }

  get holdsAnotherUnit(): boolean {
    return !!this.currentHold && this.currentHold.unitPublicId !== this.unitPublicId;
  }

  get isLowTime(): boolean {
    return this.secondsRemaining > 0 && this.secondsRemaining <= 300; // last 5 minutes
  }

  get formattedCountdown(): string {
    const m = Math.floor(this.secondsRemaining / 60);
    const s = this.secondsRemaining % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  // ===================== 5.3 Get current hold =====================

  refreshCurrentHold(): void {
    this.loadingHold = true;

    this.holdsService.getMyHold().subscribe({
      next: (response) => {
        this.loadingHold = false;
        this.currentHold = response?.data || null;

        if (this.currentHold) {
          this.startCountdown(this.currentHold);
        } else {
          this.stopCountdown();
        }
      },
      error: (error: any) => {
        this.loadingHold = false;
        this.currentHold = null;
        this.toastr.error(
          error?.error?.message || 'Unable to fetch current hold status',
          'Error',
        );
      },
    });
  }

  // ===================== 5.1 Place hold =====================

  placeHold(): void {
    if (this.holdsAnotherUnit) {
      this.toastr.warning(
        `You already have an active hold on unit ${this.currentHold?.unitNumber}. Release it first.`,
        'Hold Already Active',
      );
      return;
    }

    this.placingHold = true;
    this.loader.show();

    this.holdsService.placeHold(this.unitPublicId).subscribe({
      next: (response) => {
        this.loader.hide();
        this.placingHold = false;

        this.currentHold = response?.data || null;

        if (this.currentHold) {
          this.startCountdown(this.currentHold);
        }

        this.toastr.success(
          response?.message || 'Unit held for 30 minutes. Complete your booking before it expires.',
          'Hold Placed',
        );
      },
      error: (error: any) => {
        this.loader.hide();
        this.placingHold = false;

        this.toastr.error(
          error?.error?.message || 'Unable to place a hold on this unit',
          'Error',
        );
      },
    });
  }

  // ===================== 5.2 Release hold =====================

  releaseHold(): void {
    if (!this.currentHold?.publicId) {
      return;
    }

    this.releasing = true;
    this.loader.show();

    this.holdsService.releaseHold(this.currentHold.publicId).subscribe({
      next: (response) => {
        this.loader.hide();
        this.releasing = false;

        this.stopCountdown();
        this.currentHold = null;
        this.closeSubmitForm();

        this.toastr.success(
          response?.message || 'Hold released. Unit is available again.',
          'Released',
        );

        this.holdReleased.emit();
      },
      error: (error: any) => {
        this.loader.hide();
        this.releasing = false;

        this.toastr.error(
          error?.error?.message || 'Unable to release the hold',
          'Error',
        );
      },
    });
  }

  // ===================== Countdown =====================

  private startCountdown(hold: HoldResponse): void {
    this.stopCountdown();

    const expiresAtMs = new Date(hold.expiresAt).getTime();
    this.tickCountdown(expiresAtMs);

    this.countdownHandle = setInterval(() => this.tickCountdown(expiresAtMs), 1000);
  }

  private tickCountdown(expiresAtMs: number): void {
    const remaining = Math.round((expiresAtMs - Date.now()) / 1000);
    this.secondsRemaining = Math.max(0, remaining);

    if (this.secondsRemaining <= 0) {
      this.stopCountdown();
      this.currentHold = null;
      this.closeSubmitForm();
      this.toastr.info('Your hold has expired. The unit is available again.', 'Hold Expired');
    }
  }

  private stopCountdown(): void {
    if (this.countdownHandle) {
      clearInterval(this.countdownHandle);
      this.countdownHandle = null;
    }
    this.secondsRemaining = this.currentHold
      ? Math.max(
          0,
          Math.round((new Date(this.currentHold.expiresAt).getTime() - Date.now()) / 1000),
        )
      : 0;
  }

  // ===================== Submit booking form =====================

  openSubmitForm(): void {
    this.showSubmitForm = true;
    this.notes = '';
    this.customerPublicId = '';
    this.selectedFiles = [];
  }

  closeSubmitForm(): void {
    this.showSubmitForm = false;
    this.notes = '';
    this.customerPublicId = '';
    this.selectedFiles = [];
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) {
      return;
    }

    Array.from(input.files).forEach((file) => {
      const alreadyAdded = this.selectedFiles.some(
        (f) => f.name === file.name && f.size === file.size,
      );
      if (!alreadyAdded) {
        this.selectedFiles.push(file);
      }
    });

    input.value = '';
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  submitBooking(): void {
    if (!this.currentHold) {
      this.toastr.error('Your hold is no longer active. Please place a new hold.', 'Error');
      return;
    }

    if (this.selectedFiles.length === 0) {
      this.toastr.error('Please attach at least one payment proof file', 'Files Required');
      return;
    }

    if (this.isAgentMode && !this.customerPublicId.trim()) {
      this.toastr.error('Please enter the customer this booking is for', 'Customer Required');
      return;
    }

    this.submitting = true;
    this.loader.show();

    this.bookingsService
      .submitBooking({
        unitPublicId: this.unitPublicId,
        customerPublicId: this.isAgentMode ? this.customerPublicId.trim() : undefined,
        notes: this.notes.trim() || undefined,
        files: this.selectedFiles,
      })
      .subscribe({
        next: (response) => {
          this.loader.hide();
          this.submitting = false;

          this.toastr.success(
            response?.message || 'Booking submitted. Awaiting payment review.',
            'Submitted',
          );

          this.stopCountdown();
          this.currentHold = null;
          this.closeSubmitForm();

          if (response?.data) {
            this.bookingSubmitted.emit(response.data);
          }
        },
        error: (error: any) => {
          this.loader.hide();
          this.submitting = false;

          this.toastr.error(
            error?.error?.message || 'Unable to submit booking',
            'Error',
          );
        },
      });
  }
}