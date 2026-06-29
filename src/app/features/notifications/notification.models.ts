/**
 * Notifications module — models
 * Matches the GET /api/notifications response you shared.
 *
 * NOTE: the backend response does NOT include an `isRead` flag.
 * We track `isRead` on the client (defaults to false on fetch, flips to
 * true once a "mark as read" call succeeds). If your backend later adds
 * a real `isRead`/`readAt` field, just stop defaulting it here and the
 * rest of the code keeps working as-is.
 */

export interface NotificationItem {
  publicId: string;
  type: string; // e.g. BOOKING_SUBMITTED, CUSTOMER_REGISTERED
  title: string;
  body: string;
  data?: Record<string, string>;
  createdDate: string; // ISO-ish, e.g. 2026-06-26T15:05:03
  isRead?: boolean;
}

export interface Paginator {
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface NotificationsListResponse {
  success: boolean;
  message?: string;
  data: NotificationItem[];
  paginator: Paginator;
}

/**
 * Payload for POST /api/notifications/read
 * - Send { publicId: '...' }  -> marks that one notification as read
 * - Send {} (no publicId)     -> marks ALL notifications as read
 *
 * Assumption: you described a single "read" API that handles both the
 * single-notification and mark-all-as-read scenarios — this is modeled
 * that way. If your backend actually uses two separate endpoints,
 * splitting markAsRead() in notification.service.ts into two methods
 * is a 2-minute change.
 */
export interface MarkReadPayload {
  publicId?: string;
}

export interface ApiSimpleResponse {
  success: boolean;
  message?: string;
}
