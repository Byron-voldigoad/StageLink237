import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-user',
  standalone: true,
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
  imports: [CommonModule, FormsModule]
})
export class RegisterUserComponent {
  type = 'etudiant';
  prenom = '';
  nom = '';
  email = '';
  password = '';
  password_confirmation = '';
  error = '';
  success = '';
  loading = false;

  // Champs enseignant
  justificatif: File | null = null;

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.justificatif = event.target.files[0];
    }
  }

  onSubmit() {
    if (!this.prenom || !this.nom || !this.email || !this.password || !this.password_confirmation) {
      this.error = 'Tous les champs sont obligatoires.';
      return;
    }
    if (this.password !== this.password_confirmation) {
      this.error = 'Les mots de passe ne correspondent pas.';
      return;
    }
    if (this.type === 'enseignant') {
      if (!this.justificatif) {
        this.error = 'Le justificatif est obligatoire pour les enseignants.';
        return;
      }
    }
    this.loading = true;
    this.error = '';
    this.success = '';
    // Simulation d'inscription (à remplacer par votre logique)
    setTimeout(() => {
      this.loading = false;
      this.success = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
    }, 2000);
  }
} 