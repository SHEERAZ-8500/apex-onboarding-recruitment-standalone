import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) { }

  // Dashboard APIs can be added here in future
  getDashboardStats() {
    return this.http.get('dashboard/stats');
  }
}
