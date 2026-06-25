// discount.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type DiscountStatus = 'PENDING' | 'APPROVED' | 'DECLINED';
export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface DiscountRequest {
  publicId: string;
  bookingPublicId: string;
  requestedType: DiscountType;
  requestedValue: number;
  requestedRemarks: string | null;
  status: DiscountStatus;
  createdDate: string;
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

export interface ApproveDiscountPayload {
  offeredType?: DiscountType;
  offeredValue?: number;
  remarks?: string;
}

export interface DeclineDiscountPayload {
  remarks?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  private apiUrl = `${environment.apiBaseUrl}admin/discounts`;

  constructor(private http: HttpClient) {}

  getDiscountRequests(
    status: DiscountStatus = 'PENDING',
    page = 0,
    size = 10
  ): Observable<ApiResponse<DiscountRequest[]>> {
    let params = new HttpParams()
      .set('status', status)
      .set('page', page)
      .set('size', size);

    return this.http.get<ApiResponse<DiscountRequest[]>>(this.apiUrl, { params });
  }

  approveDiscount(
    publicId: string,
    payload: ApproveDiscountPayload = {}
  ): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(
      `${this.apiUrl}/${publicId}/approve`,
      payload
    );
  }

  declineDiscount(
    publicId: string,
    payload: DeclineDiscountPayload = {}
  ): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(
      `${this.apiUrl}/${publicId}/decline`,
      payload
    );
  }
}