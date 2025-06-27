import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entreprise } from '../models/entreprise.model';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {
  private apiUrl = 'http://localhost:8000/api/entreprises'; // URL du backend Laravel

  constructor(private http: HttpClient) { }

  getAllEntreprises(): Observable<Entreprise[]> {
    return this.http.get<Entreprise[]>(this.apiUrl);
  }

  getEntreprise(id: number): Observable<Entreprise> {
    return this.http.get<Entreprise>(`${this.apiUrl}/${id}`);
  }

  createEntreprise(entreprise: Entreprise): Observable<Entreprise> {
    return this.http.post<Entreprise>(this.apiUrl, entreprise);
  }

  updateEntreprise(id: number, entreprise: Entreprise): Observable<Entreprise> {
    return this.http.put<Entreprise>(`${this.apiUrl}/${id}`, entreprise);
  }

  deleteEntreprise(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 