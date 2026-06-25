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


}