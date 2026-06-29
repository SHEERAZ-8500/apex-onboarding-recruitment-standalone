import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ProfileData, ProfileResponse, UpdateProfilePayload } from './profile.model';

/**
 * Handles all "Profile Completion & Avatars" API calls.
 *
 * Assumes:
 *  - `environment.apiUrl` holds the API base (e.g. https://api.example.com)
 *  - An existing HTTP interceptor already attaches the Authorization bearer token,
 *    same as the rest of your auth module. If you don't have one, add the
 *    Authorization header manually in each call below.
 */
@Injectable({ providedIn: 'root' })
export class ProfileService {
private readonly baseUrl = `${environment.apiBaseUrl}auth/profile`;
  /** Shared, app-wide current profile snapshot (e.g. for navbar avatar). */
  private readonly profileSubject = new BehaviorSubject<ProfileData | null>(null);
  readonly profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentProfile(): ProfileData | null {
    return this.profileSubject.value;
  }

  /** GET /api/auth/profile */
  getProfile(): Observable<ProfileResponse> {
    return this.http
      .get<ProfileResponse>(this.baseUrl)
      .pipe(tap((res) => this.profileSubject.next(res.data)));
  }

  /** PATCH /api/auth/profile */
  updateProfile(payload: UpdateProfilePayload): Observable<ProfileResponse> {
    return this.http
      .patch<ProfileResponse>(this.baseUrl, payload)
      .pipe(tap((res) => this.profileSubject.next(res.data)));
  }

  /** POST /api/auth/profile/avatar (multipart/form-data) */
  uploadAvatar(file: File): Observable<ProfileResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<ProfileResponse>(`${this.baseUrl}/avatar`, formData)
      .pipe(tap((res) => this.profileSubject.next(res.data)));
  }

  /** DELETE /api/auth/profile/avatar */
  deleteAvatar(): Observable<ProfileResponse> {
    return this.http
      .delete<ProfileResponse>(`${this.baseUrl}/avatar`)
      .pipe(tap((res) => this.profileSubject.next(res.data)));
  }

  /** Manually push a profile snapshot (e.g. after login) without hitting the API. */
  setProfile(profile: ProfileData | null): void {
    this.profileSubject.next(profile);
  }
}
