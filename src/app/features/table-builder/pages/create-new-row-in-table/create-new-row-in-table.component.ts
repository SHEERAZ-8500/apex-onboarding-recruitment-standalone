import { Component, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableBuilderService } from '../../services/table-builder.service';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { CreateColumnDto } from '../../dtos/create-column.dto';

interface TableColumn {
  name: string;
  type: string;
  maxLength?: number;
  precision?: number;
  scale?: number;
  nullable: boolean;
  displayOrder: number | null;
  lookupComponentCode?: string;
  isTypeDropdownOpen?: boolean;
  isLookupDropdownOpen?: boolean;
  lookupOptions?: any[];
}

@Component({
  selector: 'app-create-new-row-in-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-new-row-in-table.component.html',
  styleUrl: './create-new-row-in-table.component.scss'
})
export class CreateNewRowInTableComponent implements OnInit {

  createNewColumnInIndependentTableDto = new CreateColumnDto();

  componentCode: string = '';


  componentTitle = ""
  // Field Type options
  fieldTypes: string[] = [
    'STRING',
    'NUMBER',
    'DATE',
    'BOOLEAN',
    'EMAIL',
    'PHONE',
    'URL',
    'TEXTAREA'
  ];


  // Form Fields
  rowTableName: string = '';
  description: string = '';
  columns: TableColumn[] = [
    {
      name: '',
      type: '',
      nullable: false,
      displayOrder: null,
      isTypeDropdownOpen: false
    }
  ];

  //form fields column
  name: string = '';
  fieldType: string = '';
  maxLength: number | null = null;
  precision: number | null = null;
  scale: number | null = null;
  nullable: boolean = true;
  displayOrder: number | null = null;
  active: boolean = true;
  lookupComponentCode: string = '';
  currentPath: string | undefined
  rowTableCode: string = '';
  // Dropdown state
  isFieldTypeDropdownOpen: boolean = false;
  selectedFieldType: string = '';

