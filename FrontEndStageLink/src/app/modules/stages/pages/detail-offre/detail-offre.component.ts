import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OffreStageService } from '../../services/offre-stage.service';
import { OffreStage } from '../../models/offre-stage.model';
import { MapComponent } from '../../../../shared/components/map/map.component';
import { GeocodingService } from '../../../../shared/services/geocoding.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PostulerOffreComponent } from '../../components/postuler-offre/postuler-offre.component';

@Component({
  selector: 'app-detail-offre',
  standalone: true,
  imports: [CommonModule, RouterModule, MapComponent, PostulerOffreComponent],
  templateUrl: './detail-offre.component.html',
  styleUrls: ['./detail-offre.component.css']
})
export class DetailOffreComponent implements OnInit {
  offre: OffreStage | null = null;
  coordinates: { lat: number; lng: number } | null = null;
  loading = true;
  error: string | null = null;
  showMapSidebar = false;
  showPostulerModal = false;
  currentEtudiantId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offreStageService: OffreStageService,
    private geocodingService: GeocodingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'étudiant connecté
    this.currentEtudiantId = this.authService.getCurrentEtudiantId();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOffre(parseInt(id));
    } else {
      this.error = 'ID de l\'offre non trouvé';
      this.loading = false;
    }
  }

  private loadOffre(id: number): void {
    this.offreStageService.getOffreById(id).subscribe({
      next: (offre) => {
        this.offre = offre;
        this.loading = false;
        if (offre.entreprise?.adresse) {
          this.loadCoordinates(offre.entreprise.adresse);
        }
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement de l\'offre';
        this.loading = false;
        console.error('Erreur:', error);
      }
    });
  }

  private loadCoordinates(address: string): void {
    this.geocodingService.getCoordinatesFromNominatim(address).subscribe({
      next: (coords: { lat: number; lng: number }) => {
        this.coordinates = coords;
      },
      error: (error: unknown) => {
        console.error('Erreur lors de la géocodification:', error);
      }
    });
  }

  getRemunerationClass(): string {
    if (!this.offre?.remuneration) return 'text-gray-600';
    const remuneration = this.offre.remuneration;
    if (remuneration > 0) return 'text-green-600';
    if (remuneration < 0) return 'text-red-600';
    return 'text-gray-600';
  }

  getRemunerationText(offre: OffreStage | null): string {
    if (!offre?.remuneration) return 'Non rémunéré';
    const remuneration = offre.remuneration;
    if (remuneration > 0) {
      return `${remuneration.toLocaleString()} FCFA`;
    } else if (remuneration < 0) {
      return `À payer: ${Math.abs(remuneration).toLocaleString()} FCFA`;
    } else {
      return 'Non rémunéré';
    }
  }

  getCompetences(competencesString: string | undefined): string[] {
    if (!competencesString) return [];
    return competencesString.split(',').map(c => c.trim());
  }

  showMap(): void {
    this.showMapSidebar = true;
  }

  hideMap(): void {
    this.showMapSidebar = false;
  }

  onDelete(): void {
    if (!this.offre) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      this.offreStageService.deleteOffre(this.offre.id_offre_stage).subscribe({
        next: () => {
          this.router.navigate(['/stages']);
        },
        error: (error) => {
          this.error = 'Erreur lors de la suppression de l\'offre';
          console.error('Erreur:', error);
        }
      });
    }
  }

  openDirections(): void {
    if (this.coordinates && this.offre?.entreprise?.adresse) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${this.coordinates.lat},${this.coordinates.lng}&travelmode=driving`;
      window.open(url, '_blank');
    }
  }

  onPostuler(): void {
    this.showPostulerModal = true;
  }

  closePostulerModal(): void {
    this.showPostulerModal = false;
  }

  onCandidatureSubmitted(candidature: any): void {
    console.log('Candidature soumise:', candidature);
    // Ici vous pouvez ajouter une notification ou rediriger l'utilisateur
  }
} 