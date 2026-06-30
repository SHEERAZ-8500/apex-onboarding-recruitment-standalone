import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Paginator } from '../booking-approvals/admin-installments-service';

export interface BookingCustomer {
  publicId: string;
  name: string;
  email: string;
}

/**
 * Shape of a single booking row — matches the confirmed real payload
 * from GET /api/admin/bookings.
 */
export interface BookingRow {
  bookingNumber: string;
  publicId: string;
  status: string;
  unitPublicId: string;
  unitNumber: string;
  floorNumber: number;
  propertyType: string;
  totalPrice: number;
  bookingAmount: number;
  effectivePrice: number;
  notes?: string;
  customer: BookingCustomer;
  submittedBy: BookingCustomer;
  agentAssisted: boolean;
  rejectedAt?: string | null;
  createdDate: string;
  evidence: any[];
  timeline: any[];
  /** Set client-side once admin generates a schedule, to grey out the
   *  "Create Installments" button without needing another fetch. */
  installmentsGenerated?: boolean;
}

export interface BookingListResponse {
  success: boolean;
  message?: string;
  data: BookingRow[];
  paginator: Paginator;
}

export type BookingStatus = 'ACCEPTANCE' | 'PAYMENT_REJECTED' | 'PENDING' | 'ACCEPTED' | string;

@Injectable({
  providedIn: 'root',
})
export class AdminBookingsAcceptanceService {
  private apiUrl = `${environment.apiBaseUrl}admin/bookings`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/admin/bookings?status=ACCEPTANCE&page=&size=
   * Used as the entry point for the "Create Installments" flow — only
   * bookings in ACCEPTANCE state are eligible for schedule generation
   * per docs section 6.1 constraints.
   */
  getBookings(
    status: BookingStatus,
    page: number,
    size: number,
    search?: string,
  ): Observable<BookingListResponse> {
    let params = new HttpParams()
      .set('status', status)
      .set('page', page.toString())
      .set('size', size.toString());

    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<BookingListResponse>(this.apiUrl, { params });
  }
}