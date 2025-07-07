import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Candidature {
  id_candidature: number;
  offre_stage_id: number;
  etudiant_id: number;
  cv_path?: string;
  lettre_motivation_path?: string;
  message_motivation?: string;
  statut: 'en_attente' | 'acceptee' | 'refusee';
  date_candidature: string;
  date_reponse?: string;
  commentaire_entreprise?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
  private apiUrl = `${environment.apiUrl}/candidatures`;

  constructor(private http: HttpClient) {}

  postuler(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/postuler`, formData);
  }

  getCandidaturesByEtudiant(etudiantId: number): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.apiUrl}/etudiant/${etudiantId}`);
  }

  getCandidaturesByOffre(offreId: number): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.apiUrl}/offre/${offreId}`);
  }

  updateCandidature(id: number, data: Partial<Candidature>): Observable<Candidature> {
    return this.http.put<Candidature>(`${this.apiUrl}/${id}`, data);
  }

  deleteCandidature(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 