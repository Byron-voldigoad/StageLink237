import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OffreStageService } from '../../services/offre-stage.service';
import { OffreStage } from '../../models/offre-stage.model';
import { PaginatedResponse } from '../../../../core/models/pagination.model';
import { Secteur } from '../../models/secteur.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-liste-offres',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './liste-offres.component.html',
  styleUrls: ['./liste-offres.component.css']
})
export class ListeOffresComponent implements OnInit {
  offres: OffreStage[] = [];
  filteredOffres: OffreStage[] = [];
  loading = false;
  error: string | null = null;
  totalOffres = 0;
  paginationInfo: PaginatedResponse<OffreStage> | null = null;

  // Propriétés pour les filtres
  searchTerm = '';
  selectedSecteurId: number | '' = '';
  selectedDuree = '';
  selectedLocalisation = '';
  selectedStatut = '';

  // Listes pour les filtres
  secteurs: Secteur[] = [];

  localisations: string[] = [
    'Douala',
    'Yaoundé',
    'Kribi',
    'Bafoussam',
    'Bamenda',
    'Bertoua',
    'Buea',
    'Ebolowa',
    'Garoua',
    'Kousseri',
    'Kumba',
    'Limbe',
    'Maroua',
    'Ngaoundéré',
    'Nkongsamba'
  ];

  constructor(private offreStageService: OffreStageService) {}

  ngOnInit(): void {
    this.loadSecteurs();
    this.loadOffres();
  }

  loadOffres(): void {
    this.loading = true;
    this.offreStageService.getAllOffres().subscribe({
      next: (response: PaginatedResponse<OffreStage>) => {
        this.offres = response.data;
        this.filteredOffres = this.offres;
        this.totalOffres = response.total;
        this.paginationInfo = response;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Erreur lors du chargement des offres';
        this.loading = false;
        console.error('Erreur:', error);
      }
    });
  }

  applyFilters(): void {
    this.filteredOffres = this.offres.filter(offre => {
      const matchesSearch = !this.searchTerm || 
        offre.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        offre.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        offre.entreprise?.nom.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesSecteur = !this.selectedSecteurId || 
        offre.secteur_id === this.selectedSecteurId;

      const matchesDuree = !this.selectedDuree || 
        (offre.duree ? this.matchesDuree(offre.duree, this.selectedDuree) : false);

      const matchesLocalisation = !this.selectedLocalisation || 
        offre.localisation === this.selectedLocalisation;

      const matchesStatut = !this.selectedStatut || 
        offre.statut === this.selectedStatut;

      return matchesSearch && matchesSecteur && matchesDuree && 
             matchesLocalisation && matchesStatut;
    });
  }

  matchesDuree(offreDuree: string, selectedDuree: string): boolean {
    const dureeMatch = offreDuree.match(/(\d+)\s*(\w+)/);
    if (!dureeMatch) return false;

    const dureeNombre = parseInt(dureeMatch[1], 10);
    switch (selectedDuree) {
      case '1-3':
        return dureeNombre >= 1 && dureeNombre <= 3;
      case '3-6':
        return dureeNombre > 3 && dureeNombre <= 6;
      case '6+':
        return dureeNombre > 6;
      default:
        return true;
    }
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedSecteurId = '';
    this.selectedDuree = '';
    this.selectedLocalisation = '';
    this.selectedStatut = '';
    this.applyFilters();
  }

  onPageChange(url: string): void {
    if (url) {
      this.loading = true;
      this.offreStageService.getAllOffresByUrl(url).subscribe({
        next: (response: PaginatedResponse<OffreStage>) => {
          this.offres = response.data;
          this.filteredOffres = this.offres;
          this.paginationInfo = response;
          this.loading = false;
        },
        error: (error: any) => {
          this.error = 'Erreur lors du chargement des offres';
          this.loading = false;
          console.error('Erreur:', error);
        }
      });
    }
  }

  getCompetences(competences: string | undefined): string[] {
    return competences ? competences.split(',').map(c => c.trim()) : [];
  }

  getRemunerationText(offre: OffreStage): string {
    if (!offre.remuneration) return 'Non rémunéré';
    return offre.remuneration > 0 
      ? `${offre.remuneration} Ar/mois` 
      : 'Non rémunéré';
  }

  loadSecteurs() {
    this.offreStageService['http'].get<Secteur[]>(`${environment.apiUrl}/secteurs`).subscribe({
      next: (secteurs) => this.secteurs = secteurs,
      error: () => this.secteurs = []
    });
  }
} 