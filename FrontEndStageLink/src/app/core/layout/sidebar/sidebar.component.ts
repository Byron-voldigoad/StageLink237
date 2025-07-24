// core/layout/sidebar/sidebar.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  menuItems = [
    { name: 'Dashboard', icon: 'dashboard', link: '/dashboard' },
    { name: 'Profil', icon: 'person', link: '/profil' },
    // Ajoutez d'autres liens selon vos besoins
  ];

  user: any = null;

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUser();
    this.authService.user$.subscribe(u => this.user = u);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  get filteredMenuItems() {
    if (!this.user) return this.menuItems;

    const baseItems = [...this.menuItems];
    const extraItems = [];

    // Étudiant
    if (this.user.etudiant_id) {
      extraItems.push(
        { name: 'Mes postulations', icon: 'assignment', link: '/mes-postulations' },
        { name: 'Offres de stage', icon: 'work', link: '/stages' },
        { name: 'Tutorat', icon: 'school', link: '/tutorats' },
        { name: "Sujets d'examen", icon: 'book', link: '/sujets' }
      );
    }

    // Entreprise
    if (this.user.roles?.some((role: any) => role.nom_role === 'entreprise')) {
      extraItems.push(
        { name: 'Offres de stage', icon: 'work', link: '/stages' },
        { name: 'Candidatures', icon: 'people', link: '/candidatures' }
      );
    }

    // Tuteur
    if (this.user.roles?.some((role: any) => role.nom_role === 'tuteur')) {
      extraItems.push(
        { name: 'Tutorat', icon: 'school', link: '/tutorats' },
        { name: 'Candidatures', icon: 'people', link: '/tutorats/candidatures' }
      );
    }

    // Admin
    if (this.user.roles?.some((role: any) => role.nom_role === 'admin')) {
      extraItems.push(
        { name: 'Offres de stage', icon: 'work', link: '/stages' },
        { name: 'Tutorat', icon: 'school', link: '/tutorats' },
        { name: "Sujets d'examen", icon: 'book', link: '/sujets' },
        { name: 'Utilisateurs', icon: 'group', link: '/admin/utilisateurs' },
      );
    }

    // Insère les éléments supplémentaires après le premier item (Dashboard)
    return [
      ...baseItems.slice(0, 1),
      ...extraItems,
      ...baseItems.slice(1)
    ];
  }
  
}
