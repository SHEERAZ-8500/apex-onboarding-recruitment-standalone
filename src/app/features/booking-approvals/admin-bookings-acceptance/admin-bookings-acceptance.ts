import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../app/core/services/management-services/loader.service';
import {
  AdminBookingsAcceptanceService,
  BookingRow,
} from '../admin-booking-acceptance.svc';
import { Paginator } from '../admin-installments-service';
import { GenerateInstallmentModal } from '../generate-installments-modal/generate-installments-modal';

@Component({
  selector: 'app-admin-bookings-acceptance',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, DecimalPipe,GenerateInstallmentModal],
  templateUrl: './admin-bookings-acceptance.html',
  styleUrl: './admin-bookings-acceptance.scss',
})
export class AdminBookingsAcceptance implements OnInit {
  bookings: BookingRow[] = [];

  page = 0;
  size = 10;
  searchTerm = '';
  private searchTimeout: any;

  paginator: Paginator = {
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
    itemsPerPage: 6,
  };

  isLoading = false;

  // Generate-Installment modal state — kept inside this component so the
  // booking row -> modal flow is self-contained ("alag component" but
  // launched right from this table, no UUID typing/extra fetch needed).
  showGenerateModal = false;
  selectedBooking: BookingRow | null = null;

  constructor(
    private bookingsService: AdminBookingsAcceptanceService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  get isAnyFilterActive(): boolean {
    return !!this.searchTerm;
  }

  get totalPagesArray(): number[] {
    const pages: number[] = [];
    const total = this.paginator.totalPages || 1;
    const current = this.page + 1;

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
    return this.paginator.totalItems === 0 ? 0 : this.page * this.size + 1;
  }

  get lastItem(): number {
    return Math.min((this.page + 1) * this.size, this.paginator.totalItems);
  }

  loadBookings(): void {
    this.isLoading = true;
    this.loader.show();

    this.bookingsService
      .getBookings('ACCEPTANCE', this.page, this.size, this.searchTerm)
      .subscribe({
        next: (response) => {
          this.bookings = response?.data ?? [];
          this.paginator = response?.paginator ?? {
            currentPage: 0,
            totalItems: 0,
            totalPages: 0,
          };
          this.isLoading = false;
          this.loader.hide();
        },
        error: () => {
          this.bookings = [];
          this.isLoading = false;
          this.loader.hide();
          this.toastr.error('Unable to load accepted bookings.');
        },
      });
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.page = 0;
      this.loadBookings();
    }, 500);
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.page = 0;
    this.loadBookings();
  }

  changePage(page: number): void {
    if (page < 0 || page >= this.paginator.totalPages || page === this.page) return;
    this.page = page;
    this.loadBookings();
  }

  onItemsPerPageChange(): void {
    this.page = 0;
    this.loadBookings();
  }

  /** Outstanding = effectivePrice - bookingAmount (down payment already paid). */
  getOutstanding(booking: BookingRow): number {
    return (booking.effectivePrice ?? booking.totalPrice ?? 0) - (booking.bookingAmount ?? 0);
  }

  openGenerateModal(booking: BookingRow): void {
    console.log('Button clicked');
  console.log(booking);

  this.selectedBooking = booking;
  this.showGenerateModal = true;

  console.log(this.showGenerateModal);
  }

  closeGenerateModal(): void {
    this.showGenerateModal = false;
    this.selectedBooking = null;
  }

  /** Called by the child <app-generate-installment-modal> on success. */
  onScheduleGenerated(booking: BookingRow): void {
    booking.installmentsGenerated = true;
    this.closeGenerateModal();
    this.toastr.success(`Installment schedule generated for ${booking.bookingNumber}.`);
    // Optional: refresh the list so admin sees current ACCEPTANCE bookings only
    this.loadBookings();
  }
}