import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../core/services/apis/api.service';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ViewEnumValuesInTableDto } from '../../../../shared/models/common/common-dto-';
import { PaginationComponent } from '../../../../shared/components/commons/components/pagination/pagination.component';

@Component({
  selector: 'app-view-all-enums-values-in-table',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PaginationComponent],
  templateUrl: './view-all-enums-values-in-table.component.html',
  styleUrl: './view-all-enums-values-in-table.component.scss'
})
export class ViewAllEnumsValuesInTableComponent {



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
  enumComponentCode!: string;
  paginatedEnumsValues: ViewEnumValuesInTableDto[] = [];
  enumValues: any[] = [];




  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.enumComponentCode = params['enum'];

      if (this.enumComponentCode) {
        this.getEnumsData();
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
    this.getEnumsData();
  }


  getEnumsData() {
    this.loader.show();
    this.api.getAllEnumValuesInTable(
      this.enumComponentCode,
      this.currentPage,
      this.itemsPerPage
    ).subscribe({
      next: (res: any) => {
        this.loader.hide();

        // ✅ YAHAN FIX
        this.enumValues = res.data?.values || [];
        this.totalItems = res.data?.valueCount || 0;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      },
      error: (err: any) => {
        this.loader.hide();
        console.error(err);
      }
    });
  }



  onDeleteEnumValue(value: string) {
    if (!this.enumComponentCode) {
      this.toastr.error('Enum parameter is missing');
      return;
    }

    this.loader.show();
    const payload = {

      remove: [value],
    };
    this.api.addNewEnum(this.enumComponentCode, payload).subscribe((response) => {
      this.loader.hide();
      this.toastr.success('deleted values  successfully');
      this.getEnumsData();
    }, error => {
      this.loader.hide();
      this.toastr.error(error?.error?.message || 'Failed to delete enum values');
    });

  }
}
