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

  customer?: {
    publicId: string;
    name: string;
    email: string;
  };

  submittedBy?: {
    publicId: string;
    name: string;
    email: string;
  };

  evidence?: any[];
  timeline?: any[];
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




@Injectable({
  providedIn: 'root',
})
export class BookingApprovalService {
  private apiUrl = `${environment.apiBaseUrl}admin/bookings`;

  constructor(private http: HttpClient) {}

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

    /*
      Agar backend search parameter support karta hai to uncomment kar dena.
      Parameter ka exact naam backend se confirm kar lena: search / keyword / bookingNumber
    */
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<BookingListResponse>(this.apiUrl, { params });
  }

  getBookingById(publicId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${publicId}`);
  }

  disapprovePayment(
    publicId: string,
    payload: {
      reason: string;
      internalNote: string;
      releaseUnit: boolean;
    },
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${publicId}/disapprove-payment`,
      payload,
    );
  }

  approvePayment(
    publicId: string,
    payload: {
      internalNote: string;
    },
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${publicId}/approve-payment`,
      payload,
    );
  }

  acceptBooking(
    publicId: string,
    payload: {
      internalNote: string;
    },
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${publicId}/accept`,
      payload,
    );
  }
}