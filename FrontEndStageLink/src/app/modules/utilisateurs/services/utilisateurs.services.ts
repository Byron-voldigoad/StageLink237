import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";  
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { Utilisateur, Role } from "../modeles/utilisateurs.model";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UtilisateursService {
  private apiUrl = `${environment.apiUrl}/utilisateurs`;

  constructor(private http: HttpClient) { }

  getAllUtilisateurs(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.apiUrl).pipe(
      retry(3), // Réessayer 3 fois en cas d'erreur
      catchError(this.handleError)
    );
  }

  getUtilisateurById(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createUtilisateur(utilisateur: Partial<Utilisateur>): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.apiUrl, utilisateur).pipe(
      catchError(this.handleError)
    );
  }

  updateUtilisateur(id: number, utilisateur: Partial<Utilisateur> | FormData): Observable<Utilisateur> {
    if (utilisateur instanceof FormData) {
      // Pour les requêtes avec fichiers, on utilise POST avec _method=PUT
      // car Laravel a des problèmes avec les fichiers en PUT
      utilisateur.append('_method', 'PUT');
      return this.http.post<Utilisateur>(`${this.apiUrl}/${id}`, utilisateur, {
        headers: {
          // Ne pas définir Content-Type, le navigateur le fera automatiquement
          // avec la bonne boundary pour FormData
        }
      }).pipe(
        catchError(this.handleError)
      );
    } else {
      // Pour les requêtes sans fichier, on garde PUT normal
      return this.http.put<Utilisateur>(`${this.apiUrl}/${id}`, utilisateur).pipe(
        catchError(this.handleError)
      );
    }
  }

  deleteUtilisateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${environment.apiUrl}/roles`).pipe(
      catchError(this.handleError)
    );
  }

  addRoleToUser(userId: number, roleId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/roles`, { role_id: roleId }).pipe(
      catchError(this.handleError)
    );
  }

  removeRoleFromUser(userId: number, roleId: number): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}/${userId}/roles`, { body: { role_id: roleId } }).pipe(
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