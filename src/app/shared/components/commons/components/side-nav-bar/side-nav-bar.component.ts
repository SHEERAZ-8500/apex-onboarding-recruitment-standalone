import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../../core/services/apis/api.service';
import { ThemeService } from '../../../../../core/services/management-services/Theme.service';
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
  isDarkMode = false;

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
      label: 'Tables',
      icon: 'fa-solid fa-table-list',
      isVisible: false,
      collapsed: true,
      children: [
        { label: 'View All Lookup Table', route: '/panel/table/view-all-lookup-tables', isVisible: true },
        { label: 'View All Lookup Enums', route: '/panel/table/view-all-lookup-enums', isVisible: true },
        { label: 'View All Independent Tables', route: '/panel/table/view-all-independent-tables', isVisible: true }
      ]
    },
    {
      label: 'Assesment',
      icon: 'fa-solid fa-clipboard',
      isVisible: false,
      collapsed: true,
      children: [
        { label: 'Design Assesment', isVisible: true },
        { label: 'Stored Assesment', isVisible: true },
        { label: 'Received Assesment', isVisible: true }
      ]
    },
    {
      label: 'Master Data',
      icon: 'fa-solid fa-database',
      isVisible: true,
      collapsed: true,
      children: [
        {
          label: 'General Master Data',
          icon: 'fas fa-angle-double-right',
          isVisible: true,
          collapsed: true,
          children: [
            { label: 'Department', route: '/panel/master-data/department', isVisible: true },
            { label: 'Designation', route: '/panel/master-data/designation', isVisible: true },
            { label: 'Job Title', route: '/panel/master-data/job-title', isVisible: true },

            { label: 'Pay Period', route: '/panel/master-data/pay-period', isVisible: true },

            { label: 'Work Schedule', route: '/panel/master-data/work-schedule', isVisible: true },

            { label: 'Pay Element', route: 'organizational-master-data/view-all-pay-element', isVisible: false },
            { label: 'Skills', route: 'general-master-data/view-all-skills', isVisible: false },
            { label: 'ID Type', route: 'general-master-data/view-all-id-type', isVisible: false },
            { label: 'Qualification', route: 'general-master-data/view-all-qualification', isVisible: false },
            { label: 'Employee Cost', route: 'general-master-data/view-all-employee-cost', isVisible: false },
            { label: 'Ramadan Timings', route: 'general-master-data/view-all-ramadan-timing', isVisible: false },
            { label: 'Trainings', route: 'general-master-data/view-all-trainings', isVisible: false },
            { label: 'Job Description', route: 'general-master-data/view-all-job-description', isVisible: false },
            { label: 'Pre Requisites', route: 'general-master-data/view-all-pre-requisites', isVisible: false },
            { label: 'Belonging Types', route: 'general-master-data/view-all-belonging-types', isVisible: false },
            { label: 'Cost Center', route: 'general-master-data/view-all-cost-center', isVisible: false },
            { label: 'Work Schedule', route: 'general-master-data/view-all-work-schedule', isVisible: false },
            { label: 'Designation', route: 'general-master-data/view-all-designation', isVisible: false },
            { label: 'Job Title', route: 'general-master-data/view-all-job-title', isVisible: false },
            { label: 'Post Assignment', route: 'general-master-data/view-all-post-assignment', isVisible: false },
            { label: 'KPI Questions', route: 'general-master-data/view-all-kpi-questions', isVisible: false },
            { label: 'Employees Grade', route: 'general-master-data/view-all-employees-grade', isVisible: false }
          ]
        },
        {
          label: 'Attendance Master Data',
          icon: 'fas fa-angle-double-right',
          isVisible: true,
          collapsed: true,
          children: [
            { label: 'Shift', route: '/panel/master-data/shift', isVisible: true },
            { label: 'Leave Application', route: '/panel/master-data/leave-application', isVisible: true },
            { label: 'Leaves Master Data', route: '/panel/master-data/leaves-master-data', isVisible: true },
            { label: 'Hierarchy', route: 'organizational-master-data/hierarchy', isVisible: false },
            { label: 'Outsource Contract', route: 'organizational-master-data/view-all-outsource-contract', isVisible: false },
            { label: 'Projects', route: 'organizational-master-data/view-all-projects', isVisible: false },
            { label: 'Location', route: 'organizational-master-data/view-all-location', isVisible: false },
            { label: 'Posts', route: 'organizational-master-data/view-all-posts', isVisible: false },
            { label: 'Time Type', route: 'organizational-master-data/view-all-time-type', isVisible: false },
            { label: 'Tasks', route: 'organizational-master-data/view-all-tasks', isVisible: false },
            { label: 'Pay Element', route: 'organizational-master-data/view-all-pay-element', isVisible: false },
            { label: 'Leaves', route: 'organizational-master-data/view-all-leaves', isVisible: false }
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
      label: 'Onboarding',
      icon: 'fa-solid fa-user-plus',
      isVisible: true,
      collapsed: true,
      children: [
        { label: 'Requisition', route: '/panel/onboarding/view-all-requisition', isVisible: true },
        { label: 'Candidates', route: '/panel/onboarding/view-all-candidates', isVisible: true },
        { label: 'HR Candidate Short Listing', route: '/panel/onboarding/hr-candidate-short-listing', isVisible: true },
        { label: 'Interview Scheduling', route: '/panel/onboarding/view-all-interview-scheduling', isVisible: true },
        { label: 'Interview Feedback', route: '/panel/onboarding/interview-feedback', isVisible: true },
        { label: 'Candidate Screening', route: '/panel/onboarding/candidate-screening', isVisible: true }
      ]
    },
    {
      label: 'Forms',
      icon: 'fa-solid fa-file-lines',
      isVisible: false,
      collapsed: true,
      children: [
        { label: 'View All Forms', route: '/panel/forms/view-all-forms', isVisible: true }
      ]
    },
    {
      label: 'Employees',
      icon: 'fa-solid fa-users',
      isVisible: true,
      collapsed: true,
      children: [
        {
          label: 'Employees-Master-Data',
          icon: 'fas fa-angle-double-right',
          isVisible: true,
          collapsed: true,
          children: [
            { label: 'Employees', route: 'employees-master-data/view-all-employees', isVisible: true },
            { label: 'Onboarding Employees', route: 'employees-master-data/onboarding-employees', isVisible: true },

            { label: 'GOSIID', route: 'employees-master-data/view-all-gosiid', isVisible: false },
            { label: 'Departments', route: 'employees-master-data/view-all-departments', isVisible: false },
            { label: 'Medical Insurance', route: 'employees-master-data/view-all-medical-insurance', isVisible: false },
            { label: 'Accommodation', route: 'employees-master-data/view-all-accommodation', isVisible: false },
            { label: 'Loans', route: 'employees-master-data/view-all-loans', isVisible: false },
            { label: 'Employee Belongings', route: 'employees-master-data/view-all-employee-belongings', isVisible: false },
            { label: 'Employees Category', route: 'employees-master-data/view-all-employees-category', isVisible: false },
            { label: 'Project Transfer', route: 'employees-master-data/view-all-project-transfer', isVisible: false }
          ]
        }
      ]
    },
    {
      label: 'Requisition Lookups',
      icon: 'fa-solid fa-arrows-rotate',
      isVisible: false,
      collapsed: true,
      children: [
        { label: 'Job Title', route: '/panel/requisition-lookups/create-job-title', isVisible: true },
        { label: 'Employee Category', route: '/panel/requisition-lookups/create-employee-category', isVisible: true },
        { label: 'Department', route: '/panel/requisition-lookups/create-department', isVisible: true },
        { label: 'Branches', route: '/panel/requisition-lookups/create-branch', isVisible: true }
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
    private themeService: ThemeService,
    private menuVisibilityService: MenuVisibilityService

  ) { }


  ngOnInit() {
    this.themeService.isLightTheme$.subscribe(value => {
      this.isDarkMode = !value;
    });

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
