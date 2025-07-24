import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardAdminComponent implements OnInit {
  stats = {
    entreprises: 0,
    stages: 0,
    etudiants: 0,
    messages: 0
  };

  entreprisesByQuartier: any[] = [];
  recentEntreprises: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    this.error = null;

    // Charger les statistiques
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des statistiques';
        this.loading = false;
        console.error('Erreur stats:', error);
      }
    });

    // Charger les entreprises par quartier
    this.dashboardService.getEntreprisesByQuartier().subscribe({
      next: (data) => {
        this.entreprisesByQuartier = Object.entries(data).map(([quartier, info]: [string, any]) => ({
          quartier,
          nombre: info.nombre,
          exemples: info.exemples
        }));
      },
      error: (error) => {
        console.error('Erreur entreprises par quartier:', error);
      }
    });

    // Charger les entreprises récentes
    this.dashboardService.getRecentEntreprises().subscribe({
      next: (data) => {
        this.recentEntreprises = data;
      },
      error: (error) => {
        console.error('Erreur entreprises récentes:', error);
      }
    });
  }
}
