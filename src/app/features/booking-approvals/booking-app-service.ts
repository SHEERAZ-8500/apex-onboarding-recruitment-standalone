import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type BookingStatus =
  | 'DECISION_PENDING'
  | 'PAYMENT_REJECTED'
  | 'APPROVAL'
  | 'ACCEPTANCE'
  | 'EXPIRED';

/** Row shape returned by GET /api/admin/bookings (list/queue) */
export interface BookingListItem {
  bookingNumber: string;
  publicId: string;
  status: BookingStatus;
  unitPublicId: string;
  unitNumber: string;
  floorNumber: number;
  propertyType: string;
  totalPrice: number;
  bookingAmount: number;
  effectivePrice: number;
  notes?: string;
  agentAssisted: boolean;
  createdDate: string;
  rejectedAt?: string;
}

export interface BookingListResponse {
  success: boolean;
  message: string;
  data: BookingListItem[];
  paginator: {
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
}

/** Person info embedded in booking detail (customer / submittedBy) */
export interface BookingPerson {
  publicId: string;
  name: string;
  email: string;
}

export interface BookingEvidence {
  publicId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  downloadUrl: string;
  submissionRound: number;
}

export interface BookingTimelineItem {
  action: string;
  reason: string | null;
  internalNote: string | null;
  actorName: string;
  occurredAt: string;
}

/** Shape returned by GET /api/admin/bookings/{publicId} */
export interface BookingDetail {
  bookingNumber: string;
  publicId: string;
  status: BookingStatus;
  unitNumber: string;
  customer: BookingPerson;
  submittedBy: BookingPerson;
  agentAssisted: boolean;
  currentSubmissionRound: number;
  evidence: BookingEvidence[];
  timeline: BookingTimelineItem[];
}

export interface BookingDetailResponse {
  success: boolean;
  data: BookingDetail;
}

export interface IntimationLetterResponse {
  success: boolean;
  message: string;
  data: {
    publicId: string;
    fileName: string;
    contentType: string;
    sizeBytes: number;
    downloadUrl: string;
  };
  actionCode: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingApprovalService {
  private apiUrl = `${environment.apiBaseUrl}admin/bookings`;

  constructor(private http: HttpClient) {}

  /**
   * NOTE: Per API docs (section 4.1) only `status`, `page`, `size` are
   * documented query params. `search` is NOT documented on the backend —
   * confirm the exact param name (search / keyword / bookingNumber) with
   * backend before relying on it for filtering. If unsupported, this will
   * silently be ignored by the server and the list will just show
   * everything for the current status/page.
   */
  getAllBookings(
    page: number,
    size: number,
    status?: BookingStatus,
    search?: string,
  ): Observable<BookingListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<BookingListResponse>(this.apiUrl, { params });
  }

  getBookingById(publicId: string): Observable<BookingDetailResponse> {
    return this.http.get<BookingDetailResponse>(`${this.apiUrl}/${publicId}`);
  }

  /** PAYMENTS_VERIFY permission required */
  disapprovePayment(
    publicId: string,
    payload: {
      reason: string;
      internalNote?: string;
      releaseUnit: boolean;
    },
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${publicId}/disapprove-payment`,
      payload,
    );
  }

  /** PAYMENTS_VERIFY permission required. internalNote is optional per docs. */
  approvePayment(
    publicId: string,
    payload: {
      internalNote?: string;
    } = {},
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/${publicId}/approve-payment`, payload);
  }

  /** BOOKINGS_APPROVE permission required. internalNote is optional per docs. */
  acceptBooking(
    publicId: string,
    payload: {
      internalNote?: string;
    } = {},
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/${publicId}/accept`, payload);
  }

  /**
   * DOCUMENTS_MANAGE permission required.
   * Uploads the intimation letter (PDF/image scan) after a booking has been
   * accepted. multipart/form-data with a single `file` field.
   */
  uploadIntimationLetter(
    publicId: string,
    file: File,
  ): Observable<IntimationLetterResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<IntimationLetterResponse>(
      `${this.apiUrl}/${publicId}/intimation-letter`,
      formData,
    );
  }
}