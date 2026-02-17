import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services/apis/api.service';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { PaginationComponent } from '../../../../shared/components/commons/components/pagination/pagination.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-all-independent-table',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PaginationComponent, NgbDropdownModule],
  templateUrl: './view-all-independent-table.component.html',
  styleUrl: './view-all-independent-table.component.scss'
})
export class ViewAllIndependentTableComponent {
  routeNUmber: number = 1;
  FormList: any[] = [];
  formId: string = '';
  currentPage = 0; // Backend uses 0-based indexing
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  constructor(private apiService: ApiService, private route: ActivatedRoute, private loader: LoaderService) {

  }

  getAllTablesList() {
    this.routeNUmber = 1;
    this.loader.show();
    this.apiService.getAllIndependentTables(this.currentPage, this.itemsPerPage).subscribe((res: any) => {
      this.FormList = res.data;
      console.log(this.FormList);
      
      // Update pagination metadata from API response
      if (res.paginator) {
        this.currentPage = res.paginator.currentPage;
        this.totalItems = res.paginator.totalItems;
        this.totalPages = res.paginator.totalPages;
      }
      
      this.loader.hide();

    }, error => {
      this.loader.hide();
    });
  }


  setInterest(candidate: any, value: boolean | null) {
    candidate.interested = value;
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit() {
    this.getAllTablesList();
  }

  changePage(page: number) {
    const apiPage = page - 1;
    if (apiPage < 0 || apiPage >= this.totalPages) return;
    this.currentPage = apiPage;
    this.getAllTablesList();
  }

  onItemsPerPageChange(size: number) {
    this.itemsPerPage = size;
    this.currentPage = 0; // Reset to first page
    this.getAllTablesList();
  }
}
