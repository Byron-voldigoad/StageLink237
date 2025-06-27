import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8000/api/dashboard';

  constructor(private http: HttpClient) { }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getEntreprisesByQuartier(): Observable<any> {
    return this.http.get(`${this.apiUrl}/entreprises-by-quartier`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getRecentEntreprises(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recent-entreprises`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur ${error.status}, message: ${error.error.message || error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 