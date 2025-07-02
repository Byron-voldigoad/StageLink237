import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  prenom = '';
  nom = '';
  email = '';
  password = '';
  password_confirmation = '';
  error = '';
  success = '';
  loading = false;

  onSubmit() {
    if (!this.prenom || !this.nom || !this.email || !this.password || !this.password_confirmation) {
      this.error = 'Tous les champs sont obligatoires.';
      return;
    }
    if (this.password !== this.password_confirmation) {
      this.error = 'Les mots de passe ne correspondent pas.';
      return;
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