import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ForgotPasswordComponent {
  email = '';
  error = '';
  success = '';
  loading = false;

  onSubmit() {
    if (!this.email) {
      this.error = 'Veuillez entrer votre email.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.success = '';
    
    // Simulation d'envoi d'email (à remplacer par votre logique)
    setTimeout(() => {
      this.loading = false;
      this.success = 'Si cet email existe dans notre base de données, un lien de réinitialisation a été envoyé.';
    }, 2000);
  }
} 