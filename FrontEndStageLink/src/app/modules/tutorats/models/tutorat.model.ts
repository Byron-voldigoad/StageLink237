export interface Tutorat {
  id_tutorat: number;
  titre: string;
  description: string;
  domaine: string;
  niveau: string;
  langues?: Langue[];
  matieres?: Matiere[];
  date_debut: string;
  date_fin: string;
  tuteur_id: number;
  localisation?: string;
  statut: 'ouverte' | 'pourvue' | 'cloturee';
  tarif_horaire?: number;
  duree_seance?: number; // en minutes
  nombre_seances?: number;
  prerequis?: string;
  objectifs?: string;
  methode_pedagogique?: string;
  created_at: string;
  updated_at: string;
  tuteur?: ProfilTuteur;
  candidatures?: CandidatureTutorat[];
  seances?: SeanceTutorat[];
}

export interface ProfilTuteur {
  id_tuteur: number;
  id_utilisateur: number;
  prenom: string;
  nom: string;
  telephone?: string;
  adresse?: string;
  qualifications?: string;
  certifications?: string;
  annees_experience?: number;
  tarif_horaire?: number;
  photo_profil?: string;
  disponible: boolean;
  note: number;
  utilisateur?: Utilisateur;
  matieres?: Matiere[];
  langues?: Langue[];
  niveaux?: Niveau[];
}

export interface Matiere {
  id_matiere: number;
  nom: string;
  description?: string;
}

export interface Langue {
  id_langue: number;
  nom: string;
  code?: string;
}

export interface Niveau {
  id_niveau: number;
  nom: string;
  description?: string;
}

export interface Utilisateur {
  id_utilisateur: number;
  email: string;
  email_verified_at?: string;
}

export interface CandidatureTutorat {
  id_candidature: number;
  tutorat_id: number;
  etudiant_id: number;
  statut: 'en_attente' | 'acceptee' | 'refusee' | 'annulee';
  message_motivation?: string;
  cv_path?: string;
  lettre_motivation_path?: string;
  date_candidature: string;
  etudiant?: ProfilEtudiant;
}

export interface ProfilEtudiant {
  id_etudiant: number;
  id_utilisateur: number;
  prenom: string;
  nom: string;
  telephone?: string;
  adresse?: string;
  ecole?: string;
  niveau?: string;
  domaine_etude?: string;
  cv_path?: string;
  photo_profil?: string;
  credits: number;
  utilisateur?: Utilisateur;
}

export interface SeanceTutorat {
  id_seance: number;
  tutorat_id: number;
  date_seance: string;
  heure_debut: string;
  heure_fin: string;
  lieu?: string;
  mode: 'presentiel' | 'en_ligne' | 'hybride';
  lien_visio?: string;
  statut: 'planifiee' | 'en_cours' | 'terminee' | 'annulee';
  notes_tuteur?: string;
  notes_etudiant?: string;
  materiel_requis?: string;
}

export interface TutoratFilters {
  domaine?: string;
  niveau?: string;
  statut?: string;
  tuteur_id?: number;
  search?: string;
  page?: number;
}

export interface TutoratStats {
  total: number;
  ouverts: number;
  pourvus: number;
  clotures: number;
  candidatures_total: number;
  candidatures_en_attente: number;
}
