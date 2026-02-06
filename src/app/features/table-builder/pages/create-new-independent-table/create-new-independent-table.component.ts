import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/apis/api.service';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';

interface TableColumn {
  name: string;
  type: string;
  maxLength?: number;
  precision?: number;
  scale?: number;
  lookupComponentCode?: string;
  nullable: boolean;
  displayOrder: number | null;
  isTypeDropdownOpen?: boolean;
  isLookupDropdownOpen?: boolean;
  lookupOptions?: any[];
}

@Component({
  selector: 'app-create-new-independent-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-new-independent-table.component.html',
  styleUrl: './create-new-independent-table.component.scss'
})
export class CreateNewIndependentTableComponent implements OnInit {
  // Table Fields
  rowTableName: string = '';
  description: string = '';

  // Columns Array
  columns: TableColumn[] = [
    {
      name: '',
      type: '',
      maxLength: undefined,
      precision: undefined,
      scale: undefined,
      lookupComponentCode: '',
      nullable: false,
      displayOrder: null,
      isTypeDropdownOpen: false
    }
  ];

  // Column Types
  columnTypes: string[] = [
    'STRING',
    'NUMBER',
    'DATE',
    'BOOLEAN',
    'EMAIL',
    'PHONE',
    'URL',
    'TEXTAREA',
    'LOOKUP_TABLE',
    'LOOKUP_ENUM',
    'ROW_TABLE'
  ];

