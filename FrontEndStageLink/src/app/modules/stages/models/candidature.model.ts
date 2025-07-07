import { OffreStage } from './offre-stage.model';
import { ProfilEtudiant } from './profil-etudiant.model';

export interface Candidature {
  id: number;
  offre_stage_id: number;
  etudiant_id: number;
  cv_path?: string;
  lettre_motivation_path?: string;
  message_motivation?: string;
  message_reponse?: string;
  statut: 'en_attente' | 'acceptee' | 'refusee' | 'annulee';
  date_creation: string;
  date_modification?: string;
  
  // Relations
  offreStage?: OffreStage;
  etudiant?: ProfilEtudiant;
}

export interface CandidatureFormData {
  offre_stage_id: number;
  etudiant_id: number;
  cv_path?: File;
  lettre_motivation_path?: File;
  message_motivation?: string;
} 