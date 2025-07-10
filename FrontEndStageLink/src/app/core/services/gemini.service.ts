import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export interface OffreStageAnalysis {
  competences: string[];
  niveau_difficulte: 'debutant' | 'intermediaire' | 'avance';
  mots_cles: string[];
  suggestions_amelioration: string[];
  score_pertinence: number;
}

export interface CandidatureAnalysis {
  score_competences: number;
  competences_manquantes: string[];
  suggestions_cv: string[];
  score_global: number;
  recommandations: string[];
}

export interface CVAnalysis {
  score_pertinence: number; // Score de 0 à 100
  competences_detectees: string[];
  experience_pertinente: string[];
  points_forts: string[];
  points_faibles: string[];
  recommandations: string[];
  niveau_adequation: 'excellent' | 'bon' | 'moyen' | 'faible';
  temps_formation_estime: string;
}

export interface TutoratRecommendation {
  matieres_suggerees: string[];
  niveau_recommande: string;
  methode_pedagogique: string;
  ressources_utiles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private readonly GEMINI_PROXY_URL = '/api/ai/analyze-offre';

  constructor(private http: HttpClient) {}

  /**
   * Analyse une offre de stage pour extraire les compétences et suggestions
   */
  analyzeOffreStage(offre: any): Observable<OffreStageAnalysis> {
    return this.callGeminiAPI(offre.id_offre_stage).pipe(
      map(response => this.parseOffreAnalysis(response))
    );
  }

  /**
   * Analyse une candidature pour évaluer la pertinence
   */
  analyzeCandidature(candidature: any, offre: any): Observable<CandidatureAnalysis> {
    return this.callGeminiAPI(offre.id_offre_stage).pipe(
      map(response => this.parseCandidatureAnalysis(response))
    );
  }

  /**
   * Génère des recommandations de tutorat personnalisées
   */
  generateTutoratRecommendations(etudiant: any, matieres: string[], offre: any): Observable<TutoratRecommendation> {
    return this.callGeminiAPI(offre.id_offre_stage).pipe(
      map(response => this.parseTutoratRecommendation(response))
    );
  }

  /**
   * Génère des suggestions de sujets d'examen
   */
  generateSujetSuggestions(matiere: string, niveau: string, offre: any): Observable<string[]> {
    return this.callGeminiAPI(offre.id_offre_stage).pipe(
      map(response => this.parseStringArray(response))
    );
  }

  /**
   * Analyse et améliore une description d'offre
   */
  improveOffreDescription(offre: any): Observable<string> {
    return this.callGeminiAPI(offre.id_offre_stage).pipe(
      map(response => this.extractText(response))
    );
  }

  /**
   * Génère des mots-clés pour une recherche intelligente
   */
  generateSearchKeywords(offre: any): Observable<string[]> {
    return this.callGeminiAPI(offre.id_offre_stage).pipe(
      map(response => this.parseStringArray(response))
    );
  }

  /**
   * Génère une lettre de motivation IA pour une offre donnée
   */
  generateMotivation(offreId: number): Observable<{ motivation: string }> {
    const token = localStorage.getItem('token');
    const headersConfig: any = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }
    const headers = new HttpHeaders(headersConfig);
    return this.http.post<{ motivation: string }>(
      '/api/ai/generate-motivation',
      { offre_id: offreId },
      { headers }
    );
  }

  /**
   * Analyse un CV pour évaluer sa pertinence par rapport à une offre
   */
  analyzeCV(cvPath: string, offre: any): Observable<CVAnalysis> {
    const token = localStorage.getItem('token');
    const headersConfig: any = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }
    const headers = new HttpHeaders(headersConfig);
    
    const payload = {
      cv_path: cvPath,
      offre_id: offre.id_offre_stage,
      titre_offre: offre.titre,
      description_offre: offre.description,
      competences_requises: offre.competences_requises,
      exigences: offre.exigences
    };

    return this.http.post<any>(
      '/api/ai/analyze-cv',
      payload,
      { headers }
    ).pipe(
      map(response => this.parseCVAnalysis(response)),
      catchError(error => {
        console.error('Erreur analyse CV:', error);
        return of(this.getDefaultCVAnalysis());
      })
    );
  }

  /**
   * Analyse tous les CV d'une offre et les classe par pertinence
   */
  analyzeAndRankCandidatures(candidatures: any[], offre: any): Observable<any[]> {
    const analyses = candidatures.map(candidature => 
      this.analyzeCV(candidature.cv_path || '', offre).pipe(
        map(analysis => ({
          ...candidature,
          analysis: analysis,
          score: analysis.score_pertinence
        }))
      )
    );

    return forkJoin(analyses).pipe(
      map(results => results.sort((a, b) => b.score - a.score))
    );
  }

  /**
   * Appel au backend Laravel qui fait le proxy Gemini
   */
  private callGeminiAPI(offreId: number): Observable<string> {
    const body = { offre_id: offreId };
    const token = localStorage.getItem('token'); // Récupère le token stocké après login
    const headersConfig: any = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }
    const headers = new HttpHeaders(headersConfig);
    return this.http.post<any>(
      this.GEMINI_PROXY_URL,
      body,
      { headers }
    ).pipe(
      map(response => {
        // On récupère le vrai texte JSON
        let text = response.analysis?.text || '';
        // On nettoie les balises ```json et ```
        text = text.replace(/```json|```/g, '').trim();
        return text;
      }),
      catchError(error => {
        console.error('Erreur API Gemini:', error);
        return of('');
      })
    );
  }

  // Méthodes de parsing des réponses
  private parseOffreAnalysis(response: string): OffreStageAnalysis {
    try {
      return JSON.parse(response);
    } catch {
      return {
        competences: [],
        niveau_difficulte: 'intermediaire',
        mots_cles: [],
        suggestions_amelioration: [],
        score_pertinence: 50
      };
    }
  }

  private parseCandidatureAnalysis(response: string): CandidatureAnalysis {
    try {
      return JSON.parse(response);
    } catch {
      return {
        score_competences: 50,
        competences_manquantes: [],
        suggestions_cv: [],
        score_global: 50,
        recommandations: []
      };
    }
  }

  private parseTutoratRecommendation(response: string): TutoratRecommendation {
    try {
      return JSON.parse(response);
    } catch {
      return {
        matieres_suggerees: [],
        niveau_recommande: 'intermediaire',
        methode_pedagogique: 'Mixte',
        ressources_utiles: []
      };
    }
  }

  private parseStringArray(response: string): string[] {
    try {
      return JSON.parse(response);
    } catch {
      return [];
    }
  }

  private extractText(response: string): string {
    return response.trim();
  }

  private parseCVAnalysis(response: string): CVAnalysis {
    try {
      return JSON.parse(response);
    } catch {
      return this.getDefaultCVAnalysis();
    }
  }

  private getDefaultCVAnalysis(): CVAnalysis {
    return {
      score_pertinence: 50,
      competences_detectees: [],
      experience_pertinente: [],
      points_forts: [],
      points_faibles: [],
      recommandations: [],
      niveau_adequation: 'moyen',
      temps_formation_estime: 'Inconnu'
    };
  }
} 