import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { OffreStage } from '../models/offre-stage.model';
import { Entreprise } from '../models/entreprise.model';
import { Secteur } from '../models/secteur.model';
import { PaginatedResponse } from '../../../core/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class OffreStageService {
  private apiUrl = `${environment.apiUrl}/offres-stage`;

  constructor(private http: HttpClient) { }

  getAllOffres(page: number = 1): Observable<PaginatedResponse<OffreStage>> {
    return this.http.get<PaginatedResponse<OffreStage>>(`${this.apiUrl}?page=${page}`);
  }

  getAllOffresByUrl(url: string): Observable<PaginatedResponse<OffreStage>> {
    return this.http.get<PaginatedResponse<OffreStage>>(url);
  }

  getOffreById(id: number): Observable<OffreStage> {
    return this.http.get<OffreStage>(`${this.apiUrl}/${id}`);
  }

  createOffre(offre: Partial<OffreStage>): Observable<OffreStage> {
    return this.http.post<OffreStage>(this.apiUrl, offre);
  }

  updateOffre(id: number, offre: Partial<OffreStage>): Observable<OffreStage> {
    return this.http.put<OffreStage>(`${this.apiUrl}/${id}`, offre);
  }

  deleteOffre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getSecteurs(): Observable<Secteur[]> {
    return this.http.get<Secteur[]>(`${environment.apiUrl}/secteurs`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Code d'erreur ${error.status}, message: ${error.error.message || error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 