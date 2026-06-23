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
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../../core/services/apis/api.service';
import { SessionService } from '../../../../../core/services/management-services/Session.service';
import { ResponsiveBotstrapSideNavBarComponent } from '../responsive-botstrap-side-nav-bar/responsive-botstrap-side-nav-bar.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbDropdownModule, ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  // 🔹 Notification card ka reference
  @ViewChild('notifyCard') notifyCard!: ElementRef;

  showNotifications = false;
  animateBounce = false;



  constructor(
    private SessionService: SessionService,
    private toggleService: ToggleService,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private offcanvasService: NgbOffcanvas
  ) { }



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




}
