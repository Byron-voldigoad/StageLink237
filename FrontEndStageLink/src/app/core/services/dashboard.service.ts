import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  getEntreprisesByQuartier(): Observable<any> {
    return this.http.get(`${this.apiUrl}/entreprises-by-quartier`);
  }

  getRecentEntreprises(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recent-entreprises`);
  }
} 