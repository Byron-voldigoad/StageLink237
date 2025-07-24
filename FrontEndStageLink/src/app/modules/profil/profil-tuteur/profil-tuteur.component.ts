import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id_utilisateur?: number;
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  photo?: string;
  roles?: any[];
  profilTuteur?: ProfilTuteur;
}

interface ProfilTuteur {
  specialites?: string;
  experience_annees?: number;
  tarif_horaire?: number;
  bio?: string;
  diplomes?: string;
  methodes_pedagogiques?: string;
  qualifications?: string;
  certifications?: string;
  photo_profil?: string;
  disponible?: boolean;
  note?: number;
  ville?: string; // Ajouté
  code_postal?: string; // Ajouté
}

@Component({
  selector: 'app-profil-tuteur',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil-tuteur.component.html',
  styleUrls: ['./profil-tuteur.component.css']
})
export class ProfilTuteurComponent implements OnInit {
  @Input() user: User | null = null;
  @Output() edit = new EventEmitter<void>();
  
  // Données spécifiques au tuteur avec des valeurs par défaut
  profilTuteur: ProfilTuteur = {
    specialites: '',
    experience_annees: 0,
    tarif_horaire: 0,
    bio: '',
    diplomes: '',
    methodes_pedagogiques: '',
    qualifications: '',
    certifications: '',
    note: 0, // Initialisation de la note à 0
    disponible: false
  };
  
  constructor() { }
  
  ngOnInit(): void {
    this.loadProfilTuteur();
  }
  
  // Méthode pour charger les données spécifiques au tuteur
  private loadProfilTuteur() {
    // Les données sont chargées par le composant parent
    // et passées via l'input user
    if (this.user?.profilTuteur) {
      this.profilTuteur = {
        ...this.profilTuteur, // Valeurs par défaut
        ...this.user.profilTuteur // Surcharge avec les données du serveur
      };
    }
  }
}
