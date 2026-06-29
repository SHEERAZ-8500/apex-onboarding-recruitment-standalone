import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationItem } from '../notification.models';
import { NotificationService } from '../notification.service';
import { getNotificationIconClass, getRelativeTime } from '../notifications.utils';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-page.html',
  styleUrls: ['./notification-page.scss'],
})
export class NotificationPage implements OnInit {
  notifications: NotificationItem[] = [];

  loading = true;
  loadError: string | null = null;
  markingAll = false;

  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalItems = 0;

  readonly getIconClass = getNotificationIconClass;
  readonly getRelativeTime = getRelativeTime;

  constructor(private notificationService: NotificationService, private router: Router) {}

  ngOnInit(): void {
    this.fetchPage(0);
  }

  fetchPage(page: number): void {
    this.loading = true;
    this.loadError = null;

    this.notificationService.getNotifications(page, this.pageSize).subscribe({
      next: (res) => {
        this.notifications = res.data.map((n) => ({ ...n, isRead: n.isRead ?? false }));
        this.currentPage = res.paginator.currentPage;
        this.totalPages = res.paginator.totalPages;
        this.totalItems = res.paginator.totalItems;
        this.loading = false;
      },
      error: () => {
        this.loadError = 'Unable to load notifications. Please try again.';
        this.loading = false;
      },
    });
  }

  onItemClick(item: NotificationItem): void {
    if (item.isRead) return;
    this.notificationService.markAsRead(item.publicId).subscribe({
      next: () => (item.isRead = true),
    });
  }

  /** Marks every notification as read, keeps them visible in the list. */
  markAllAsRead(): void {
    if (this.markingAll || !this.notifications.length) return;
    this.markingAll = true;
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach((n) => (n.isRead = true));
        this.markingAll = false;
      },
      error: () => (this.markingAll = false),
    });
  }

  /**
   * "Clear All" — same backend action as markAllAsRead (only one read
   * API exists per the spec you shared). Split this out once/if your
   * backend exposes a real delete/dismiss endpoint.
   */
  clearAll(): void {
    this.markAllAsRead();
  }

  nextPage(): void {
    if (this.currentPage + 1 < this.totalPages) this.fetchPage(this.currentPage + 1);
  }

  prevPage(): void {
    if (this.currentPage > 0) this.fetchPage(this.currentPage - 1);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
