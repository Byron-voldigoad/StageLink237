import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OffreStageService } from '../../services/offre-stage.service';
import { OffreStage } from '../../models/offre-stage.model';
import { MapComponent } from '../../../../shared/components/map/map.component';
import { GeocodingService } from '../../../../shared/services/geocoding.service';
import { AuthService } from 'src/app/auth/auth.service';
import { PostulerOffreComponent } from '../../components/postuler-offre/postuler-offre.component';
import { CandidatureService, Candidature } from '../../services/candidature.service';
import { AIAssistantComponent } from '../../../../shared/components/ai-assistant/ai-assistant.component';
import { GeminiService, OffreStageAnalysis } from '../../../../core/services/gemini.service';

@Component({
  selector: 'app-detail-offre',
  standalone: true,
  imports: [CommonModule, RouterModule, MapComponent, PostulerOffreComponent, AIAssistantComponent],
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
  candidatureExistante: Candidature | null = null;

  // Ajout pour la liste des candidats
  candidats: any[] = [];
  candidatsLoading = false;
  candidatsError: string | null = null;
  activeTab: 'detail' | 'candidats' = 'detail';
  viewMode: 'table' | 'cards' = 'table';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offreStageService: OffreStageService,
    private geocodingService: GeocodingService,
    private authService: AuthService,
    private candidatureService: CandidatureService,
    private geminiService: GeminiService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'étudiant connecté
    this.currentEtudiantId = this.authService.getEtudiantId();
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
        // Vérifier si l'étudiant a déjà postulé à cette offre
        if (this.currentEtudiantId) {
          this.candidatureService.getCandidaturesByEtudiant(this.currentEtudiantId).subscribe((candidatures: any) => {
            let list: Candidature[] = [];
            if (Array.isArray(candidatures)) {
              list = candidatures;
            } else if (candidatures && Array.isArray(candidatures.data)) {
              list = candidatures.data;
            }
            console.log('Liste des candidatures:', list);
            console.log('ID de l\'offre:', offre.id_offre_stage);
            this.candidatureExistante = list.find((c: any) => c.id_offre_stage == offre.id_offre_stage) || null;
            console.log('Candidature existante trouvée:', this.candidatureExistante);
          });
        }
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement de l\'offre';
        this.loading = false;
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

  // Méthodes pour l'IA
  onAIAnalysisResult(analysis: OffreStageAnalysis): void {
    console.log('Analyse IA reçue:', analysis);
    // Ici vous pouvez traiter les résultats de l'analyse IA
  }

  // Ajout : méthode pour charger les candidats
  loadCandidats(): void {
    if (!this.offre) return;
    this.candidatsLoading = true;
    this.candidatsError = null;
    this.candidatureService.getCandidaturesByOffre(this.offre.id_offre_stage).subscribe({
      next: (candidats: any) => {
        this.candidats = Array.isArray(candidats) ? candidats : (candidats.data || []);
        this.candidatsLoading = false;
      },
      error: (err) => {
        this.candidatsError = "Erreur lors du chargement des candidats.";
        this.candidatsLoading = false;
      }
    });
  }

  // Ajout : méthode pour changer d'onglet
  setActiveTab(tab: 'detail' | 'candidats') {
    this.activeTab = tab;
    if (tab === 'candidats' && this.candidats.length === 0 && this.offre) {
      this.loadCandidats();
    }
  }

  // Ajout : méthode pour changer le mode d'affichage
  setViewMode(mode: 'table' | 'cards') {
    this.viewMode = mode;
  }
} 