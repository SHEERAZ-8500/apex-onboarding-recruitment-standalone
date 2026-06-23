import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToggleService } from '../../../../core/services/management-services/ToggleService';
import { SideNavBarComponent } from '../../commons/components/side-nav-bar/side-nav-bar.component';
import { HeaderComponent } from '../../commons/components/header/header.component';

@Component({
  selector: 'app-lay-out-one',
  standalone: true,
  imports: [CommonModule, RouterModule, SideNavBarComponent, HeaderComponent],
  templateUrl: './lay-out-one.component.html',
  styleUrl: './lay-out-one.component.scss'
})
export class LayOutOneComponent {
  isOpen = true;
  constructor(private toggleService: ToggleService) { }
  ngOnInit() {
    this.toggleService.sidebarOpen$.subscribe(open => this.isOpen = open);
  }

}
