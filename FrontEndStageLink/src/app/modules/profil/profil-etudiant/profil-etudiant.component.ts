import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
  profilEtudiant?: ProfilEtudiant;
}

interface ProfilEtudiant {
  id_etudiant?: number;
  utilisateur_id?: number;
  niveau_etude?: string;
  etablissement?: string;
  specialite?: string;
  objectifs?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  pays?: string;
  cv_path?: string;
  photo_profil?: string;
  credits?: number;
  created_at?: string;
  updated_at?: string;
}

@Component({
  selector: 'app-profil-etudiant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil-etudiant.component.html',
  styleUrls: ['./profil-etudiant.component.css']
})
export class ProfilEtudiantComponent implements OnInit, OnChanges {
  @Input() user: User | null = null;
  @Output() edit = new EventEmitter<void>();
  urltof = 'http://localhost:8000/storage/';
  
  // Données spécifiques à l'étudiant avec des valeurs par défaut
  profilEtudiant: ProfilEtudiant = {
    niveau_etude: '',
    etablissement: '',
    specialite: '',
    objectifs: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: '',
    credits: 0,
    cv_path: ''
  };
  
  constructor() { }
  
  ngOnInit(): void {
    this.updateProfilEtudiant();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && !changes['user'].firstChange) {
      this.updateProfilEtudiant();
    }
  }
  
  // Met à jour les données du profil étudiant à partir des données de l'utilisateur
  private updateProfilEtudiant(): void {
    if (this.user?.profilEtudiant) {
      this.profilEtudiant = {
        ...this.profilEtudiant, // Valeurs par défaut
        ...this.user.profilEtudiant // Surcharge avec les données du serveur
      };
      
      // Si l'utilisateur a une photo de profil spécifique au profil étudiant, l'utiliser
      if (this.profilEtudiant.photo_profil) {
        this.user.photo = this.profilEtudiant.photo_profil;
      }
    }
  }

}
