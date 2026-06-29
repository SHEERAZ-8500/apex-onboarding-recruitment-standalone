import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbOffcanvas, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ToggleService } from '../../../../../core/services/management-services/ToggleService';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../../core/services/apis/api.service';
import { SessionService } from '../../../../../core/services/management-services/Session.service';
import { ResponsiveBotstrapSideNavBarComponent } from '../responsive-botstrap-side-nav-bar/responsive-botstrap-side-nav-bar.component';

import { NotificationItem } from './../../../../../features/notifications/notification.models';
import { NotificationService } from '../../../../../features/notifications/notification.service';
import {
  getNotificationIconClass,
  getRelativeTime
} from '../../../../../features/notifications/notifications.utils';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbDropdownModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  // 🔹 Notification card ka reference (outside-click detection ke liye)
  @ViewChild('notifyCard') notifyCard!: ElementRef;

  showNotifications = false;
  animateBounce = false;

  recentNotifications: NotificationItem[] = [];
  unreadCount = 0;
  loadingRecent = false;

  readonly getIconClass = getNotificationIconClass;
  readonly getRelativeTime = getRelativeTime;

  constructor(
    private SessionService: SessionService,
    private toggleService: ToggleService,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private offcanvasService: NgbOffcanvas,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // Badge count ke liye recent notifications shuru mein hi load kar lo
    this.fetchRecentNotifications();

    this.notificationService.recent$.subscribe((items) => {
      this.recentNotifications = items;
    });
    this.notificationService.unreadCount$.subscribe((count) => {
      this.unreadCount = count;
    });
  }

  logoutUser() {
    this.apiService.logout().subscribe((res) => {
      this.toastr.success("Logout Successfully")
      this.SessionService.clearStorage()
      this.router.navigate(["/"])
    }, (error) => {

    })
  }

  toggleSidebar() {
    if (window.innerWidth > 1000) {
      this.toggleService.toggleSidebar();
    } else {
      this.offcanvasService.open(ResponsiveBotstrapSideNavBarComponent, {
        position: 'start',
        scroll: true,
        backdrop: false
      });
    }
  }

  // ---------- Notifications ----------

  fetchRecentNotifications(): void {
    this.loadingRecent = true;
    this.notificationService.loadRecent(4);
    // loadRecent() khud subscribe karke recent$/unreadCount$ update kar deta hai
    setTimeout(() => (this.loadingRecent = false), 300);
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;

    if (this.showNotifications) {
      this.fetchRecentNotifications();
      this.animateBounce = true;
      setTimeout(() => (this.animateBounce = false), 600);
    }
  }

  onNotificationClick(item: NotificationItem): void {
    if (!item.isRead) {
      this.notificationService.markAsRead(item.publicId).subscribe();
    }

    // Yahan aap notification ke `data` ke mutabiq target page par navigate
    // kar sakte hain, e.g.:
    // if (item.type === 'BOOKING_SUBMITTED' && item.data?.['BOOKING_PUBLIC_ID']) {
    //   this.router.navigate(['/bookings', item.data['BOOKING_PUBLIC_ID']]);
    // }

    this.showNotifications = false;
  }

  onClearAll(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => this.notificationService.clearRecentLocally(),
    });
  }

  goToAllNotifications(): void {
    this.showNotifications = false;
    this.router.navigate(['/panel/notifications/notifications-page']);
  }

  // Bahar click karne par dropdown band ho jaye
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.showNotifications) return;
    const clickedInsideCard = this.notifyCard?.nativeElement?.contains(event.target);
    const clickedBellBtn = (event.target as HTMLElement).closest('.bell-btn');
    if (!clickedInsideCard && !clickedBellBtn) {
      this.showNotifications = false;
    }
  }
}
