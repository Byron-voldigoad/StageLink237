export interface Role {
  id_role: number;
  nom_role: string;
  description_role?: string;
}

export interface Utilisateur {
    id_utilisateur: number;
    nom : string;
    prenom : string;
    email : string;
    mot_de_passe : string;
    date_naissance : Date;
    telephone : string;
    create_at : Date;
    update_at : Date;
    photo?: string; // Ajouté pour la photo brute
    photoUrl?: string; // Ajouté pour l'URL complète
    roles?: Role[]; // Ajouté pour la gestion des rôles
}