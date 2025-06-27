// core/services/theme.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = false;

  constructor() {
    // Vérifier les préférences utilisateur ou le localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.darkMode = savedTheme === 'dark';
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.darkMode = true;
    }
    this.applyTheme();
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    this.applyTheme();
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
  }

  isDarkMode() {
    return this.darkMode;
  }

  private applyTheme() {
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}