import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/apis/api.service';
import { AllFormsLisitngDto } from '../../../../shared/models/common/common-dto-';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { PaginationComponent } from '../../../../shared/components/commons/components/pagination/pagination.component';

@Component({
  selector: 'app-table-lisitng',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PaginationComponent],
  templateUrl: './table-lisitng.component.html',
  styleUrl: './table-lisitng.component.scss'
})
export class TableLisitngComponent {
  routeNUmber: number = 1;
  FormList: any[] = []
  formId: string = '';
  constructor(private apiService: ApiService, private route: ActivatedRoute, private loader: LoaderService) {

  }

  getAllTablesList() {
    this.routeNUmber = 1;
    this.loader.show();
    this.apiService.getAllTables('').subscribe((res: any) => {
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
