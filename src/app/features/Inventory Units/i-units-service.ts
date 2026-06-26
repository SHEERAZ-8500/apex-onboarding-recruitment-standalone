import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../.././environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  url: any;
  constructor(private http: HttpClient) {
    this.url = environment.apiBaseUrl;
  }
// inventory.service.ts

createUnit(data: any): Observable<any> {
  return this.http.post(this.url + 'admin/units', data);
}

getAllUnits(
  page: number,
  size: number,
  status?: 'AVAILABLE' | 'HELD' | 'BOOKED',
  propertyType?: 'APARTMENT' | 'OFFICE',
  floorNumber?: number,
  search?: string,
  active?: boolean,
): Observable<any> {
  let params: any = {
    page,
    size,
  };

  if (status) params.status = status;
  if (propertyType) params.propertyType = propertyType;
  if (floorNumber !== undefined && floorNumber !== null) {
    params.floorNumber = floorNumber;
  }
  if (search) params.search = search;
  if (active !== undefined && active !== null) params.active = active;

  return this.http.get(this.url + 'admin/units', { params });
}

getUnitById(publicId: string): Observable<any> {
  return this.http.get(this.url + `admin/units/${publicId}`);
}

updateUnit(publicId: string, data: any): Observable<any> {
  return this.http.patch(this.url + `admin/units/${publicId}`, data);
}

updateUnitStatus(
  publicId: string,
  status: 'AVAILABLE' | 'BOOKED',
): Observable<any> {
  return this.http.patch(
    this.url + `admin/units/${publicId}/status`,
    { status },
  );
}

toggleUnitActiveStatus(publicId: string, active: boolean): Observable<any> {
  return this.http.patch(
    this.url + `admin/units/${publicId}/active`,
    { active },
  );
}

deleteUnit(publicId: string): Observable<any> {
  return this.http.delete(this.url + `admin/units/${publicId}`);
}


// inventory.service.ts - Inmein naye methods add karein

// Unit ki media (photos/floor plans) upload karne ke liye
uploadUnitMedia(publicId: string, files: File[], kind: 'PHOTO' | 'FLOOR_PLAN'): Observable<any> {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  // Agar aapki API multiple files support karti hai to yeh kaam karega
  // Agar nahi karti to alag alag call karni paregi
  return this.http.post(this.url + `admin/units/${publicId}/media?kind=${kind}`, formData);
}

// Ek single file upload ke liye (agar API multiple nahi leti)
uploadSingleMedia(publicId: string, file: File, kind: 'PHOTO' | 'FLOOR_PLAN'): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);
  return this.http.post(this.url + `admin/units/${publicId}/media?kind=${kind}`, formData);
}

// Media delete karne ke liye
deleteUnitMedia(publicId: string, attachmentPublicId: string): Observable<any> {
  return this.http.delete(this.url + `admin/units/${publicId}/media/${attachmentPublicId}`);
}

// Unit detail mein photos aur floor plans ke saath (nayi API ke hisaab se)
getUnitDetail(publicId: string): Observable<any> {
  return this.http.get(this.url + `inventory/units/${publicId}`);
}

// Browse available inventory (nayi API)
browseInventory(
  page: number,
  size: number,
  propertyType?: 'APARTMENT' | 'OFFICE',
  floorNumber?: number,
  search?: string
): Observable<any> {
  let params: any = { page, size };
  if (propertyType) params.propertyType = propertyType;
  if (floorNumber !== undefined && floorNumber !== null) params.floorNumber = floorNumber;
  if (search) params.search = search;
  return this.http.get(this.url + 'inventory/units', { params });
}


getAdminUnitById(publicId: string): Observable<any> {
  return this.http.get(this.url + `admin/units/${publicId}`);
}
}