  // Cached lookup options at component level
  cachedLookupTables: any[] | null = null;
  cachedLookupEnums: any[] | null = null;
  cachedRowTables: any[] | null = null;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private loader: LoaderService,
    private toastr: ToastrService,
    private location: Location
  ) { }

  ngOnInit(): void { }

  // Replace spaces with underscores in table name
  onTableNameInput(): void {
    this.rowTableName = this.rowTableName.replace(/\s+/g, '_');
  }

  // Replace spaces with underscores in column name
  onColumnNameInput(index: number): void {
    this.columns[index].name = this.columns[index].name.replace(/\s+/g, '_');
  }

  // Add new column
  addColumn(): void {
    this.columns.push({
      name: '',
      type: '',
      maxLength: undefined,
      precision: undefined,
      scale: undefined,
      lookupComponentCode: '',
      nullable: false,
      displayOrder: null,
      isTypeDropdownOpen: false
    });
  }

  // Remove column
  removeColumn(index: number): void {
    if (this.columns.length > 1) {
      this.columns.splice(index, 1);
    } else {
      this.toastr.warning('At least one column is required');
    }
  }

  // Toggle column type dropdown
  toggleColumnTypeDropdown(index: number, event: Event): void {
    event.stopPropagation();
    // Close all other dropdowns
    this.columns.forEach((col, i) => {
      if (i !== index) {
        col.isTypeDropdownOpen = false;
      }
    });
    this.columns[index].isTypeDropdownOpen = !this.columns[index].isTypeDropdownOpen;
  }

  // Select column type
  selectColumnType(index: number, type: string, event: Event): void {
    event.stopPropagation();
    const previousType = this.columns[index].type;
    this.columns[index].type = type;
    this.columns[index].isTypeDropdownOpen = false;

    // Reset conditional fields based on type
    if (type !== 'STRING' && type !== 'TEXTAREA') {
      this.columns[index].maxLength = undefined;
    }
    if (type !== 'NUMBER') {
      this.columns[index].precision = undefined;
      this.columns[index].scale = undefined;
    }
    if (type !== 'LOOKUP_ENUM' && type !== 'LOOKUP_TABLE' && type !== 'ROW_TABLE') {
      this.columns[index].lookupComponentCode = '';
      this.columns[index].lookupOptions = undefined; // Clear cached options
    } else if (previousType !== type) {
      // Only clear when switching between different lookup types
      this.columns[index].lookupComponentCode = '';
      this.columns[index].lookupOptions = undefined;
    }
  }

  // Close dropdowns on document click
  @HostListener('document:click', ['$event'])
  closeDropdowns(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown')) {
      this.columns.forEach(col => {
        col.isTypeDropdownOpen = false;
        col.isLookupDropdownOpen = false;
      });
    }
  }

  // Toggle Lookup Dropdown
  toggleLookupDropdown(index: number, event: Event): void {
    event.stopPropagation();
    const column = this.columns[index];
    column.isLookupDropdownOpen = !column.isLookupDropdownOpen;

    // Load options from cache or API
    if (column.isLookupDropdownOpen) {
      if (column.type === 'LOOKUP_TABLE') {
        if (this.cachedLookupTables) {
          column.lookupOptions = this.cachedLookupTables!;
        } else if (!column.lookupOptions) {
          this.loadLookupTableOptions(column);
        }
      } else if (column.type === 'LOOKUP_ENUM') {
        if (this.cachedLookupEnums) {
          column.lookupOptions = this.cachedLookupEnums!;
        } else if (!column.lookupOptions) {
          this.loadLookupEnumOptions(column);
        }
      } else if (column.type === 'ROW_TABLE') {
        if (this.cachedRowTables) {
          column.lookupOptions = this.cachedRowTables!;
        } else if (!column.lookupOptions) {
          this.loadRowTableOptions(column);
        }
      }
    }
  }

  // Select Lookup Option
  selectLookupOption(index: number, option: any, event: Event): void {
    event.stopPropagation();
    const column = this.columns[index];

    if (column.type === 'LOOKUP_TABLE') {
      column.lookupComponentCode = option.componentCode || option.code;
    } else if (column.type === 'LOOKUP_ENUM') {
      column.lookupComponentCode = option.enumComponentCode || option.code;
    } else if (column.type === 'ROW_TABLE') {
      column.lookupComponentCode = option.rowComponentCode || option.code;
    }

    column.isLookupDropdownOpen = false;
  }

  // Load Lookup Table Options
  loadLookupTableOptions(column: TableColumn): void {
    this.apiService.getAllLookUpTables().subscribe({
      next: (res: any) => {
        this.cachedLookupTables = res.data || [];
        column.lookupOptions = this.cachedLookupTables!;
        // Apply to all columns with LOOKUP_TABLE type
        this.columns.forEach(col => {
          if (col.type === 'LOOKUP_TABLE') {
            col.lookupOptions = this.cachedLookupTables!;
          }
        });
      },
      error: (err) => {
        console.error('Error loading lookup tables:', err);
        column.lookupOptions = [];
        this.toastr.error('Failed to load lookup tables');
      }
    });
  }

  // Load Lookup Enum Options  
  loadLookupEnumOptions(column: TableColumn): void {
    this.apiService.getAllLookupEnums().subscribe({
      next: (res: any) => {
        this.cachedLookupEnums = res.data || [];
        column.lookupOptions = this.cachedLookupEnums!;
        // Apply to all columns with LOOKUP_ENUM type
        this.columns.forEach(col => {
          if (col.type === 'LOOKUP_ENUM') {
            col.lookupOptions = this.cachedLookupEnums!;
          }
        });
      },
      error: (err) => {
        console.error('Error loading enums:', err);
        column.lookupOptions = [];
        this.toastr.error('Failed to load enums');
      }
    });
  }

  // Load Row Table Options
  loadRowTableOptions(column: TableColumn): void {
    this.apiService.getAllIndependentTables().subscribe({
      next: (res: any) => {
        this.cachedRowTables = res.data || [];
        column.lookupOptions = this.cachedRowTables!;
        // Apply to all columns with ROW_TABLE type
        this.columns.forEach(col => {
          if (col.type === 'ROW_TABLE') {
            col.lookupOptions = this.cachedRowTables!;
          }
        });
      },
      error: (err) => {
        console.error('Error loading row tables:', err);
        column.lookupOptions = [];
        this.toastr.error('Failed to load row tables');
      }
    });
  }

  // Track by index for ngFor
  trackByIndex(index: number): number {
    return index;
  }

  // Submit Form
  onSubmit(): void {
    // Validation
    if (!this.rowTableName || !this.description) {
      this.toastr.error('Please fill in table name and description');
      return;
    }

    // Validate columns
    for (let i = 0; i < this.columns.length; i++) {
      const col = this.columns[i];
      if (!col.name || !col.type || col.displayOrder === null) {
        this.toastr.error(`Please fill in all required fields for column ${i + 1}`);
        return;
      }
    }

    // Prepare payload
    const payload = {
      rowTableName: this.rowTableName,
      description: this.description,
      columns: this.columns.map(col => ({
        name: col.name,
        type: col.type,
        maxLength: col.maxLength || 0,
        precision: col.precision || 0,
        scale: col.scale || 0,
        lookupComponentCode: col.lookupComponentCode || 'string',
        nullable: col.nullable,
        displayOrder: col.displayOrder
      }))
    };

    console.log('Payload:', payload);

    this.loader.show();

    // Uncomment when API is ready
    this.apiService.createIndependentTable(payload).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.toastr.success('Independent table created successfully');
        this.resetForm();
        this.router.navigate(['/panel/table-builder/view-all-independent-table']);
      },
      error: (error: any) => {
        this.loader.hide();
        this.toastr.error(error?.error?.message || 'Failed to create independent table');
      }
    });

    // Temporary - remove when API is ready
    setTimeout(() => {
      this.loader.hide();
      this.toastr.success('Independent table created successfully');
      this.resetForm();
    }, 1000);
  }

  // Cancel
  onCancel(): void {
    this.location.back();
  }

  // Reset Form
  resetForm(): void {
    this.rowTableName = '';
    this.description = '';
    this.columns = [
      {
        name: '',
        type: '',
        maxLength: undefined,
        precision: undefined,
        scale: undefined,
        lookupComponentCode: '',
        nullable: false,
        displayOrder: null,
        isTypeDropdownOpen: false
      }
    ];
  }
}
