import { Entreprise } from './entreprise.model';

export interface OffreStage {
  id_offre_stage: number;
  id_entreprise: number;
  entreprise?: Entreprise;
  titre: string;
  description: string;
  exigences?: string;
  duree?: string;
  date_debut?: Date;
  date_fin?: Date;
  localisation?: string;
  remuneration?: number; // Positif = payé, Négatif = à payer, 0 ou undefined = non rémunéré
  secteur?: string;
  competences_requises?: string;
  statut: 'ouvert' | 'ferme' | 'en_attente';
  date_creation: string;
  date_modification?: string;
} 