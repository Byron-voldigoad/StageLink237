import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register-entreprise',
  standalone: true,
  templateUrl: './register-entreprise.component.html',
  styleUrls: ['./register-entreprise.component.css'],
  imports: [CommonModule, FormsModule]
})
export class RegisterEntrepriseComponent {
  nomEntreprise = '';
  email = '';
  password = '';
  password_confirmation = '';
  secteur = '';
  siret = '';
  error = '';
  success = '';
  loading = false;
  secteurs: any[] = [];

  constructor(private http: HttpClient) {
    this.loadSecteurs();
  }

  loadSecteurs() {
    this.http.get<any[]>(`${environment.apiUrl}/secteurs`).subscribe({
      next: (data) => this.secteurs = data,
      error: () => this.secteurs = []
    });
  }

  onSubmit() {
    if (!this.nomEntreprise || !this.email || !this.password || !this.password_confirmation || !this.secteur || !this.siret) {
      if (!this.secteur) {
        this.error = 'Veuillez sélectionner un secteur d\'activité.';
      } else {
        this.error = 'Tous les champs sont obligatoires.';
      }
      return;
    }
    if (this.password !== this.password_confirmation) {
      this.error = 'Les mots de passe ne correspondent pas.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.success = '';

    const data = {
      nom: this.nomEntreprise,
      email: this.email,
      mot_de_passe: this.password,
      secteur: this.secteur,
      siret: this.siret
    };
    this.http.post(`${environment.apiUrl}/entreprises`, data).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Inscription entreprise réussie ! Vous pouvez maintenant vous connecter.';
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erreur lors de l\'inscription.';
      }
    });
  }
} 