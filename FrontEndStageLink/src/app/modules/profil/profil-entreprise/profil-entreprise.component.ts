import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ReseauxSociaux {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

interface Entreprise {
  id_entreprise?: number;
  utilisateur_id?: number;
  nom_entreprise: string;
  siret: string;
  secteur_activite: string;
  effectif: string;
  annee_creation: string;
  site_web: string;
  description: string;
  logo: string | null;
  adresse: string;
  code_postal: string;
  ville: string;
  pays: string;
  telephone: string;
  email_contact: string;
  statut_juridique: string;
  tva_intracom: string;
  reseaux_sociaux?: ReseauxSociaux;
  created_at?: string;
  updated_at?: string;
}

interface User {
  id_utilisateur?: number;
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  photo?: string;
  roles?: any[];
  entreprise?: Entreprise;
}

@Component({
  selector: 'app-profil-entreprise',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil-entreprise.component.html',
  styleUrls: ['./profil-entreprise.component.css']
})
export class ProfilEntrepriseComponent implements OnInit {
  @Input() user: User | null = null;
  @Output() edit = new EventEmitter<void>();
  
  // Données spécifiques à l'entreprise avec valeurs par défaut
  entreprise: Entreprise = {
    nom_entreprise: '',
    siret: '',
    secteur_activite: '',
    effectif: '',
    annee_creation: '',
    site_web: '',
    description: '',
    logo: null,
    adresse: '',
    code_postal: '',
    ville: '',
    pays: '',
    telephone: '',
    email_contact: '',
    statut_juridique: '',
    tva_intracom: '',
    reseaux_sociaux: {}
  };
  
  constructor() { }
  
  ngOnInit(): void {
    this.loadEntrepriseData();
  }
  
  // Méthode pour charger les données de l'entreprise
  private loadEntrepriseData() {
    // Les données sont chargées par le composant parent
    // et passées via l'input user
    if (this.user?.entreprise) {
      this.entreprise = {
        ...this.entreprise, // Valeurs par défaut
        ...this.user.entreprise // Surcharge avec les données du serveur
      };
    }
  }

}
