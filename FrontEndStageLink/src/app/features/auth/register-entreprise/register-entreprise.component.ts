import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  onSubmit() {
    if (!this.nomEntreprise || !this.email || !this.password || !this.password_confirmation || !this.secteur || !this.siret) {
      this.error = 'Tous les champs sont obligatoires.';
      return;
    }
    if (this.password !== this.password_confirmation) {
      this.error = 'Les mots de passe ne correspondent pas.';
      return;
    }
    // Ajoute ici d'autres validations spécifiques (ex: format SIRET)
    this.loading = true;
    this.error = '';
    this.success = '';
    // Simulation d'inscription (à remplacer par votre logique)
    setTimeout(() => {
      this.loading = false;
      this.success = 'Inscription entreprise réussie ! Vous pouvez maintenant vous connecter.';
    }, 2000);
  }
} 