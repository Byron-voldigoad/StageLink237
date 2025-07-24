import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { OffreStageService } from '../../../stages/services/offre-stage.service';
import { AuthService, User } from '@app/core/services/auth.service';
import { PaginatedResponse } from '@app/core/models/pagination.model';
import { OffreStage } from '@app/modules/stages/models/offre-stage.model';
import { Secteur } from '@app/modules/stages/models/secteur.model';

@Component({
  selector: 'app-dashboard-entreprise',
  templateUrl: './dashboard-entreprise.component.html',
  styleUrls: ['./dashboard-entreprise.component.css'],
  imports: [CommonModule, RouterModule],
  standalone: true,
})
export class DashboardEntrepriseComponent implements OnInit {
  offres: any[] = [];
  loading = false;
  paginationInfo: PaginatedResponse<OffreStage> | null = null;
  filteredOffres: OffreStage[] = [];
  // Listes pour les filtres
  secteurs: Secteur[] = [];
  etudiantId: number | null = null;
  totalCandidatures: number = 0;

  constructor(
    private offreService: OffreStageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSecteurs();
    this.loadOffres();
    this.etudiantId = this.authService.getCurrentEtudiantId();
  }

  voirToutesOffres() {
    this.router.navigate(['/offres']);
  }

  loadSecteurs() {
    this.offreService.getSecteurs().subscribe({
      next: (secteurs) => {
        this.secteurs = secteurs;
        // Recharger les offres pour associer les secteurs
        if (this.offres.length > 0) {
          this.offres = this.offres.map((offre) => {
            if (offre.secteur_id) {
              offre.secteur = this.secteurs.find(
                (s) => s.id === offre.secteur_id
              );
            }
            return offre;
          });
          this.filteredOffres = [...this.offres];
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des secteurs:', error);
        this.secteurs = [];
      },
    });
  }

  loadOffres() {
    this.loading = true;
    this.offreService.getAllOffres().subscribe({
      next: (response: PaginatedResponse<OffreStage>) => {
        this.offres = response.data.map((offre) => {
          if (offre.secteur_id && this.secteurs.length > 0) {
            offre.secteur = this.secteurs.find(
              (s) => s.id === offre.secteur_id
            );
          }
          return offre;
        });
        this.loading = false;
      },
      error: (error) => {
        this.offres = [];
        this.loading = false;
        console.error('Erreur lors du chargement des offres:', error);
      },
    });
  }

  ajouterOffre() {
    this.router.navigate(['/offres/ajouter']);
  }

  voirCandidatures(offre: any) {
    this.router.navigate(['/offres', offre.id, 'candidatures']);
  }
}
