import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TypeSujet } from '../models/sujet-examen.model';

@Injectable({
  providedIn: 'root'
})
export class TypeSujetService {
  private apiUrl = `${environment.apiUrl}/types-sujets`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<TypeSujet[]> {
    return this.http.get<TypeSujet[]>(this.apiUrl);
  }

  getById(id: number): Observable<TypeSujet> {
    return this.http.get<TypeSujet>(`${this.apiUrl}/${id}`);
  }
} 