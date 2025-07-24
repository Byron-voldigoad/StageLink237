import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { OffreStageService } from '../../../stages/services/offre-stage.service';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-dashboard-etudiant',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-etudiant.component.html',
  styleUrls: ['./dashboard-etudiant.component.css'],
})
export class DashboardEtudiantComponent implements OnInit {
  offresStage = 0;
  offresTutorat = 0;
  candidatures = 0;
  candidaturesRecentes: any[] = [];
  loading = true;
  user: any;

  constructor(
    private router: Router,
    private offreService: OffreStageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  private loadDashboardData() {
    // Charger le nombre d'offres de stage
    this.offreService.getAllOffres(1).subscribe({
      next: (res) => {
        this.offresStage = res.data.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des offres:', err);
        this.loading = false;
      },
    });

    // Valeurs temporaires en attendant les services
    this.offresTutorat = 6;
    this.candidatures = 4;
    this.candidaturesRecentes = [
      {
        titre: 'Développeur Web chez Alpha',
        statut: 'En attente',
        type: 'stage',
      },
      { titre: 'Tutorat Mathématiques', statut: 'Accepté', type: 'tutorat' },
    ];
  }

  voirOffresStage() {
    this.router.navigate(['/offres-stage']);
  }

  voirOffresTutorat() {
    this.router.navigate(['/tutorat']);
  }

  voirCandidatures() {
    this.router.navigate(['/mes-candidatures']);
  }

  voirExamens() {
    this.router.navigate(['/examens']);
  }
}
