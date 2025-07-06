import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  scrollToSection(sectionId: string) {
    console.log('Scrolling to section:', sectionId);
    
    // Fermer le menu mobile si ouvert
    this.mobileMenuOpen = false;
    
    // Test simple - scroller vers l'élément directement
    const element = document.getElementById(sectionId);
    console.log('Element found:', element);
    
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      console.log('Scrolled to element');
    } else {
      console.error('Element not found for section:', sectionId);
    }
  }
} 