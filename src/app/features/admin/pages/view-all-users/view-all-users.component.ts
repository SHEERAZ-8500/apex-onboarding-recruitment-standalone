import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/commons/components/pagination/pagination.component';

@Component({
  selector: 'app-view-all-users',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule, RouterModule, PaginationComponent],
  templateUrl: './view-all-users.component.html',
  styleUrl: './view-all-users.component.scss'
})
export class ViewAllUsersComponent {
  usersList: any[] = [];
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(private adminService: AdminService, private toastr: ToastrService, private loader: LoaderService) {

  }

  currentPage = 0; // Backend uses 0-based indexing
  itemsPerPage = 10;

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loader.show();
    this.adminService.getAllUser(this.currentPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.usersList = response.data;
        
        // Update pagination metadata from API response
        if (response.paginator) {
          this.currentPage = response.paginator.currentPage;
          this.totalItems = response.paginator.totalItems;
          this.totalPages = response.paginator.totalPages;
        }
      }
      ,
      error: (error) => {
        this.loader.hide();
        this.toastr.error('Error fetching users list');
      }
    });
  }



  changePage(page: number) {
    const apiPage = page - 1;
    if (apiPage < 0 || apiPage >= this.totalPages) return;
    this.currentPage = apiPage;
    this.loadUsers();
  }

  onItemsPerPageChange(size: number) {
    this.itemsPerPage = size;
    this.currentPage = 0; // Reset to first page
    this.loadUsers();
  }

  formatRoleName(role: string): string {
  if (!role) return "";

  return role
    .toLowerCase()                       
    .replace(/_/g, " ")                  
    .replace(/\b\w/g, (c) => c.toUpperCase()); 
}
}
