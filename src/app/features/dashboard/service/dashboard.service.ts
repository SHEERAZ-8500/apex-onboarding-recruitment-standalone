import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { DashboardResponse, ReportExportType } from '../service/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {

private readonly baseUrl = `${environment.apiBaseUrl}admin/reports`;
  constructor(private http: HttpClient) {}

  /**
   * Fetches the KPI dashboard summary. Backend caches this for 3 minutes,
   * so repeated calls within that window return the same generatedAt timestamp.
   */
  getDashboard(from?: string, to?: string): Observable<any> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);

    return this.http.get<any>(`${this.baseUrl}/dashboard`, { params });
  }

  /**
   * Downloads a CSV report and triggers a browser save-as.
   * The backend streams UTF-8 BOM bytes so Excel renders Urdu/Arabic names correctly;
   * we keep the blob as-is (no text re-encoding) so the BOM survives.
   */
  exportReport(type: ReportExportType, from?: string, to?: string): Observable<void> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);

    return this.http.get(`${this.baseUrl}/export/${type}`, {
      params,
      responseType: 'blob',
      observe: 'response',
    }).pipe(
      map(response => {
        const blob = response.body as Blob;
        const filename = this.extractFilename(response.headers.get('Content-Disposition'), type, from, to);
        this.triggerDownload(blob, filename);
      })
    );
  }

  private extractFilename(contentDisposition: string | null, type: string, from?: string, to?: string): string {
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match?.[1]) return match[1];
    }
    const range = from && to ? `${from}-${to}` : 'export';
    return `report-${type}-${range}.csv`;
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}