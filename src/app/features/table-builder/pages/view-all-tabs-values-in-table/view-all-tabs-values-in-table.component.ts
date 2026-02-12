import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ApiService } from '../../../../core/services/apis/api.service';
import { ViewTTabsValuesInTableDto } from '../../../../shared/models/common/common-dto-';
import { PaginationComponent } from '../../../../shared/components/commons/components/pagination/pagination.component';

@Component({
  selector: 'app-view-all-tabs-values-in-table',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './view-all-tabs-values-in-table.component.html',
  styleUrl: './view-all-tabs-values-in-table.component.scss'
})
export class ViewAllTabsValuesInTableComponent {

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private loader: LoaderService,
    private api: ApiService,
    private activatedRoute: ActivatedRoute
  ) { }

  lookupName!: string;
  currentPage = 0; // Backend uses 0-based indexing
  itemsPerPage = 7;
  totalItems = 0;
  totalPages = 0;
  paginatedTabsValues: ViewTTabsValuesInTableDto[] = [];
  rowComponentCode!: string;




  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.rowComponentCode = params['tableName'];

      if (this.rowComponentCode) {
        this.getTabsData();
      }
    });
  }



  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }


  changePage(page: number) {
    const apiPage = page - 1;
    if (apiPage < 0 || apiPage >= this.totalPages) return;

    this.currentPage = apiPage;
    this.getTabsData();
  }


  getTabsData() {
    this.loader.show();
    this.api.getAllTabsValuesInTable(this.rowComponentCode, this.currentPage, this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.loader.hide();

        this.paginatedTabsValues = res.data?.columns || []; if (res.paginator) {
          this.currentPage = res.paginator.currentPage;
          this.totalItems = res.paginator.totalItems;
          this.totalPages = res.paginator.totalPages;
          // console.log('Pagination:', res.paginator);
        }
      },
      error: (err: any) => {
        console.error('Error fetching tabs values:', err);
        this.loader.hide();

      }
    });
  }
}

