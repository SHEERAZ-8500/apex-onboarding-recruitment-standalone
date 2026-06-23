import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../../core/services/apis/api.service';
import { ToggleService } from '../../../../../core/services/management-services/ToggleService';
import { SessionService } from '../../../../../core/services/management-services/Session.service';
import { MenuVisibilityService } from '../../../../../core/services/management-services/menu-visibility.service';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuItem, MenuGroup } from '../../../../interfaces/menu-item.interface';




@Component({
  selector: 'app-side-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbCollapseModule],
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss']
})
export class SideNavBarComponent implements OnInit {
  isOpen = true;


  // Dynamic menu structure
  topLevelItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'fas fa-home', route: '/panel/dashboard', isVisible: true },
    { label: 'Offers', icon: 'fa-solid fa-tag', route: '/panel/offers', isVisible: false },
    { label: 'People', icon: 'fa-solid fa-people-group', route: '/panel/employes', isVisible: false },
    { label: 'Jobs Details', icon: 'fa-solid fa-briefcase', route: '/panel/jobs-details', isVisible: false },
    { label: 'Chat', icon: 'fa-regular fa-message', route: '/panel/chat', isVisible: false },
    { label: 'Contacts', icon: 'fa-solid fa-address-book', route: '/panel/contact', isVisible: false }
  ];

  menuGroups: MenuGroup[] = [
    {
      label: 'Setups',
      icon: 'fa fa-layer-group',
      isVisible: true,
      collapsed: true,
      children: [
        {
          label: 'User Setups',
          icon: 'fas fa-angle-double-right',
          isVisible: true,
          collapsed: true,
          children: [
            { label: 'Users', route: 'admin/view-all-users', isVisible: true },
            { label: 'Roles', route: '/panel/permissions/view-all-rols', isVisible: true }
          ]
        },
        {
          label: 'Configuration',
          icon: 'fas fa-angle-double-right',
          isVisible: true,
          collapsed: true,
          children: [
            { label: 'Forms', route: '/panel/forms/view-all-forms', isVisible: true },
            { label: 'Lookup Tables', route: '/panel/table/view-all-lookup-tables', isVisible: true },
            { label: 'Lookup Enums', route: '/panel/table/view-all-lookup-enums', isVisible: true },
            { label: 'Independent Tables', route: '/panel/table/view-all-independent-tables', isVisible: true }
          ]
        },
        {
          label: 'Outsourcing Master Data',
          icon: 'fas fa-angle-double-right',
          isVisible: false,
          collapsed: true,
          children: [
            { label: 'Company', route: 'out-sourcing-master-data/view-all-company', isVisible: true },
            { label: 'Client', route: 'out-sourcing-master-data/view-all-client', isVisible: true },
            { label: 'Customer Master', route: 'out-sourcing-master-data/view-all-customer-master', isVisible: true }
          ]
        }
      ]
    },
   
  
 
   
    {
      label: 'Admin',
      icon: 'fa-solid fa-user-shield',
      isVisible: false,
      collapsed: true,
      children: [
        { label: 'Users', route: 'admin/view-all-users', isVisible: true },
        { label: 'Roles', route: '/panel/permissions/view-all-rols', isVisible: true }
      ]
    }
  ];

  constructor(private toggleService: ToggleService,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private SessionService: SessionService,
    private menuVisibilityService: MenuVisibilityService

  ) { }


  ngOnInit() {
 

    this.toggleService.sidebarOpen$.subscribe(open => {
      this.isOpen = open;

      // Collapse all menus when sidebar closes
      if (!open) {
        this.collapseAllMenus();
      }
    });

    // Subscribe to menu visibility changes
    this.menuVisibilityService.menuVisibility$.subscribe(config => {
      Object.keys(config).forEach(label => {
        this.updateMenuVisibility(label, config[label]);
      });
    });
  }

  private collapseAllMenus() {
    this.menuGroups.forEach(group => {
      group.collapsed = true;
      if (group.children) {
        this.collapseChildren(group.children);
      }
    });
  }

  private collapseChildren(items: MenuItem[]) {
    items.forEach(item => {
      if (item.collapsed !== undefined) {
        item.collapsed = true;
      }
      if (item.children) {
        this.collapseChildren(item.children);
      }
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

  toggleGroup(group: MenuGroup) {
    if (!this.canToggle()) return;
    group.collapsed = !group.collapsed;
  }

  toggleMenuItem(item: MenuItem) {
    if (item.collapsed !== undefined) {
      item.collapsed = !item.collapsed;
    }
  }

  // Method to update menu item visibility dynamically
  updateMenuVisibility(label: string, isVisible: boolean) {
    // Update top-level items
    const topItem = this.topLevelItems.find(item => item.label === label);
    if (topItem) {
      topItem.isVisible = isVisible;
      return;
    }

    // Update menu groups
    this.menuGroups.forEach(group => {
      if (group.label === label) {
        group.isVisible = isVisible;
        return;
      }

      // Check children
      if (group.children) {
        this.updateChildVisibility(group.children, label, isVisible);
      }
    });
  }

  private updateChildVisibility(items: MenuItem[], label: string, isVisible: boolean) {
    items.forEach(item => {
      if (item.label === label) {
        item.isVisible = isVisible;
        return;
      }
      if (item.children) {
        this.updateChildVisibility(item.children, label, isVisible);
      }
    });
  }

  private canToggle(): boolean {
    return this.isOpen;
  }
}
