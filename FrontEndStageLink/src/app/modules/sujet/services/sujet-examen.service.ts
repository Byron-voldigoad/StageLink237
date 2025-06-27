import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { SujetExamen } from '../models/sujet-examen.model';

@Injectable({
  providedIn: 'root'
})
export class SujetExamenService {
  private apiUrl = `${environment.apiUrl}/sujets-examen`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<SujetExamen[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => Array.isArray(response) ? response : response.data)
    );
  }

  getById(id: number): Observable<SujetExamen> {
    return this.http.get<SujetExamen>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<SujetExamen> | FormData): Observable<SujetExamen> {
    return this.http.post<SujetExamen>(this.apiUrl, data);
  }

  update(id: number, data: Partial<SujetExamen> | FormData): Observable<SujetExamen> {
    return this.http.put<SujetExamen>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadFile(file: File): Observable<{ path: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ path: string }>(`${this.apiUrl}/upload`, formData);
  }
} 