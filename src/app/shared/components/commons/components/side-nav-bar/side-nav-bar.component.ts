import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../../core/services/apis/api.service';
import { ThemeService } from '../../../../../core/services/management-services/Theme.service';
import { ToggleService } from '../../../../../core/services/management-services/ToggleService';
import { SessionService } from '../../../../../core/services/management-services/Session.service';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';




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

  constructor(private toggleService: ToggleService,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private SessionService: SessionService,
    private themeService: ThemeService

  ) { }


  ngOnInit() {
    this.themeService.isLightTheme$.subscribe(value => {
      this.isDarkMode = !value;
    });

    this.toggleService.sidebarOpen$.subscribe(open => {
      this.isOpen = open;

      // 👇 IMPORTANT PART
      if (!open) {
        this.collapseAllMenus();
      }
    });
  }



  private collapseAllMenus() {
    this.tableCollapsed = true;
    this.assesment = true;

    this.masterdataCollapsed = true;
    this.generalMasterdataCollapsed = true;
    this.organizationalMasterdataCollapsed = true;
    this.outsourcinggMasterdataCollapsed = true;

    this.employeesCollapsed = true;
    this.employeesMasterDataCollapsed = true;

    this.onboardingCollapsed = true;

    this.formsCollapsed = true;
    this.adminCollapsed = true;
    this.requisitionLookupsCollapsed = true;
    this.setupsCollapsed = true;
  }

  logoutUser() {

    this.apiService.logout().subscribe((res) => {
      this.toastr.success("Logout Successfully")
      this.SessionService.clearStorage()
      this.router.navigate(["/"])
    }, (error) => {


    })
  }
  // top-level groups
  assesment = true;
  masterdata = true;
  employees = true;
  onboarding = true;
  setups = true;



  // master data tree state
  masterdataCollapsed = true;
  generalMasterdataCollapsed = true;
  organizationalMasterdataCollapsed = true;
  outsourcinggMasterdataCollapsed = true;
  employeesCollapsed = true;
  onboardingCollapsed = true;
  // other groups
  adminCollapsed = true;
  formsCollapsed = true;
  requisitionLookupsCollapsed = true;
  employeesMasterDataCollapsed = true;
  tableCollapsed = true;
  setupsCollapsed = true;
  userSetupsCollapsed = true;
  configurationCollapsed = true;


  // toggles (bound to click handlers)
  toggleAssessment() { this.assesment = !this.assesment; }

  toggleMasterData() { if (!this.canToggle()) return; this.masterdataCollapsed = !this.masterdataCollapsed; }
  toggleEmployees() { if (!this.canToggle()) return; this.employeesCollapsed = !this.employeesCollapsed; }


  toggleGeneralMaster() { this.generalMasterdataCollapsed = !this.generalMasterdataCollapsed; }

  toggleOrganizationalMaster() { this.organizationalMasterdataCollapsed = !this.organizationalMasterdataCollapsed; }

  toggleOutsourcingMaster() { this.outsourcinggMasterdataCollapsed = !this.outsourcinggMasterdataCollapsed; }

  toggleAdmin() { this.adminCollapsed = !this.adminCollapsed; }

  toggleForms() { this.formsCollapsed = !this.formsCollapsed; }

  toggleRequisitionLookups() { this.requisitionLookupsCollapsed = !this.requisitionLookupsCollapsed; }
  toggleEmployeesMasterData() { this.employeesMasterDataCollapsed = !this.employeesMasterDataCollapsed; }

  toggleOnboarding() { if (!this.canToggle()) return; this.onboardingCollapsed = !this.onboardingCollapsed; }

  toggleTable() { this.tableCollapsed = !this.tableCollapsed; }
  toggleSetups() { if (!this.canToggle()) return; this.setupsCollapsed = !this.setupsCollapsed; }
  toggleUserSetups() { this.userSetupsCollapsed = !this.userSetupsCollapsed; }
  toggleConfiguration() { this.configurationCollapsed = !this.configurationCollapsed; }

  private canToggle(): boolean {
    return this.isOpen;
  }

}
