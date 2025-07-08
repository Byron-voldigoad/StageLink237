import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Tutorat, 
  CandidatureTutorat, 
  TutoratFilters, 
  TutoratStats,
  SeanceTutorat,
  Matiere,
  Niveau,
  Langue
} from '../models/tutorat.model';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';

// Ajout du type de réponse paginée
export interface TutoratPaginatedResponse {
  data: Tutorat[];
  current_page: number;
  last_page: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class TutoratService {
  private apiUrl = `${environment.apiUrl}/tutorats`;

  constructor(private http: HttpClient) {}

  // Récupérer la liste des matières
  getMatieres(): Observable<Matiere[]> {
    return this.http.get<any>(`${environment.apiUrl}/matieres`).pipe(
      map(res => Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : []))
    );
  }

  // Récupérer la liste des niveaux
  getNiveaux(): Observable<Niveau[]> {
    return this.http.get<any>(`${environment.apiUrl}/niveaux`).pipe(
      map(res => Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : []))
    );
  }

  // Récupérer la liste des langues
  getLangues(): Observable<Langue[]> {
    return this.http.get<Langue[]>(`${environment.apiUrl}/langues`);
  }

  // Récupérer les matières, niveaux et langues en parallèle
  getMatieresNiveauxLangues(): Observable<[Matiere[], Niveau[], Langue[]]> {
    return new Observable(observer => {
      const matieres = this.getMatieres().subscribe({
        next: (matieres) => {
          const niveaux = this.getNiveaux().subscribe({
            next: (niveaux) => {
              const langues = this.getLangues().subscribe({
                next: (langues) => {
                  observer.next([matieres, niveaux, langues]);
                  observer.complete();
                },
                error: (error) => {
                  observer.error(error);
                }
              });
            },
            error: (error) => {
              observer.error(error);
            }
          });
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  // Récupérer tous les tutorats avec filtres
  getAll(filters?: TutoratFilters): Observable<TutoratPaginatedResponse> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof TutoratFilters];
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<TutoratPaginatedResponse>(this.apiUrl, { params });
  }

  // Récupérer un tutorat par ID
  getById(id: number): Observable<Tutorat> {
    return this.http.get<Tutorat>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouveau tutorat
  create(tutorat: Partial<Tutorat>): Observable<Tutorat> {
    return this.http.post<Tutorat>(this.apiUrl, tutorat);
  }

  // Mettre à jour un tutorat
  update(id: number, tutorat: Partial<Tutorat>): Observable<Tutorat> {
    return this.http.put<Tutorat>(`${this.apiUrl}/${id}`, tutorat);
  }

  // Supprimer un tutorat
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Postuler à un tutorat
  postuler(tutoratId: number, candidature: {
    etudiant_id: number;
    message_motivation?: string;
    cv?: File;
    lettre_motivation?: File;
  }): Observable<CandidatureTutorat> {
    const formData = new FormData();
    formData.append('etudiant_id', candidature.etudiant_id.toString());
    formData.append('message_motivation', candidature.message_motivation ?? '');
    
    if (candidature.cv) {
      formData.append('cv', candidature.cv);
    }
    if (candidature.lettre_motivation) {
      formData.append('lettre_motivation', candidature.lettre_motivation);
    }

    return this.http.post<CandidatureTutorat>(`${this.apiUrl}/${tutoratId}/postuler`, formData);
  }

  // Gérer une candidature (accepter/refuser)
  gererCandidature(tutoratId: number, candidatureId: number, statut: 'acceptee' | 'refusee'): Observable<CandidatureTutorat> {
    return this.http.put<CandidatureTutorat>(`${this.apiUrl}/${tutoratId}/candidatures/${candidatureId}`, { statut });
  }

  // Obtenir les statistiques
  getStatistiques(): Observable<TutoratStats> {
    return this.http.get<TutoratStats>(`${this.apiUrl}/statistiques`);
  }

  // Créer une séance de tutorat
  createSeance(tutoratId: number, seance: Partial<SeanceTutorat>): Observable<SeanceTutorat> {
    return this.http.post<SeanceTutorat>(`${this.apiUrl}/${tutoratId}/seances`, seance);
  }

  // Mettre à jour une séance
  updateSeance(tutoratId: number, seanceId: number, seance: Partial<SeanceTutorat>): Observable<SeanceTutorat> {
    return this.http.put<SeanceTutorat>(`${this.apiUrl}/${tutoratId}/seances/${seanceId}`, seance);
  }

  // Supprimer une séance
  deleteSeance(tutoratId: number, seanceId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tutoratId}/seances/${seanceId}`);
  }

  // Récupérer les candidatures de tutorat d'un étudiant
  getCandidaturesByEtudiant(etudiantId: number) {
    return this.http.get<any[]>(`${environment.apiUrl}/candidatures-tutorat/etudiant/${etudiantId}`);
  }
}
