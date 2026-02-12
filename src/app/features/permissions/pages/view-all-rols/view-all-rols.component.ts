import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { PermissionsService } from '../../services/permissions.service';
import { RoleDto } from '../../dtos/role.dto';
import { PaginationComponent } from '../../../../shared/components/commons/components/pagination/pagination.component';

@Component({
  selector: 'app-view-all-rols',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbDropdownModule,PaginationComponent],
  templateUrl: './view-all-rols.component.html',
  styleUrl: './view-all-rols.component.scss'
})
export class ViewAllRolsComponent {
  usersList: any[] = [];
  totalItems: number = 0;
  totalPagesCount: number = 0;

  constructor(
    private permissionsService: PermissionsService,
    private toastr: ToastrService,
    private loader: LoaderService,
    private router: Router
  ) { }

  currentPage = 1;
  itemsPerPage = 7;
  paginatedUsersList: any[] = [];

  get totalPages() {
    return this.totalPagesCount || Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loader.show();
    this.permissionsService.getAllRoles().subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.usersList = response.data;
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1; // Backend 0-indexed
        this.paginatedUsersList = this.usersList;
      },
      error: (error) => {
        this.loader.hide();
        this.toastr.error('Error fetching roles list');
      }
    });
  }



  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadUsers();
  }

  formatRoleName(role: string): string {
    if (!role) return "";

    return role
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  goToPermissions(user: any) {

  this.router.navigate(
    ['/panel/permissions/view-permissions'],
    {
      queryParams: { publicId: user.publicId }
    }
  );
}
}
