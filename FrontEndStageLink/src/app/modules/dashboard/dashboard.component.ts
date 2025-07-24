import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin.component';
import { DashboardEtudiantComponent } from './pages/dashboard-etudiant/dashboard-etudiant.component';
import { DashboardEntrepriseComponent } from './pages/dashboard-entreprise/dashboard-entreprise.component';
import { DashboardTuteurComponent } from './pages/dashboard-tuteur/dashboard-tuteur.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardAdminComponent,
    DashboardEtudiantComponent,
    DashboardEntrepriseComponent,
    DashboardTuteurComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  user: any = null;
  role: string = '';

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.role = this.detectRole(user);
      console.log('[DASHBOARD DEBUG] user:', user);
      console.log('[DASHBOARD DEBUG] role:', this.role);
    });
    // Initialisation immédiate si déjà connecté
    const current = this.authService.getUser();
    this.user = current;
    this.role = this.detectRole(current);
    console.log('[DASHBOARD DEBUG] INIT user:', current);
    console.log('[DASHBOARD DEBUG] INIT role:', this.role);
  }

  detectRole(user: any): string {
    if (!user) return '';
    // Cas tableau de rôles
    if (user.roles && Array.isArray(user.roles)) {
      if (user.roles.some((r: any) => r.nom_role === 'admin')) return 'admin';
      if (user.roles.some((r: any) => r.nom_role === 'tuteur')) return 'tuteur';
      if (user.roles.some((r: any) => r.nom_role === 'entreprise')) return 'entreprise';
      if (user.roles.some((r: any) => r.nom_role === 'etudiant')) return 'etudiant';
    }
    // Cas simple string
    if (user.role) {
      if (user.role === 'admin') return 'admin';
      if (user.role === 'tuteur') return 'tuteur';
      if (user.role === 'entreprise') return 'entreprise';
      if (user.role === 'etudiant') return 'etudiant';
    }
    return '';
  }
}
