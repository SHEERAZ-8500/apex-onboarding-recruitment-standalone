import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../core/services/apis/api.service';
import { FormDto, HrCandidateShortListingDto } from '../../../../shared/models/common/common-dto-';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { PaginationComponent } from '../../../../shared/components/commons/components/pagination/pagination.component';

@Component({
  selector: 'app-hr-candidate-short-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule, PaginationComponent],
  templateUrl: './hr-candidate-short-listing.component.html',
  styleUrl: './hr-candidate-short-listing.component.scss'
})
export class HrCandidateShortListingComponent {
  routeNUmber: number = 1;
  candidateList: HrCandidateShortListingDto[] = [];
  formId: string = '';

  // Pagination properties
  currentPage = 0; // Backend uses 0-based indexing
  itemsPerPage = 7;
  totalItems = 0;
  totalPages = 0;
  selectAll: boolean = false;
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private loader: LoaderService,
    private toaster: ToastrService,
    private modalService: NgbModal
  ) {
    // this.allCandidates();
  }

  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
      (result) => {
        console.log('Closed with:', result);
      },
      (reason) => {
        console.log('Dismissed with:', reason);
      }
    );
  }

  setInterest(candidate: any, value: boolean | null) {
    candidate.interested = value;
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginatedFormList() {
    return this.candidateList;
  }

  ngOnInit() {
    this.allCandidates();
  }

  changePage(page: number) {
    // Convert from 1-based (UI) to 0-based (API)
    const apiPage = page - 1;
    if (apiPage < 0 || apiPage >= this.totalPages) return;
    this.currentPage = apiPage;
    this.allCandidates();
  }


  toggleActive(form: any, index: number, event: Event) {
    event.preventDefault();

    const newStatus = form.status === "ACTIVE" ? false : true;
    // this.loader.show();

  }
  allCandidates() {
    this.loader.show();
    this.apiService.getAllCandidates('APPLIED', this.currentPage, this.itemsPerPage).subscribe((res: any) => {
      this.candidateList = res.data;

      // Update pagination metadata from API response
      if (res.paginator) {
        this.currentPage = res.paginator.currentPage;
        this.totalItems = res.paginator.totalItems;
        this.totalPages = res.paginator.totalPages;
        // console.log('Pagination:', res.paginator);
      }

      console.log(this.candidateList, 'candidates');
      this.loader.hide();
    }, error => {
      this.loader.hide();
      this.toaster.error(error.error.message || 'Error fetching candidates');
    });
  }

  shortlistCandidateBySingle(publicId: any) {
    // Find the candidate to handle toggle state
    const candidate = this.candidateList.find(c => c.publicId === publicId);
    if (!candidate) return;

    const data = {
      publicIds: [publicId]
    };
    this.loader.show();
    this.apiService.canididateShortlist(data).subscribe((res: any) => {
      this.loader.hide();
      this.toaster.success('Candidate shortlisted successfully');
      this.allCandidates();
    }, error => {
      this.loader.hide();
      // Revert the toggle state on error
      candidate.selected = false;
      this.toaster.error(error.error.message || 'Error shortlisting candidate');
    });
  }
  shortlistCandidateByMultiple() {
    this.candidateList.forEach((key, index) => {
      this.candidateList[index].selected = true;
    });
    const selectedPublicIds: string[] = this.candidateList
      .filter(c => c.selected)
      .map(c => c.publicId);

    const data = {
      publicIds: selectedPublicIds
    };
    this.loader.show();

    this.apiService.canididateShortlist(data).subscribe((res: any) => {
      this.toaster.success('Candidate shortlisted successfully');
      this.selectAll = false;
      this.allCandidates();
      this.loader.hide();
    }, error => {
      this.loader.hide();
      // Revert all toggles back to false on error
      this.candidateList.forEach((candidate) => {
        candidate.selected = false;
      });
      this.toaster.error(error.error.message || 'Error shortlisting candidate');
      this.selectAll = false;
    });
  }
  deleteRequisition(value: any) {
    let status = ''
    if (value.isActive) {
      status = 'deactivate'
    }
    else {
      status = 'activate'
    }
    this.loader.show();
    this.apiService.deletValueInFromTbale('job-requisition', value.code, status).subscribe({
      next: (res: any) => {
        this.toaster.success('Requisition deleted successfully');
        this.allCandidates();
        this.loader.hide();
      }
      ,
      error: (err: any) => {
        console.error('Error deleting requisition:', err);
        this.toaster.error('Failed to delete requisition');
        this.loader.hide();
      }
    });
  }
}
