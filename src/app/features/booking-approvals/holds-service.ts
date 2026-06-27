import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type HoldState = 'ACTIVE' | 'EXPIRED' | 'RELEASED' | 'CONSUMED';

export interface HoldResponse {
  publicId: string;
  unitPublicId: string;
  unitNumber: string;
  expiresAt: string; // ISO date-time
  secondsRemaining: number;
  state: HoldState;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * 5.1 - 5.3 — Booking Holds
 *
 * NOTE on base path: this follows the same convention as
 * BookingApprovalService (apiUrl = environment.apiBaseUrl + segment).
 * Adjust the trailing segment below ONLY if your gateway nests the
 * client-facing endpoints under something other than `holds`.
 */
@Injectable({
  providedIn: 'root',
})
export class HoldsService {
  private apiUrl = `${environment.apiBaseUrl}holds`;

  constructor(private http: HttpClient) {}

  /** 5.1 — Place a 30-minute hold on a unit. User can hold at most one unit at a time. */
  placeHold(unitPublicId: string): Observable<ApiResponse<HoldResponse>> {
    return this.http.post<ApiResponse<HoldResponse>>(this.apiUrl, {
      unitPublicId,
    });
  }

  /** 5.2 — Release an active hold early, before it expires. */
  releaseHold(holdPublicId: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.apiUrl}/${holdPublicId}`,
    );
  }

  /** 5.3 — Get the logged-in user's current active hold, or null if none. */
  getMyHold(): Observable<ApiResponse<HoldResponse | null>> {
    return this.http.get<ApiResponse<HoldResponse | null>>(
      `${this.apiUrl}/me`,
    );
  }
}