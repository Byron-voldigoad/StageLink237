export interface Entreprise {
  id_entreprise: number;
  nom: string;
  logo_path?: string;
  adresse?: string;
  description?: string;
  secteur?: string;
  telephone?: string;
  site_web?: string;
  nif?: string;
  verifie?: boolean;
} 