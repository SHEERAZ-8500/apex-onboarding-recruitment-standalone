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
  FormList: any[] = []
  formId: string = '';
  constructor(private apiService: ApiService, private route: ActivatedRoute, private loader: LoaderService) {

  }

  getAllTablesList() {
    this.routeNUmber = 1;
    this.loader.show();
    this.apiService.getAllIndependentTables().subscribe((res: any) => {
      this.FormList = res.data;
      console.log(this.FormList);
      this.updatePagination();
      this.loader.hide();

    }, error => {
      this.loader.hide();
    });
  }


  setInterest(candidate: any, value: boolean | null) {
    candidate.interested = value;
  }
  currentPage = 1;
  itemsPerPage = 7;
  paginatedFormList: any[] = [];

  get totalPages() {
    return Math.ceil(this.FormList.length / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit() {
    this.updatePagination();

    this.getAllTablesList();

  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedFormList = this.FormList.slice(start, end);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }
}
