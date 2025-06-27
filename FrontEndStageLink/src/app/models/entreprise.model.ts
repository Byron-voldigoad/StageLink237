export interface Entreprise {
  id_entreprise: number;
  nom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  telephone: string;
  email: string;
  siteWeb?: string;
  description?: string;
  secteurActivite: string;
  taille: string;
  dateCreation: Date;
  logo?: string;
} 