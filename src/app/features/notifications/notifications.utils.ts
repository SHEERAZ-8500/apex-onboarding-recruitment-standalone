/**
 * Small shared helpers used by both the header bell dropdown and the
 * full notifications page, so formatting stays consistent everywhere.
 */

/** Maps a notification `type` to a Font Awesome icon class + accent. */
export function getNotificationIconClass(type: string): string {
  switch (type) {
    case 'BOOKING_SUBMITTED':
      return 'fa-solid fa-calendar-check';
    case 'CUSTOMER_REGISTERED':
      return 'fa-solid fa-user-plus';
    default:
      return 'fa-solid fa-bell';
  }
}

/** "2 hours ago" / "Yesterday" / "3 days ago" / "Jun 20" style relative time. */
export function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
