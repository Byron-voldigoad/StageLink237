// app.component.ts
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { NavbarComponent } from './core/layout/navbar/navbar.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, FooterComponent, RouterOutlet, CommonModule]
})
export class AppComponent {
  showSidebar = true;
  sidebarOpen = true; // État de la sidebar sur mobile

  constructor(private router: Router) {
    // Cacher la sidebar sur certaines routes si nécessaire
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showSidebar = !['/login', '/register'].includes(event.url);
        // Fermer automatiquement la sidebar sur mobile lors de la navigation
        if (window.innerWidth < 768) {
          this.sidebarOpen = false;
        }
      });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}