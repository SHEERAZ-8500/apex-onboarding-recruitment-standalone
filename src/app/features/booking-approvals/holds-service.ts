import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../.././environments/environment';
// ^ NOTE: yeh path EXACT wahi hai jo aapke i-units-service.ts me use hua hai.
// Agar TypeScript error de "cannot find module", to is file ki location
// dekh kar ../ ki ginti adjust kar lein (jitna InventoryService me hai
// utna hi yahan se environments folder tak distance hona chahiye).

export interface HoldResponse {
  publicId: string;
  unitPublicId: string;
  unitNumber: string;
  expiresAt: string;
  secondsRemaining: number;
  state: 'ACTIVE' | string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class HoldsService {
  url: any;

  constructor(private http: HttpClient) {
    // InventoryService ka EXACT same pattern - taake same base url +
    // same auth interceptor (jo environment.apiBaseUrl wale requests
    // ko match karta hai) apply ho jaye.
    this.url = environment.apiBaseUrl;
  }

  // 5.1 - Place 30 minute hold
  placeHold(unitPublicId: string): Observable<ApiResponse<HoldResponse>> {
    return this.http.post<ApiResponse<HoldResponse>>(this.url + 'holds', {
      unitPublicId,
    });
  }

  // 5.2 - Release hold early
  releaseHold(publicId: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(this.url + `holds/${publicId}`);
  }

  // 5.3 - Get current logged-in user's active hold (null agar koi nahi)
  getMyHold(): Observable<ApiResponse<HoldResponse | null>> {
    return this.http.get<ApiResponse<HoldResponse | null>>(
      this.url + 'holds/me',
    );
  }
}