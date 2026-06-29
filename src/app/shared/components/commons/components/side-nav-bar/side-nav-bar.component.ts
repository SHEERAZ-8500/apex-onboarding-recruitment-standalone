import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  styleUrls: ['./side-nav-bar.component.scss'],
})
export class SideNavBarComponent implements OnInit {
  isOpen = true;
  isDarkMode = false;
  isMenuReady = false;
  // Dynamic menu structure
  topLevelItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'fas fa-home', route: '/panel/dashboard', isVisible: true },
    { label: 'Inventory', icon: 'fas fa-building', route: 'inventory-units/view-units', isVisible: true },
    { label: 'Bookings', icon: 'fas fa-book', route: 'booking-approvals/booking-approvals', isVisible: true },
    { label: 'Discounts', icon: 'fas fa-percent', route: 'booking-approvals/admin-discounts', isVisible: true },
        { label: 'Installments', icon: 'fas fa-percent', route: 'booking-approvals/admin-installments', isVisible: true },
            






  ];

  menuGroups: MenuGroup[] = [
    // {
    //   label: 'Setups',
    //   icon: 'fa-solid fa-gear',
    //   isVisible: true,
    //   collapsed: true,
    //   children: [
    //     {
    //       label: 'User Setups',
    //       icon: 'fa-solid fa-user-circle',
    //       isVisible: true,
    //       collapsed: true,
    //       children: [
    //         {
    //           label: 'Users',
    //           route: 'users-and-roles/view-users',
    //           icon: 'fa-solid fa-people-group',
    //           isVisible: true,
    //         },

    //         {
    //           label: 'Roles',
    //           route: 'users-and-roles/view-roles',
    //           icon: 'fa-solid fa-user-shield',
    //           isVisible: true,
    //         },
    //       ],
    //     },
    //     {
    //       label: 'Configuration',
    //       icon: 'fa-solid fa-sitemap',
    //       isVisible: true,
    //       collapsed: true,
    //       children: [







    //         {
    //           label: 'Approval Stages',
    //           route: 'users-and-roles/view-approval-stages',
    //           isVisible: true,
    //           icon: 'fa-solid fa-code-branch',
    //         },

    //         {
    //           label: 'Approval-template',
    //           route: 'users-and-roles/view-template-approval',
    //           icon: 'fa-solid fa-copy',
    //           isVisible: true,
    //         },
    //       ],
    //     },
    //   ],
    // },
    // // masterdata
    // {
    //   label: 'Master Data',
    //   icon: 'fa-solid fa-database',
    //   isVisible: true,
    //   collapsed: true,
    //   children: [
    //     {
    //       label: 'General-Master-Data',
    //       icon: 'fa-solid fa-layer-group',
    //       isVisible: true,
    //       collapsed: true,
    //       children: [
    //         {
    //           label: 'Department',
    //           route: 'forms/view-department-list',
    //           icon: 'fa-solid fa-building',
    //           isVisible: true,
    //         },
    //         {
    //           label: 'Designation',
    //           route: 'forms/view-designations',
    //           icon: 'fa-solid fa-id-badge',
    //           isVisible: true,
    //         },

    //         {
    //           label: 'Company',
    //           route: 'forms/view-company-branches',
    //           icon: 'fa-solid fa-city',
    //           isVisible: true,
    //         },
    //         {
    //           label: 'Shifts',
    //           route: 'forms/view-shifts',
    //           icon: 'fa-solid fa-arrows-rotate',
    //           isVisible: true,
    //         },
    //         {
    //           label: 'Pay Period',
    //           route: 'forms/view-Pay-period-List',
    //           isVisible: true,
    //           icon: 'fa-solid fa-calendar-days',
    //         },
    //         {
    //           label: 'Work Schedule',
    //           route: 'forms/view-work-schedule',
    //           isVisible: true,
    //           icon: 'fa-solid fa-clock',
    //         },
    //         {
    //           label: 'Projects',
    //           route: 'forms/view-projects',
    //           isVisible: true,
    //           icon: 'fa-solid fa-project-diagram',
    //         },

    //         {
    //           label: 'Job Tite',
    //           route: 'forms/view-job-title-list',
    //           isVisible: true,
    //           icon: 'fa-solid fa-briefcase',
    //         },


    //         {
    //           label: 'Pay Element',
    //           route: 'forms/view-pay-element',

    //           isVisible: true,
    //           icon: 'fa-solid fa-coins',
    //         },
    //         {
    //           label: 'ID Type',
    //           route: 'forms/view-id-type-list',

    //           isVisible: true,
    //           icon: 'fa-solid fa-id-card',
    //         },
    //       ],
    //     },
    //     {
    //       label: 'Leaves-Master-Data',
    //       icon: 'fa-solid fa-clipboard-user',
    //       isVisible: true,
    //       collapsed: true,
    //       children: [
    //         {
    //           label: 'Leave Entitlement',
    //           route: 'forms/view-leaves',
    //           isVisible: true,
    //           icon: 'fa-solid fa-calendar-check',
    //         },
    //         {
    //           label: 'Leave Application',
    //           route: 'forms/view-leave-application',
    //           icon: 'fa-solid fa-file-signature',
    //           isVisible: true,
    //         },
    //         {
    //           label: 'Leave Application HR',
    //           route: 'forms/leave-app-hr',
    //           icon: 'fa-solid fa-file-signature',
    //           isVisible: true,
    //         },
    //         {
    //           label: 'Leave Type',
    //           route: 'forms/view-leaves-master-list',
    //           icon: 'fa-solid fa-folder-open',
    //           isVisible: true,
    //         },
    //         {
    //           label: 'Leave Application Approval',
    //           route: 'forms/leave-application-approval',
    //           icon: 'fa-solid fa-clock',
    //           isVisible: true,
    //         },
    //       ],
    //     },
    //     {
    //       label: ' Employees-Master-Data',
    //       icon: 'fa-solid fa-users',
    //       isVisible: true,
    //       collapsed: true,
    //       children: [
    //         {
    //           label: 'Employees',
    //           route: 'forms/view-all-employees',
    //           icon: 'fa-solid fa-user-tie',
    //           isVisible: true,
    //         },
    //         {
    //           label: 'Employees Category',
    //           route: 'forms/view-employee-category-list',
    //           icon: 'fa-solid fa-tags',
    //           isVisible: true,
    //         },
    //         {
    //           label: 'Employees Grade',
    //           route: 'forms/view-employees-grade-list',
    //           icon: 'fa-solid fa-ranking-star',
    //           isVisible: true,
    //         },
    //         {
    //           label: 'Belonging Types',
    //           route: 'forms/view-belonging-types-list',
    //           icon: 'fa-solid fa-shapes',
    //           isVisible: true,
    //         },
    //       ],
    //     },
    //     {
    //       label: 'Work From Home',
    //       icon: 'fa-solid fa-house-laptop',
    //       isVisible: true,
    //       collapsed: true,
    //       children: [
    //         {
    //           label: 'WFH Application',
    //           route: 'forms/view-all-wfh-apps',
    //           icon: 'fa-solid fa-file-signature',
    //           isVisible: true,
    //         },
    //         {
    //           label: 'WFH Application HR',
    //           route: 'forms/view-all-wfh-apps-hr',
    //           icon: 'fa-solid fa-file-signature',
    //           isVisible: true,
    //         },

    //         {
    //           label: 'WFH Policy',
    //           route: 'forms/view-wfh-policy',
    //           icon: 'fa-solid fa-people-arrows',
    //           isVisible: true,
    //         },
    //           {
    //           label: 'WFH Approval',
    //           route: 'forms/wfh-approval',
    //           icon: 'fa-solid fa-list-check',
    //           isVisible: true,
    //         },
    //       ],
    //     },
    //     {
    //       label: 'Attendance-Master-Data',
    //       icon: 'fa-solid fa-calendar-check',
    //       isVisible: true,
    //       collapsed: true,
    //       children: [
    //         {
    //           label: 'OverTime Types',
    //           route: 'forms/view-overtime-list',
    //           icon: 'fa-solid fa-business-time',
    //           isVisible: true,
    //         },
    //         {
    //           label: 'Daily Timesheets',
    //           route: 'forms/view-daily-timesheets',
    //           icon: 'fa-solid fa-stopwatch',
    //           isVisible: true,
    //         },
    //       ],
    //     },
    //   ],
    // },


  ];

  constructor(
    private toggleService: ToggleService,
    private router: Router,
    private toastr: ToastrService,
    private SessionService: SessionService,
    private menuVisibilityService: MenuVisibilityService,
  ) { }

  // ngOnInit() {
  //   this.themeService.isLightTheme$.subscribe((value) => {
  //     this.isDarkMode = !value;
  //   });

  //   this.toggleService.sidebarOpen$.subscribe((open) => {
  //     this.isOpen = open;

  //     // Collapse all menus when sidebar closes
  //     if (!open) {
  //       this.collapseAllMenus();
  //     }
  //   });

  //   // Subscribe to menu visibility changes
  //   this.hideAllMenuItems();

  //   // ✅ Phir permissions apply karo
  //   this.menuVisibilityService.menuVisibility$.subscribe((config) => {
  //     if (Object.keys(config).length === 0) return; // empty skip karo

  //     Object.keys(config).forEach((label) => {
  //       this.updateMenuVisibility(label, config[label]);
  //     });
  //   });
  // }
  ngOnInit() {


    this.toggleService.sidebarOpen$.subscribe((open) => {
      this.isOpen = open;
      if (!open) {
        this.collapseAllMenus();
      }
    });

    // this.menuVisibilityService.menuVisibility$.subscribe((visibility) => {
    //   if (visibility === null) {
    //     this.isMenuReady = false;

    //     // ✅ YEH ADD KARO - token hai to khud load karo
    //     const token = localStorage.getItem('token');
    //     if (token) {
    //       this.SessionService.loadUserAndApplyMenu().subscribe();
    //     }
    //     return;
    //   }

    //   this.hideAllMenuItems();

    //   this.topLevelItems.forEach((item) => {
    //     item.isVisible = visibility[item.label] ?? item.label === 'Dashboard';
    //   });

    //   this.menuGroups.forEach((group) => {
    //     group.isVisible = visibility[group.label] ?? false;
    //     group.children?.forEach((child) => {
    //       child.isVisible = visibility[child.label] ?? false;
    //       child.children?.forEach((subChild) => {
    //         subChild.isVisible = visibility[subChild.label] ?? false;
    //       });
    //     });
    //   });

    //   this.isMenuReady = true;
    // });
  }
  private hideAllMenuItems() {
    this.topLevelItems.forEach((item) => (item.isVisible = false));

    this.menuGroups.forEach((group) => {
      group.isVisible = false;
      if (group.children) {
        this.hideChildren(group.children);
      }
    });
  }

  private hideChildren(items: MenuItem[]) {
    items.forEach((item) => {
      item.isVisible = false;
      if (item.children) {
        this.hideChildren(item.children);
      }
    });
  }
  private collapseAllMenus() {
    this.menuGroups.forEach((group) => {
      group.collapsed = true;
      if (group.children) {
        this.collapseChildren(group.children);
      }
    });
  }

  private collapseChildren(items: MenuItem[]) {
    items.forEach((item) => {
      if (item.collapsed !== undefined) {
        item.collapsed = true;
      }
      if (item.children) {
        this.collapseChildren(item.children);
      }
    });
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
    const topItem = this.topLevelItems.find((item) => item.label === label);
    if (topItem) {
      topItem.isVisible = isVisible;
      return;
    }

    // Update menu groups
    this.menuGroups.forEach((group) => {
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
    items.forEach((item) => {
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
