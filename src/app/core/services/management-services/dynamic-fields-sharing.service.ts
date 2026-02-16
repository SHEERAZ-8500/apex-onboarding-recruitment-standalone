import { Injectable, HostListener } from '@angular/core';
import { ApiService } from '../apis/api.service';
import { DynamicFieldDto } from '../../../shared/models/common/dynamicFields-dto-';

@Injectable({
  providedIn: 'root'
})
export class DynamicFieldsSharingService {
  // Dynamic Fields
  dynamicFields: DynamicFieldDto[] = [];
  dynamicFieldsData: { [key: string]: any } = {};
  rowTableFields: DynamicFieldDto[] = [];
  rowTableData: {
    [fieldCode: string]: Array<{ [columnCode: string]: any }>
  } = {};


  // Sidebar Tabs
  sidebarTabs: any[] = [];
  activeTabId: number = 1;

  constructor(private api: ApiService) { }

  /**
   * Load dynamic fields and tabs from backend
   * @param formCode The form code to fetch dynamic fields for
   * @param formType The form type (e.g., 'USER_DEFINED')
   * @param existingTabs The existing static tabs before dynamic tabs are added
   */
  loadDynamicFields(formCode: string, formType: string, existingTabs: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.getFormById(formCode, formType).subscribe({
        next: (res: any) => {
          const allFields = res.data.fields || [];

          console.log('🔍 Raw fields from backend:', allFields.length);

          // Map to DTOs to ensure all properties have default values
          const mappedFields = allFields.map((f: any) => new DynamicFieldDto(f));

          // Separate ROW fields for tabs and other fields for display
          // Filter only active fields
          this.dynamicFields = mappedFields.filter((f: DynamicFieldDto) => f.fieldType !== 'ROW' && f.active);

          // Filter ROW fields: only active ones, sorted by displayOrder
          this.rowTableFields = mappedFields
            .filter((f: DynamicFieldDto) => f.fieldType === 'ROW' && f.active === true)
            .sort((a: DynamicFieldDto, b: DynamicFieldDto) => (a.displayOrder || 0) - (b.displayOrder || 0));

          console.log('✅ Filtered ROW fields (active only):', this.rowTableFields.map(f => ({
            fieldCode: f.fieldCode,
            label: f.label,
            active: f.active,
            displayOrder: f.displayOrder,
            rowColumns: f.rowColumns?.length || 0
          })));

          // Initialize sidebar tabs with existing tabs
          this.sidebarTabs = [...existingTabs];
          const startingTabId = existingTabs.length > 0 ? existingTabs.length + 1 : 1;

          // Add active ROW fields as new tabs in sidebar (already filtered and sorted)
          this.rowTableFields.forEach((field: DynamicFieldDto, index: number) => {
            this.sidebarTabs.push({
              id: startingTabId + index,
              name: field.label,
              icon: 'fa-table',
              active: field.active,
              rowTableField: field // Store reference to the field
            });
          });

          console.log('✅ Final sidebar tabs:', this.sidebarTabs.map(t => ({ id: t.id, name: t.name })));

          // Set first tab as active by default
          if (this.sidebarTabs.length > 0) {
            this.setActiveTab(this.sidebarTabs[0].id);
          }

          resolve();
        },
        error: (err) => {
          console.error('Error loading dynamic fields:', err);
          reject(err);
        }
      });
    });
  }

  /**
   * Set active tab
   * @param tabId The tab ID to set as active
   */
  setActiveTab(tabId: number): void {
    this.activeTabId = tabId;
    this.sidebarTabs.forEach(tab => {
      tab.active = tab.id === tabId;
    });
  }

  /**
   * Toggle dynamic field dropdown
   * @param field The field to toggle dropdown for
   * @param event The event object
   */
  toggleDynamicDropdown(field: any, event: Event): void {
    event.stopPropagation();
    field.isDropdownOpen = !field.isDropdownOpen;

    // Close other dropdowns
    this.dynamicFields.forEach(f => {
      if (f !== field) f.isDropdownOpen = false;
    });

    // Load options on first open if not already loaded
    if (field.isDropdownOpen && !field.optionsLoaded) {
      if (field.fieldType === 'LOOKUP_TABLE' && field.lookupTable) {
        this.loadLookupTableOptions(field);
      }
    }
  }

  /**
   * Select option from dynamic field dropdown
   * @param field The field to select option for
   * @param option The selected option
   * @param event The event object
   */
  selectDynamicOption(field: any, option: any, event: Event): void {
    event.stopPropagation();
    if (field.fieldType === 'LOOKUP_ENUM') {
      this.dynamicFieldsData[field.fieldCode] = option;
    } else {
      this.dynamicFieldsData[field.fieldCode] = option.id || option.code || option;
    }
    field.isDropdownOpen = false;
  }

  /**
   * Get display text for selected option in dynamic field
   * @param field The field to get display text for
   * @returns The display text
   */
  getSelectedDisplayText(field: any): string {
    const selectedValue = this.dynamicFieldsData[field.fieldCode];
    if (!selectedValue) {
      return 'Select ' + field.label;
    }
    if (field.options) {
      const option = field.options.find((opt: any) =>
        (opt.id || opt.code) === selectedValue
      );
      return option?.displayText || option?.name || selectedValue;
    }
    return selectedValue;
  }

  /**
   * Load lookup table options for a field
   * @param field The field to load options for
   */
  loadLookupTableOptions(field: any): void {
    this.api.getLokupTableByCode(field.lookupTable).subscribe({
      next: (res: any) => {
        field.options = res.data || [];
        field.optionsLoaded = true;
      },
      error: (err) => {
        console.error('Error loading lookup table options:', err);
        field.options = [];
        field.optionsLoaded = true;
      }
    });
  }

  /**
   * Toggle row column dropdown
   * @param column The column to toggle dropdown for
   * @param event The event object
   */
  toggleRowColumnDropdown(column: any, event: Event): void {

    event.stopPropagation();
    column.isDropdownOpen = !column.isDropdownOpen;

    // Load options on first open if not already loaded
    if (column.isDropdownOpen && !column.optionsLoaded) {
      if (column.fieldType === 'LOOKUP_TABLE' && column.linkedComponent) {
        if (column.lookupSource === 'FORM') {
          this.loadRowColumnLookupOptionsWithFormType(column);
        } if (column.lookupSource) {

        } if (column.lookupSource === 'LOOKUP_TABLE' || column.fieldType === 'LOOKUP_TABLE') {
          this.loadRowColumnLookupOptions(column);

        }
      }
    }
  }

  /**
   * Select option from row column dropdown
   * @param column The column to select option for
   * @param option The selected option
   * @param event The event object
   */
  selectRowColumnOption(column: any, option: any, event: Event): void {
    event.stopPropagation();
    
    if (column.fieldType === 'LOOKUP_ENUM') {
      column.selectedValue = option;
    } else {
      column.selectedValue = option.id || option.code || option;
    }
    column.isDropdownOpen = false;
  }
