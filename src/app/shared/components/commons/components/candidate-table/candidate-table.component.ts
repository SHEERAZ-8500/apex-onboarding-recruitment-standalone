import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-candidate-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './candidate-table.component.html',
  styleUrls: ['./candidate-table.component.scss']
})
export class CandidateTableComponent {
  @Input() candidates: any[] = []

  setInterest(candidate: any, value: boolean | null) {
    candidate.interested = value;
  }
  currentPage = 1;
  itemsPerPage = 5;
  paginatedCandidates: any[] = [];

  get totalPages() {
    return Math.ceil(this.candidates.length / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit() {
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedCandidates = this.candidates.slice(start, end);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }


}
