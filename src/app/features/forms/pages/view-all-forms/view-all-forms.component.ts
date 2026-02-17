import { Component } from '@angular/core';
import { FormsService } from '../../services/forms.service';
import { FormDto } from '../../dtos/form.dto';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../../shared/components/commons/components/pagination/pagination.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-all-forms',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginationComponent, NgbDropdownModule],
  templateUrl: './view-all-forms.component.html',
  styleUrl: './view-all-forms.component.scss'
})
export class ViewAllFormsComponent {
  routeNUmber: number = 1;
  FormList: FormDto[] = [];
  formId: string = '';
  currentPage = 0; // Backend uses 0-based indexing
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  constructor(private formsService: FormsService, private route: ActivatedRoute, private loader: LoaderService, private toaster: ToastrService,
  ) {

  }

  getAllFormlist() {
    this.routeNUmber = 1;
    this.loader.show();
    this.formsService.getUserAllForms(this.currentPage, this.itemsPerPage).subscribe((res: any) => {
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
  getAllFormSubmissionById(id: string) {
    this.routeNUmber = 2;
    this.formsService.getAllFormSubmissionsById(id).subscribe((res: any) => {
      this.FormList = res.data;
      console.log(this.FormList, 'byid');
    });
  }

  setInterest(candidate: any, value: boolean | null) {
    candidate.interested = value;
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit() {
    this.getAllFormlist();
  }

  changePage(page: number) {
    const apiPage = page - 1;
    if (apiPage < 0 || apiPage >= this.totalPages) return;
    this.currentPage = apiPage;
    this.getAllFormlist();
  }

  onItemsPerPageChange(size: number) {
    this.itemsPerPage = size;
    this.currentPage = 0; // Reset to first page
    this.getAllFormlist();
  }

  toggleActive(form: FormDto, index: number, event: Event) {
    event.preventDefault();

    const newStatus = form.status === "ACTIVE" ? false : true;
this.loader.show();
    this.formsService.activateForm(form.formCode, newStatus).subscribe(
      () => {
        // Update status only on successful API call
        const mainIndex = this.FormList.findIndex(f => f.formCode === form.formCode);
        if (mainIndex !== -1) {
          this.FormList[mainIndex].status = newStatus ? 'ACTIVE' : 'INACTIVE';
        }
        this.loader.hide();
        this.toaster.success(`Form ${newStatus ? 'activated' : 'deactivated'} successfully`);
      },
      (error) => {
        // Status remains unchanged on error - checkbox will stay in original state
        this.loader.hide();
        this.toaster.error(error.error.message || 'Error activating form');
      }
    );
  }
}