selectRowColumnOptionMutliple(column: any, option: any, event: Event, row: any): void {
  event.stopPropagation();

  if (column.fieldType === 'LOOKUP_ENUM') {
    column.selectedValue = option;
    if (row && column.fieldCode) {
      row[column.fieldCode] = option; // row data me bhi assign karo
    }
  } else {
    const value = option.id || option.code || option;
    column.selectedValue = value;
    if (row && column.fieldCode) {
      row[column.fieldCode] = value; // row data me assign karo
    }
  }

  column.isDropdownOpen = false;
}

  /**
   * Get display text for selected option in row column
   * @param column The column to get display text for
   * @returns The display text
   */
  getRowColumnDisplayText(column: any): string {
    const selectedValue = column.selectedValue;
    if (!selectedValue) {
      return 'Select ' + (column.label || column.name);
    }
    if (column.options) {
      const option = column.options.find((opt: any) =>
        (opt.id || opt.code) === selectedValue
      );
      return option?.displayText || option?.name || selectedValue;
    }
    return selectedValue;
  }

  /**
   * Load lookup options for row column
   * @param column The column to load options for
   */
  loadRowColumnLookupOptions(column: any): void {
    this.api.getLokupTableByCode(column.linkedComponent).subscribe({
      next: (res: any) => {
        column.options = res.data || [];
        column.optionsLoaded = true;
      },
      error: (err) => {
        console.error('Error loading row column lookup options:', err);
        column.options = [];
        column.optionsLoaded = true;
      }
    });
  }
  loadRowColumnLookupOptionsWithFormType(column: any): void {
    this.api.getLokupTableByCodeWithFormType(column.linkedComponent).subscribe({
      next: (res: any) => {
        column.options = res.data || [];
        column.optionsLoaded = true;
      },
      error: (err) => {
        console.error('Error loading row column lookup options:', err);
        column.options = [];
        column.optionsLoaded = true;
      }
    });
  }

  /**
   * Close all dropdowns
   */
  closeAllDropdowns(): void {
    this.dynamicFields.forEach(f => f.isDropdownOpen = false);
    this.rowTableFields.forEach(field => {
      if (field.rowColumns) {
        field.rowColumns.forEach((col: any) => col.isDropdownOpen = false);
      }
    });
  }
