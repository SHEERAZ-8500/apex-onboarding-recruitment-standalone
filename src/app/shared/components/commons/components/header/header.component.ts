import {
  Component,
  ElementRef,
  HostListener,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbOffcanvas, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ToggleService } from '../../../../../core/services/management-services/ToggleService';
import { ThemeService } from '../../../../../core/services/management-services/Theme.service';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../../core/services/apis/api.service';
import { SessionService } from '../../../../../core/services/management-services/Session.service';
import { HeaderModalComponent } from '../bootstrap-modals/header-modal/header-modal.component';
import { ChatBoxCardComponent } from '../chat-box-card/chat-box-card.component';
import { ResponsiveBotstrapSideNavBarComponent } from '../responsive-botstrap-side-nav-bar/responsive-botstrap-side-nav-bar.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbDropdownModule, HeaderModalComponent, ChatBoxCardComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  // 🔹 Notification card ka reference
  @ViewChild('notifyCard') notifyCard!: ElementRef;

  showNotifications = false;
  animateBounce = false;

  notifications = [
    { icon: 'fa-solid fa-triangle-exclamation', color: '#f5e967ff', text: 'Duis malesuada justo eu sapien elementum varius.' },
    { icon: 'fa-solid fa-users', color: '#dc3545', text: 'Curabitur id eros quis nunc suscipit blandit.' },
    { icon: 'fa-solid fa-user', color: '#dc3545', text: 'Donec at nisi sit amet tortor commodo dignissim.' },
    { icon: 'fa-solid fa-user', color: '#2c825aff', text: 'Duis malesuada justo eu sapien elementum varius.' },
    { icon: 'fa-solid fa-user', color: '#1274ac', text: 'Curabitur id eros quis nunc suscipit blandit.' }
  ];

  isDarkMode = false;
  showChat = false;

  constructor(
    private SessionService: SessionService,
    private toggleService: ToggleService,
    public themeService: ThemeService,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private offcanvasService: NgbOffcanvas
  ) { }


  ngOnInit() {
    this.themeService.isLightTheme$.subscribe(value => {
      this.isDarkMode = !value;
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

  // 🔔 Bell click
  toggleNotifications(event: MouseEvent) {
    event.stopPropagation(); // 🔴 very important
    this.showNotifications = !this.showNotifications;

    if (this.showNotifications) {
      this.animateBounce = true;
      setTimeout(() => {
        this.animateBounce = false;
      }, 1000);
    }
  }

  clearAll() {
    this.notifications = [];
  }

  closeNotifications() {
    this.showNotifications = false;
  }

  // 🔥 Real outside click handler
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.showNotifications) return;

    const clickedInsideNotify =
      this.notifyCard?.nativeElement.contains(event.target);

    if (!clickedInsideNotify) {
      this.showNotifications = false;
    }
  }

  openChat() {
    this.showChat = true;
  }

  closeChat() {
    this.showChat = false;
  }

}
