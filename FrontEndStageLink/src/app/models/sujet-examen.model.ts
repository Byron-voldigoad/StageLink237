export interface SujetExamen {
  id?: number;
  titre: string;
  matiere_id: number;
  niveau_id: number;
  annee_id: number;
  fichier_path: string;
  est_gratuit: boolean;
  prix?: number;
  upload_par: number;
  approuve: boolean;
  telechargements: number;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  matiere?: any;
  niveau?: any;
  annee?: any;
  uploader?: any;
  corriges?: any[];
} 