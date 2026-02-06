import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';

@Component({
  selector: 'app-responsive-botstrap-side-nav-bar',
  standalone: true,
  imports: [CommonModule, SideNavBarComponent],
  templateUrl: './responsive-botstrap-side-nav-bar.component.html',
  styleUrl: './responsive-botstrap-side-nav-bar.component.scss'
})
export class ResponsiveBotstrapSideNavBarComponent {

  constructor(public activeOffcanvas: NgbActiveOffcanvas) {}

  close() {
    this.activeOffcanvas.dismiss();
  }
}