  // Column Type Options
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
    'LOOKUP_ENUM'
  ];

  constructor(
    private router: Router,
    private tableBuilderService: TableBuilderService,
    private loader: LoaderService,
    private toastr: ToastrService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
  ) { }


  ngOnInit(): void {

    this.currentPath = this.activatedRoute.snapshot.routeConfig?.path;
    console.log(this.currentPath);

    // Get query parameter
    this.activatedRoute.queryParams.subscribe(params => {
      this.rowTableCode = params['tableName'] || '';
      console.log('Selected Enum:', this.rowTableCode);
    });

    if (this.currentPath === 'create-new-row-in-table') {
      this.componentTitle = "Add New Row to Independent Table";
    } else {
      this.componentTitle = "Add New Column to Independent Table";
    }
  }



  // Add new column
  addColumn(): void {
    this.columns.push({
      name: '',
      type: '',
      nullable: false,
      displayOrder: null,
      isTypeDropdownOpen: false
    });
  }

  // Remove column
  removeColumn(index: number): void {
    if (this.columns.length > 1) {
      this.columns.splice(index, 1);
    }
  }

  // TrackBy function
  trackByIndex(index: number): number {
    return index;
  }

  // Toggle Type Dropdown
  toggleTypeDropdown(index: number, event: Event): void {
    event.stopPropagation();
    this.columns[index].isTypeDropdownOpen = !this.columns[index].isTypeDropdownOpen;
  }

  // Select Column Type
  selectColumnType(index: number, type: string, event: Event): void {
    event.stopPropagation();
    this.columns[index].type = type;
    this.columns[index].isTypeDropdownOpen = false;
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

    // Load options if not already loaded
    if (column.isLookupDropdownOpen && !column.lookupOptions) {
      if (column.type === 'LOOKUP_TABLE') {
        this.loadLookupTableOptions(column);
      } else if (column.type === 'LOOKUP_ENUM') {
        this.loadLookupEnumOptions(column);
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
    }

    column.isLookupDropdownOpen = false;
  }

  // Load Lookup Table Options
  loadLookupTableOptions(column: TableColumn): void {
    this.tableBuilderService.getAllLookUpTables().subscribe({
      next: (res: any) => {
        column.lookupOptions = res.data || [];
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
    this.tableBuilderService.getAllLookupEnums().subscribe({
      next: (res: any) => {
        column.lookupOptions = res.data || [];
      },
      error: (err) => {
        console.error('Error loading enums:', err);
        column.lookupOptions = [];
        this.toastr.error('Failed to load enums');
      }
    });
  }

  // Submit Form
  onSubmit(): void {

    let payload: any;

    if (this.currentPath === 'create-new-row-in-table') {


      // Validation
      if (!this.rowTableName || !this.description) {
        this.toastr.error('Please fill in table name and description');
        return;
      }

      if (this.columns.length === 0) {
        this.toastr.error('Please add at least one column');
        return;
      }

      // Validate columns
      for (let i = 0; i < this.columns.length; i++) {
        const col = this.columns[i];
        if (!col.name || !col.type || col.displayOrder === null) {
          this.toastr.error(`Please fill all required fields for Column ${i + 1}`);
          return;
        }

        if (col.type === 'LOOKUP_ENUM' && !col.lookupComponentCode) {
          this.toastr.error(`Lookup Component Code is required for Column ${i + 1}`);
          return;
        }
      }

      // Build payload
      const payload: any = {
        rowTableName: this.rowTableName,
        description: this.description,
        columns: this.columns.map(col => {
          const column: any = {
            name: col.name,
            type: col.type,
            nullable: col.nullable,
            displayOrder: col.displayOrder
          };

          if (col.maxLength) {
            column.maxLength = col.maxLength;
          }

          if (col.lookupComponentCode) {
            column.lookupComponentCode = col.lookupComponentCode;
          }

          return column;
        })
      };

      console.log('Payload:', payload);

      this.loader.show();

      // Uncomment when API is ready
      this.tableBuilderService.createRowInTable(payload).subscribe({
        next: (response: any) => {
          this.loader.hide();
          this.toastr.success('Row table created successfully');
          this.resetForm();
        },
        error: (error: any) => {
          this.loader.hide();
          this.toastr.error(error?.error?.message || 'Failed to create row table');
        }
      });

    } else {
      
      this.createNewColumnInIndependentTableDto.type =  this.selectedFieldType
      if (this.createNewColumnInIndependentTableDto.name === '' || this.createNewColumnInIndependentTableDto.type === '' || this.rowTableCode === '') {
        this.toastr.error('Please fill all required fields');
        return;
      }
      this.loader.show();
      this.tableBuilderService.createNewColumnInIndependentTable(this.rowTableCode, this.createNewColumnInIndependentTableDto).subscribe((respnose: any) => {
        this.loader.hide();
        this.toastr.success('New column added successfully');
        this.resetForm();
        this.location.back();
      }, error => {
        this.loader.hide();
        this.toastr.error(error?.error?.message || 'Failed to create new column in independent table');
      })
    }


  }

  // Cancel
  onCancel(): void {
    this.resetForm();
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
        nullable: false,
        displayOrder: null,
        isTypeDropdownOpen: false
      }
    ];
  }



  // Toggle dropdown
  toggleFieldTypeDropdown(event: Event): void {
    event.stopPropagation();
    this.isFieldTypeDropdownOpen = !this.isFieldTypeDropdownOpen;
  }

  // Select dropdown option
  selectFieldType(type: string, event: Event): void {
    event.stopPropagation();
    this.selectedFieldType = type;
    this.fieldType = type;
    this.isFieldTypeDropdownOpen = false;
  }

  // Close dropdown on outside click
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event): void {
    this.isFieldTypeDropdownOpen = false;
  }

  onFieldCodeInput(): void {
    if (this.createNewColumnInIndependentTableDto.name) {
      this.createNewColumnInIndependentTableDto.name =
        this.createNewColumnInIndependentTableDto.name.replace(/\s+/g, '_');
    }
  }




}
