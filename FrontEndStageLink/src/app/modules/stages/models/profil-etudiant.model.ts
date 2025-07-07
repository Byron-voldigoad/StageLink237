export interface ProfilEtudiant {
  id_etudiant: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  date_naissance?: string;
  niveau_etude?: string;
  specialisation?: string;
  universite?: string;
  cv_path?: string;
  photo_path?: string;
  date_creation: string;
  date_modification?: string;
} 