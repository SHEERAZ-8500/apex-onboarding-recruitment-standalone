import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';

@Component({
  selector: 'app-responsive-botstrap-side-nav-bar',
  standalone: true,
  imports: [CommonModule, SideNavBarComponent],
  templateUrl: './responsive-botstrap-side-nav-bar.component.html',
  styleUrl: './responsive-botstrap-side-nav-bar.component.scss'
})
export class ResponsiveBotstrapSideNavBarComponent implements OnInit, OnDestroy {
  private routerSubscription?: Subscription;

  constructor(
    public activeOffcanvas: NgbActiveOffcanvas,
    private router: Router
  ) {}

  ngOnInit() {
    // Close sidebar when route changes
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.close();
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  close() {
    this.activeOffcanvas.dismiss();
  }
}
