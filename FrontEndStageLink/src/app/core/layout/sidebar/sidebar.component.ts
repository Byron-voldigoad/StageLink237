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
    { name: 'Offres de stage', icon: 'work', link: '/stages' },
    { name: "Sujets d'examen", icon: 'book', link: '/sujets' },
    { name: 'Tutorat', icon: 'school', link: '/tutorats' },
    { name: 'Utilisateurs', icon: 'group', link: '/utilisateurs' },
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
    if (this.user && this.user.etudiant_id) {
      return [
        ...this.menuItems.slice(0, 1),
        { name: 'Mes postulations', icon: 'assignment', link: '/mes-postulations' },
        ...this.menuItems.slice(1)
      ];
    }
    return this.menuItems;
  }
}
