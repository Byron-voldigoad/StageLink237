export interface TypeSujet {
  id_type: number;
  nom: string;
  description?: string;
}

export interface SujetExamen {
  id_sujet?: number;
  titre: string;
  id_matiere: number;
  id_niveau: number;
  id_annee: number;
  id_type: number;
  fichier_path: string;
  est_gratuit: number;
  prix?: string;
  id_upload_par?: number;
  approuve: number;
  telechargements: number;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  matiere?: any;
  niveau?: any;
  annee?: any;
  type?: TypeSujet;
  uploader?: any;
  corriges?: any[];
  // Ajout pour Angular (mapping dynamique)
  matiereObj?: any;
  niveauObj?: any;
  anneeObj?: any;
  typeObj?: TypeSujet;
} 