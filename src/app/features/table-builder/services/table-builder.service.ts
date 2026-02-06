import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableBuilderService {
  constructor(private http: HttpClient) { }

  // Lookup Tables APIs
  createLookUpTable(data: any) {
    return this.http.post('admin/lookups/tables', data);
  }

  getAllLookUpTables() {
    return this.http.get(`admin/lookups/tables`);
  }

  getLokupTableByCode(code: any) {
    return this.http.get(`admin/lookups/tables/${code}/values`);
  }

  createRowInLookUpTable(componentCode: any, data: any) {
    return this.http.post(`admin/lookups/tables/${componentCode}/values`, data);
  }

  createNewColumnInLookupTable(lookupName: string, data: any) {
    return this.http.patch(`admin/lookups/tables/${lookupName}/columns`, data);
  }

  getAllLookupValuesInTable(lookupName: string, page = 0, size = 50) {
    return this.http.get(`admin/lookups/tables/${lookupName}/values?page=${page}&size=${size}`);
  }

  editLookupTableRow(lookupName: string, publicId: string, data: any) {
    return this.http.patch(`admin/lookups/tables/${lookupName}/values/${publicId}`, data);
  }

  // Helper method to transform values
  transformValues(data: any) {
    return data; // Placeholder for any transformation logic
  }

  // Lookup Enums APIs
  createLookupEnum(data: any) {
    return this.http.post('admin/lookups/enums', data);
  }

  getAllLookupEnums() {
    return this.http.get(`admin/lookups/enums`);
  }

  getLookupEnumByCode(code: any) {
    return this.http.get(`admin/lookups/enums/${code}`);
  }

  addNewEnum(enumComponentCode: string, data: any) {
    return this.http.patch(`admin/lookups/enums/${enumComponentCode}/values`, data);
  }

  getAllEnumValuesInTable(enumComponentCode: string, page = 0, size = 50) {
    return this.http.get(`admin/lookups/enums/${enumComponentCode}?page=${page}&size=${size}`);
  }

  // Independent Tables (Row Tables) APIs
  createIndependentTable(data: any) {
    return this.http.post('admin/row-tables', data);
  }

  getAllIndependentTables() {
    return this.http.get(`admin/row-tables?filter=ALL`);
  }

  createRowInTable(data: any) {
    return this.http.post(`api/admin/row-tables`, data);
  }

  createNewColumnInIndependentTable(rowComponentCode: string, data: any) {
    return this.http.patch(`admin/row-tables/${rowComponentCode}/columns`, data);
  }

  getAllTabsValuesInTable(rowComponentCode: string, page = 0, size = 50) {
    return this.http.get(`admin/row-tables/${rowComponentCode}?filter=ACTIVE&page=${page}&size=${size}`);
  }

  // Tables (General)
  getAllTables(companyId: any) {
    return this.http.get(`v1/md/tables`);
  }

  createTable(tableSchema: any) {
    return this.http.post(`v1/md/tables`, tableSchema);
  }
}
