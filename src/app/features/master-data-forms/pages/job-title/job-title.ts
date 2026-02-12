import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ApiService } from '../../../../core/services/apis/api.service';
import { ViewLookupValuesInTableDto } from '../../../../shared/models/common/common-dto-';
import { PaginationComponent } from '../../../../shared/components/commons/components/pagination/pagination.component';
import { MasterDataService } from '../../services/master-data.service';

@Component({
  selector: 'app-view-all-lookup-values-in-table',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PaginationComponent],
  templateUrl: './job-title.html',
  styleUrl: './job-title.scss'
})
export class JobTitle {



  constructor(
    private router: Router,
    private toastr: ToastrService,
    private loader: LoaderService,
    private masterDataService: MasterDataService,
    private activatedRoute: ActivatedRoute
  ) { }

  job_title!: string;
  currentPage = 0; // Backend uses 0-based indexing
  itemsPerPage = 7;
  totalItems = 0;
  totalPages = 0;
  paginatedLookupValues: ViewLookupValuesInTableDto[] = [];



ngOnInit() {
  this.job_title = 'job-title';   
  this.getLookupData();
}



  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }


  changePage(page: number) {
    const apiPage = page - 1;
    if (apiPage < 0 || apiPage >= this.totalPages) return;

    this.currentPage = apiPage;
    this.getLookupData();
  }


  getLookupData() {
    this.loader.show();
    this.masterDataService.getAllJobTitleValuesInTable(this.job_title, this.currentPage, this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.loader.hide();

        this.paginatedLookupValues = res.data || [];
        if (res.paginator) {
          this.currentPage = res.paginator.currentPage;
          this.totalItems = res.paginator.totalItems;
          this.totalPages = res.paginator.totalPages;
          // console.log('Pagination:', res.paginator);
        }
      },
      error: (err: any) => {
        console.error('Error fetching job title values:', err);
        this.loader.hide();

      }
    });
  }
}
