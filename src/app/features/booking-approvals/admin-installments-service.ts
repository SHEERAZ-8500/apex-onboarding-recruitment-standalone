import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type InstallmentStatus = 'SUBMITTED' | 'PENDING' | 'OVERDUE' | 'PAID';

export interface Paginator {
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

/** A single payment proof file attached to an installment. */
export interface InstallmentEvidence {
  publicId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  downloadUrl: string;
}

/**
 * Shape of a single installment row — matches the ACTUAL backend response
 * (confirmed from a real payload), not the earlier assumed shape. Notably:
 * - `sequenceNo` (not installmentNumber/sequenceNumber)
 * - no `bookingPublicId` on the row itself
 * - no `submittedAt` / `paidAt` / `totalPaid` / `outstanding`
 * - `evidence` is an ARRAY of proof files, not a single proof URL
 */
export interface InstallmentResponse {
  publicId: string;
  sequenceNo: number;
  amount: number;
  dueDate: string;
  status: InstallmentStatus;
  evidence: InstallmentEvidence[];

  // Kept optional in case a different status (e.g. PAID) returns these —
  // not present in the SUBMITTED sample payload we confirmed against.
  bookingPublicId?: string;
  submittedAt?: string | null;
  paidAt?: string | null;
  totalPaid?: number;
  outstanding?: number;
}

export interface InstallmentListResponse {
  success: boolean;
  message?: string;
  data: InstallmentResponse[];
  paginator: Paginator;
}

export interface GenerateInstallmentSchedulePayload {
  numberOfInstallments: number;
  /** Optional — backend defaults to 1 (monthly) when omitted. */
  frequencyMonths?: number;
  /** Must be today or later. */
  firstDueDate: string;
}

export interface RejectInstallmentPayload {
  reason: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminInstallmentsService {
  private apiUrl = `${environment.apiBaseUrl}admin/installments`;

  constructor(private http: HttpClient) {}

  /** INSTALLMENTS_VERIFY permission required. */
  generateSchedule(
    bookingPublicId: string,
    payload: GenerateInstallmentSchedulePayload,
  ): Observable<any> {
    // frequencyMonths is optional on the backend — strip it out entirely
    // if not supplied rather than sending an empty/invalid value.
    const body: GenerateInstallmentSchedulePayload = {
      numberOfInstallments: payload.numberOfInstallments,
      firstDueDate: payload.firstDueDate,
      ...(payload.frequencyMonths ? { frequencyMonths: payload.frequencyMonths } : {}),
    };

    return this.http.post(`${this.apiUrl}/generate/${bookingPublicId}`, body);
  }

  /** INSTALLMENTS_VERIFY permission required. */
  getInstallments(
    status: InstallmentStatus,
    page: number,
    size: number,
  ): Observable<InstallmentListResponse> {
    const params = new HttpParams()
      .set('status', status)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<InstallmentListResponse>(this.apiUrl, { params });
  }

  /** INSTALLMENTS_VERIFY permission required. No request body. */
  verifyInstallment(publicId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${publicId}/verify`, {});
  }

  /** INSTALLMENTS_VERIFY permission required. */
  rejectInstallment(
    publicId: string,
    payload: RejectInstallmentPayload,
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/${publicId}/reject`, payload);
  }
}