getRowTableFieldsDataMutlipleTbas(): { [key: string]: any[] } {
  return JSON.parse(JSON.stringify(this.rowTableData));
}

  /**
   * Get all row table fields data in required format for saving
   * @returns The formatted row table data
   */
  getRowTableFieldsData(): { [key: string]: any[] } {
    const rows: { [key: string]: any[] } = {};

    this.rowTableFields.forEach((field: DynamicFieldDto) => {
      const rowArray: any[] = [];

      if (field.rowColumns && field.rowColumns.length > 0) {
        const rowObject: { [key: string]: any } = {};

        field.rowColumns.forEach((column: any) => {
          if (column.fieldCode) {
            rowObject[column.fieldCode] = column.selectedValue || null;
          }
        });

        rowArray.push(rowObject);
      }

      rows[field.fieldCode] = rowArray;
    });

    return rows;
  }

  /**
   * Reset all dynamic fields data
   */
  resetDynamicFields(): void {
    this.dynamicFields = [];
    this.dynamicFieldsData = {};
    this.rowTableFields = [];
    this.rowTableData = {};
  }

  /**
   * Get complete form data including dynamic fields and row table data
   * @param staticFormData The static form data from the component
   * @returns Complete form data ready for submission
   */
  getCompleteFormData(staticFormData: any): any {
    return {
      data: {
        ...staticFormData,
        ...this.dynamicFieldsData,
      },
      rows: this.getRowTableFieldsData()
    };
  }
    getCompleteFormDataMultiple(staticFormData: any): any {
    return {
      data: {
        ...staticFormData,
        ...this.dynamicFieldsData,
      },
      rows: this.getRowTableFieldsDataMutlipleTbas()
    };
  }
  /**
   * Add current field values to saved table and clear form
   */
  addRowFromCurrentFields(field: any): boolean {
    if (!this.rowTableData[field.fieldCode]) {
      this.rowTableData[field.fieldCode] = [];
    }

    const newRow: any = {};
    let hasValue = false;

    // Copy current field values to new row object
    field.rowColumns.forEach((column: any) => {
      newRow[column.fieldCode] = column.selectedValue || null;
      if (column.selectedValue !== null && column.selectedValue !== undefined && column.selectedValue !== '') {
        hasValue = true;
      }
    });

    // Only add if at least one field has value
    if (hasValue) {
      this.rowTableData[field.fieldCode].push(newRow);
      this.clearCurrentRowFields(field);
      return true;
    }
    return false;
  }

  /**
   * Clear current row fields after adding to table
   */
  clearCurrentRowFields(field: any): void {
    field.rowColumns.forEach((column: any) => {
      column.selectedValue = null;
    });
  }

  /**
   * Add empty row (for backward compatibility)
   */
  addRow(field: any) {

    if (!this.rowTableData[field.fieldCode]) {
      this.rowTableData[field.fieldCode] = [];
    }

    const newRow: any = {};

    field.rowColumns.forEach((column: any) => {
      newRow[column.fieldCode] = null;
    });

    this.rowTableData[field.fieldCode].push(newRow);
  }
  removeRow(fieldCode: string, index: number) {
    this.rowTableData[fieldCode].splice(index, 1);
  }
  /**
   * Initialize row table for a field (don't auto-add row)
   */
  initializeRowTable(field: any) {
    if (!this.rowTableData[field.fieldCode]) {
      this.rowTableData[field.fieldCode] = [];
    }
  }

  /**
   * Get saved rows for a specific field
   */
  getSavedRows(fieldCode: string): any[] {
    return this.rowTableData[fieldCode] || [];
  }

  /**
   * Populate table from backend data
   */
  populateRowTableFromBackend(fieldCode: string, data: any[]): void {
    if (!this.rowTableData[fieldCode]) {
      this.rowTableData[fieldCode] = [];
    }
    this.rowTableData[fieldCode] = data || [];
  }

}
