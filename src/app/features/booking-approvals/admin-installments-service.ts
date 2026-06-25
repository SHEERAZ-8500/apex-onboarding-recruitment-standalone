import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type InstallmentStatus = 'SUBMITTED' | 'PENDING' | 'OVERDUE' | 'PAID';

export interface GenerateInstallmentSchedulePayload {
  numberOfInstallments: number;
  frequencyMonths: number;
  firstDueDate: string;
}

export interface RejectInstallmentPayload {
  reason: string;
}

export interface InstallmentResponse {
  publicId: string;
  bookingPublicId: string;

  installmentNumber?: number;
  sequenceNumber?: number;

  amount: number;
  dueDate: string;

  status: InstallmentStatus;

  submittedAt?: string | null;
  paidAt?: string | null;

  paymentProofUrl?: string | null;
  proofUrl?: string | null;

  totalPaid?: number;
  outstanding?: number;
  createdDate?: string;
}

export interface Paginator {
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  paginator?: Paginator;
}

@Injectable({
  providedIn: 'root'
})
export class AdminInstallmentsService {
  private readonly baseUrl = `${environment.apiBaseUrl}admin/installments`;

  constructor(private http: HttpClient) {}

  getInstallments(
    status: InstallmentStatus = 'SUBMITTED',
    page = 0,
    size = 10
  ): Observable<ApiResponse<InstallmentResponse[]>> {
    let params = new HttpParams()
      .set('status', status)
      .set('page', page)
      .set('size', size);

    return this.http.get<ApiResponse<InstallmentResponse[]>>(this.baseUrl, {
      params
    });
  }

  generateSchedule(
    bookingPublicId: string,
    payload: GenerateInstallmentSchedulePayload
  ): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/generate/${bookingPublicId}`,
      payload
    );
  }

  verifyInstallment(publicId: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/${publicId}/verify`,
      {}
    );
  }

  rejectInstallment(
    publicId: string,
    payload: RejectInstallmentPayload
  ): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/${publicId}/reject`,
      payload
    );
  }
}