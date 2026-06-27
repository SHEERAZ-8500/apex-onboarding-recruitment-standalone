import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type DiscountType = 'FIXED_AMOUNT' | 'PERCENTAGE';

export type DiscountStatus =
  | 'PENDING'
  | 'COUNTER_OFFERED'
  | 'APPROVED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface DiscountRequestPayload {
  bookingPublicId: string;
  type: DiscountType;
  value: number;
  remarks?: string;
}

export interface DiscountParty {
  publicId: string;
  name: string;
  email: string;
}

/**
 * A single entry in a booking's discount history. Covers both the agent's
 * original request and any admin counter-offer/decision on it, since 6.2
 * returns "full history of discount requests and counter-offers" as one feed.
 */
export interface DiscountHistoryItem {
  publicId: string;
  type: DiscountType;
  value: number;
  remarks?: string;
  status: DiscountStatus;

  requestedBy?: DiscountParty;
  respondedBy?: DiscountParty;
  responseRemarks?: string;

  /** Present only when status === 'COUNTER_OFFERED'. */
  counterType?: DiscountType;
  counterValue?: number;

  createdAt: string;
  respondedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * 6.1 - 6.2 — B2B / Sales Discounts (Agent View)
 * Base path: environment.apiBaseUrl + 'discounts'
 */
@Injectable({
  providedIn: 'root',
})
export class DiscountsService {
  private apiUrl = `${environment.apiBaseUrl}discounts`;

  constructor(private http: HttpClient) {}

  /**
   * 6.1 — Request a price discount on a booking.
   * Roles: SALES_PERSON, B2B_AGENT (DISCOUNTS_REQUEST permission).
   * Backend enforces: type FIXED_AMOUNT|PERCENTAGE, one pending request at a
   * time per booking, and only before the booking reaches ACCEPTANCE.
   */
  requestDiscount(
    payload: DiscountRequestPayload,
  ): Observable<ApiResponse<DiscountHistoryItem>> {
    return this.http.post<ApiResponse<DiscountHistoryItem>>(
      this.apiUrl,
      payload,
    );
  }

  /**
   * 6.2 — Full discount request/counter-offer history for a booking.
   * Roles: booking participants, ADMIN, SUPER_ADMIN (DISCOUNTS_VIEW permission).
   */
  getDiscountHistory(
    bookingPublicId: string,
  ): Observable<ApiResponse<DiscountHistoryItem[]>> {
    return this.http.get<ApiResponse<DiscountHistoryItem[]>>(
      `${this.apiUrl}/booking/${bookingPublicId}`,
    );
  }
}