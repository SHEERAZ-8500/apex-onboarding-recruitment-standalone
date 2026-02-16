import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeesService } from '../../services/employees.service';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { PaginationComponent } from '../../../../shared/components/commons/components/pagination/pagination.component';
import { OnboardingEmployeeDto, OnboardingEmployeesListResponseDto } from '../../dtos/onboarding-employees-list.dto';

@Component({
  selector: 'app-onbaording-employees-list',
  imports: [CommonModule, PaginationComponent],
  templateUrl: './onbaording-employees-list.html',
  styleUrl: './onbaording-employees-list.scss',
})
export class OnbaordingEmployeesList implements OnInit {
  constructor(
    private employeesService: EmployeesService, 
    private loaderService: LoaderService,
    private router: Router
  ) {}
  
  onboardingEmployees: OnboardingEmployeeDto[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  totalPagesArray: number[] = [];
  totalItems: number = 0;

  ngOnInit() {
    this.fetchOnboardingEmployees(0);
  }
  
  fetchOnboardingEmployees(page: number = 0) {
    this.loaderService.show();
    this.employeesService.onboardEmployeeListing(page).subscribe({
      next: (response: OnboardingEmployeesListResponseDto) => {
        this.onboardingEmployees = response.data;
        this.currentPage = response.paginator.currentPage + 1; // Convert 0-based to 1-based
        this.totalPages = response.paginator.totalPages;
        this.totalItems = response.paginator.totalItems;
        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.loaderService.hide();
      },
      error: (error: any) => {
        console.error('Error fetching onboarding employees:', error);
        this.loaderService.hide();
      }
    });
  }

  onPageChange(page: number): void {
    this.fetchOnboardingEmployees(page - 1); // Convert 1-based to 0-based for API
  }

  confirmEmployee(employe:any): void {
    this.router.navigate(['/panel/employees-master-data/confirm-onboarding-employee'], {
      queryParams: { code: employe.code ,status: employe.onboarding_status}
    });
  }
}
