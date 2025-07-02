import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) {}

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

    // Préparation des données à envoyer
    const formData = new FormData();
    formData.append('prenom', this.prenom);
    formData.append('nom', this.nom);
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('role', this.type === 'enseignant' ? 'tuteur' : 'etudiant');
    if (this.type === 'enseignant' && this.justificatif) {
      formData.append('justificatif', this.justificatif);
    }

    this.authService.registerUser(formData).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erreur lors de l\'inscription.';
      }
    });
  }
} 