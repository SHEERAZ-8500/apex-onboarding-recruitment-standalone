import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import {
  ApiSimpleResponse,
  MarkReadPayload,
  NotificationItem,
  NotificationsListResponse,
} from './notification.models';

/**
 * Handles all notification API calls, plus a small shared state
 * (`recent$`, `unreadCount$`) so the header bell and the full
 * notifications page always stay in sync.
 *
 * Adjust `baseUrl` below if your actual endpoint path differs.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly baseUrl = `${environment.apiBaseUrl}notifications`;

  /** Latest few notifications, for the header bell dropdown. */
  private readonly recentSubject = new BehaviorSubject<NotificationItem[]>([]);
  readonly recent$ = this.recentSubject.asObservable();

  /** Unread badge count shown on the bell icon. */
  private readonly unreadCountSubject = new BehaviorSubject<number>(0);
  readonly unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  get unreadCount(): number {
    return this.unreadCountSubject.value;
  }

  /** GET /api/notifications — paginated list. */
  getNotifications(page = 0, size = 10): Observable<NotificationsListResponse> {
    return this.http.get<NotificationsListResponse>(this.baseUrl, {
      params: { page, size },
    });
  }

  /**
   * Fetches the latest `limit` notifications and pushes them into
   * `recent$` / `unreadCount$` — used by the header bell dropdown.
   */
  loadRecent(limit = 4): void {
    this.getNotifications(0, limit).subscribe({
      next: (res) => {
        const items = res.data.map((n) => ({ ...n, isRead: n.isRead ?? false }));
        this.recentSubject.next(items);
        this.unreadCountSubject.next(res.paginator?.totalItems ?? items.length);
      },
    });
  }

  /**
   * POST /api/notifications/read
   * - pass a publicId to mark that single notification as read
   * - call with no arguments to mark ALL notifications as read
   */
markAsRead(publicId: string): Observable<ApiSimpleResponse> {
  return this.http.post<ApiSimpleResponse>(
    `${this.baseUrl}/${publicId}/read`,
    {}
  ).pipe(
    tap(() => {
      const updated = this.recentSubject.value.map(n =>
        n.publicId === publicId
          ? { ...n, isRead: true }
          : n
      );

      this.recentSubject.next(updated);
      this.unreadCountSubject.next(
        Math.max(0, this.unreadCountSubject.value - 1)
      );
    })
  );
}

markAllAsRead(): Observable<ApiSimpleResponse> {
  return this.http.post<ApiSimpleResponse>(
    `${this.baseUrl}/read-all`,
    {}
  ).pipe(
    tap(() => {
      const updated = this.recentSubject.value.map(n => ({
        ...n,
        isRead: true
      }));

      this.recentSubject.next(updated);
      this.unreadCountSubject.next(0);
    })
  );
}

  /** Empties the bell dropdown's local list (used by "Clear All"). */
  clearRecentLocally(): void {
    this.recentSubject.next([]);
  }
}
