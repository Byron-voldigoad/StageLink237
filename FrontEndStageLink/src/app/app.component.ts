// app.component.ts
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { NavbarComponent } from './core/layout/navbar/navbar.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  ],
  standalone: true
})
export class AppComponent {
  showSidebar = true;
  sidebarOpen = true; // État de la sidebar sur mobile
  showLayout = true; // Affiche navbar/footer sauf sur login/register

  constructor(private router: Router) {
    // Cacher la sidebar et le layout sur certaines routes si nécessaire
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const noLayoutRoutes = ['/', '/login', '/register', '/forgot-password'];
        const currentUrl = event.urlAfterRedirects || event.url;
        this.showSidebar = !noLayoutRoutes.some(route => currentUrl === route);
        this.showLayout = !noLayoutRoutes.some(route => currentUrl === route);
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