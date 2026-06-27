import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type ClientBookingStatus =
  | 'DECISION_PENDING'
  | 'PAYMENT_REJECTED'
  | 'APPROVAL'
  | 'ACCEPTANCE'
  | 'EXPIRED';

export interface BookingEvidenceItem {
  publicId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  downloadUrl: string;
  uploadedAt: string;
  round?: number;
}

export interface BookingTimelineItem {
  action: string;
  reason?: string;
  internalNote?: string;
  actorName: string;
  occurredAt: string;
}

export interface BookingDocumentItem {
  publicId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  downloadUrl: string;
  uploadedAt: string;
}

export interface ClientBookingListItem {
  publicId: string;
  bookingNumber: string;
  status: ClientBookingStatus;
  unitPublicId: string;
  unitNumber: string;
  propertyType?: string;
  totalPrice?: number;
  bookingAmount?: number;
  effectivePrice?: number;
  notes?: string;
  agentAssisted?: boolean;
  currentSubmissionRound?: number;
  createdDate: string;
}

export interface ClientBookingDetail extends ClientBookingListItem {
  customer?: { publicId: string; name: string; email: string };
  submittedBy?: { publicId: string; name: string; email: string };
  evidence: BookingEvidenceItem[];
  timeline: BookingTimelineItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  paginator: {
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface SubmitBookingPayload {
  unitPublicId: string;
  customerPublicId?: string; // used by agents/salespersons submitting on behalf of a customer
  notes?: string;
  files: File[];
}

/**
 * 5.4 - 5.8 — Client Booking flow
 * Base path: environment.apiBaseUrl + 'bookings'
 */
@Injectable({
  providedIn: 'root',
})
export class ClientBookingsService {
  private apiUrl = `${environment.apiBaseUrl}bookings`;

  constructor(private http: HttpClient) {}

  /** 5.4 — Submit booking with payment proof (multipart/form-data). */
  submitBooking(
    payload: SubmitBookingPayload,
  ): Observable<ApiResponse<ClientBookingDetail>> {
    const formData = new FormData();
    formData.append('unitPublicId', payload.unitPublicId);

    if (payload.customerPublicId) {
      formData.append('customerPublicId', payload.customerPublicId);
    }

    if (payload.notes) {
      formData.append('notes', payload.notes);
    }

    payload.files.forEach((file) => formData.append('files', file, file.name));

    return this.http.post<ApiResponse<ClientBookingDetail>>(
      this.apiUrl,
      formData,
    );
  }

  /** 5.5 — List the logged-in customer's own bookings (paginated). CUSTOMER role only. */
  getMyBookings(
    page: number,
    size: number,
    status?: ClientBookingStatus,
  ): Observable<PaginatedResponse<ClientBookingListItem>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PaginatedResponse<ClientBookingListItem>>(
      `${this.apiUrl}/me`,
      { params },
    );
  }

  /** 5.6 — Get full booking details: timeline, evidence, presigned URLs. */
  getBookingById(
    publicId: string,
  ): Observable<ApiResponse<ClientBookingDetail>> {
    return this.http.get<ApiResponse<ClientBookingDetail>>(
      `${this.apiUrl}/${publicId}`,
    );
  }

  /** 5.7 — Re-submit payment evidence after a PAYMENT_REJECTED decision. Increments round counter. */
  resubmitEvidence(
    publicId: string,
    files: File[],
  ): Observable<ApiResponse<ClientBookingDetail>> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file, file.name));

    return this.http.post<ApiResponse<ClientBookingDetail>>(
      `${this.apiUrl}/${publicId}/resubmit-evidence`,
      formData,
    );
  }

  /** 5.8 — Get official documents (e.g. signed intimation letter) for a booking. */
  getBookingDocuments(
    publicId: string,
  ): Observable<ApiResponse<BookingDocumentItem[]>> {
    return this.http.get<ApiResponse<BookingDocumentItem[]>>(
      `${this.apiUrl}/${publicId}/documents`,
    );
  }
}