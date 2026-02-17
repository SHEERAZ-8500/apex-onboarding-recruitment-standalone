import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../../../core/services/management-services/Theme.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  isDarkMode: boolean = false;
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() totalPagesArray: number[] = [];
  @Input() itemsPerPage: number = 10;
  @Input() totalItems: number = 0;
  
  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  itemsPerPageOptions: number[] = [5, 10, 20, 50, 100];

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.isLightTheme$.subscribe((value: boolean) => {
      this.isDarkMode = !value;
    });
  }

  get displayRangeStart(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get displayRangeEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  onItemsPerPageChange(value: string | number): void {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
    this.itemsPerPageChange.emit(numValue);
  }
}
