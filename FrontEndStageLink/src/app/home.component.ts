import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentYear = new Date().getFullYear();
  logoExists = true; // Change à false si tu n'as pas de logo dans assets/logo.png
  mobileMenuOpen = false;

  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }
} 