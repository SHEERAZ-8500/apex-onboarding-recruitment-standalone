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
  constructor(private formsService: FormsService, private route: ActivatedRoute, private loader: LoaderService, private toaster: ToastrService,
  ) {

  }

  getAllFormlist() {
    this.routeNUmber = 1;
    this.loader.show();
    this.formsService.getUserAllForms().subscribe((res: any) => {
      this.FormList = res.data;
      console.log(this.FormList);
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
  currentPage = 1;
  itemsPerPage = 7;

  get totalPages() {
    return Math.ceil(this.FormList.length / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginatedFormList() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.FormList.slice(start, end);
  }

  ngOnInit() {
    this.getAllFormlist();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
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
