import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-dashboard-tuteur',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-tuteur.component.html',
  styleUrls: ['./dashboard-tuteur.component.css'],
})
export class DashboardTuteurComponent implements OnInit {
  mesTutorats: any[] = [];
  totalCandidatures = 0;
  loading = true;
  user: any;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  private loadDashboardData() {
    // TODO: Remplacer par l'appel au service de tutorat une fois créé
    this.mesTutorats = [
      {
        id: 1,
        matiere: 'Mathématiques',
        niveau: 'Licence 1',
        candidatures: [
          { id: 1, etudiant: 'Jean Dupont', statut: 'En attente' },
          { id: 2, etudiant: 'Marie Martin', statut: 'Accepté' },
        ],
      },
      {
        id: 2,
        matiere: 'Physique',
        niveau: 'Licence 2',
        candidatures: [
          { id: 3, etudiant: 'Pierre Durand', statut: 'En attente' },
        ],
      },
    ];
    this.totalCandidatures = this.mesTutorats.reduce(
      (total, tutorat) => total + (tutorat.candidatures?.length || 0),
      0
    );
    this.loading = false;
  }

  ajouterTutorat() {
    this.router.navigate(['/tutorat/ajouter']);
  }

  voirTousLesTutorats() {
    this.router.navigate(['/mes-tutorats']);
  }

  voirCandidatures(tutorat: any) {
    this.router.navigate(['/tutorat', tutorat.id, 'candidatures']);
  }

  modifierProfil() {
    this.router.navigate(['/profil-tuteur/edit']);
  }
}
