export interface Tutorat {
  id: string;
  titre: string;
  description: string;
  domaine: string;
  niveau: string;
  dateDebut: Date;
  dateFin: Date;
  tuteur: string; // nom ou id du tuteur
  localisation?: string;
  statut?: 'ouverte' | 'pourvue' | 'cloturee';
  // Ajoute d'autres champs pertinents si besoin
}
