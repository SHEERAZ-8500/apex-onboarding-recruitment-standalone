import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableBuilderService } from '../../services/table-builder.service';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { CreateColumnDto } from '../../dtos/create-column.dto';




@Component({
  selector: 'app-add-new-row-lookup-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-new-row-lookup-table.component.html',
  styleUrl: './add-new-row-lookup-table.component.scss'
})
export class AddNewRowLookupTableComponent implements OnInit {

  createColumnDto = new CreateColumnDto()

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


  // Component Code from URL
  componentCode: string = '';

  // Form Fields tableName
  code: string = '';
  name: string = '';
  description: string = '';
  isActive: boolean = true;
  editMode: boolean = false;
  // Form Fields lookupName
  fieldCode: string = '';
  fieldType: string = '';
  maxLength: number | null = null;
  precision: number | null = null;
  scale: number | null = null;
  nullable: boolean = true;
  displayOrder: number | null = null;
  publicId: string = '';
  // Dropdown state
  isFieldTypeDropdownOpen: boolean = false;
  selectedFieldType: string = '';


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tableBuilderService: TableBuilderService,
    private loader: LoaderService,
    private toastr: ToastrService,
    private location: Location
  ) { }

  ngOnInit(): void {


    // Get componentCode from URL query params
    this.route.queryParams.subscribe(params => {

      if (params['mode'] === 'edit') {
        this.editMode = true;
        this.componentTitle = "Edit Value in Lookup Table";
        this.componentCode = params['lookupName'] || '';
        this.code = params['code'] || '';
        this.name = params['name'] || '';
        this.description = params['description'] || '';
        this.isActive = params['isActive'] === 'true' || params['isActive'] === true ? true : false;
        this.publicId = params['publicId'] || '';
        return

      }
      if (params['tableName']) {
        this.componentCode = params['tableName'] || '';
        this.componentTitle = "Add New Row to Lookup Table";

      } else if (params['lookupName']) {
        this.componentCode = params['lookupName'] || '';
        this.componentTitle = "Add New Column to Lookup Table";

      }


    });
  }


  // Submit Form
  onSubmit(): void {

    // edit case
    let payload: any;

    if (this.editMode) {
      payload = {
        code: this.code,
        name: this.name,
        description: this.description,
        isActive: this.isActive
      };
      this.tableBuilderService.editLookupTableRow(this.componentCode, this.publicId, payload).subscribe({
        next: (response: any) => {
          this.loader.hide();
          this.toastr.success('Row updated successfully');
          this.resetForm();
          this.location.back();
        }
        , error: (error: any) => {
          this.loader.hide();
          this.toastr.error(error?.error?.message || 'Failed to update row');
        }
      });
      return
    }


    if (this.componentCode !== 'tableName') {


      if (!this.code || !this.description) {
        this.toastr.error('Please fill in all required fields');
        return;
      }

      payload = {
        code: this.code,
        name: this.name,
        description: this.description,
        isActive: this.isActive
      };

      this.tableBuilderService.createRowInLookUpTable(this.componentCode, payload).subscribe({
        next: (response: any) => {
          this.loader.hide();
          this.toastr.success('Row added successfully');
          this.resetForm();
        },
        error: (error: any) => {
          this.loader.hide();
          this.toastr.error(error?.error?.message || 'Failed to add row');
        }
      });

    } else {
      // lookupName payload
      this.createColumnDto.type = this.fieldType

      if (!this.createColumnDto.name || !this.fieldType || this.createColumnDto.displayOrder === null) {
        this.toastr.error('Please fill in all required fields');
        return;
      }
      this.tableBuilderService.createNewColumnInLookupTable(this.componentCode, this.createColumnDto).subscribe({
        next: (response: any) => {
          this.loader.hide();
          this.toastr.success('Column added successfully');
          this.resetForm();
          this.location.back();
        },
        error: (error: any) => {
          this.loader.hide();
          this.toastr.error(error?.error?.message || 'Failed to add column');
        }
      });
    }
  }


  // Cancel
  onCancel(): void {

    this.resetForm();
    this.location.back();
  }

  // Reset Form
  resetForm(): void {
    // tableName fields
    this.code = '';
    this.name = '';
    this.description = '';
    this.isActive = true;

    // lookupName fields
    this.fieldCode = '';
    this.fieldType = '';
    this.selectedFieldType = '';
    this.maxLength = null;
    this.precision = null;
    this.scale = null;
    this.nullable = true;
    this.displayOrder = null;
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
    this.fieldCode = this.fieldCode.replace(/\s+/g, '_');
  }

}
