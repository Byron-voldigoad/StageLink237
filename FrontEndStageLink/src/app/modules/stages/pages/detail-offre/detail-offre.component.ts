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
import { GeminiService, OffreStageAnalysis, CVAnalysis } from '../../../../core/services/gemini.service';

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
  isAdmin: boolean = false;
  isEntrepriseProprietaire: boolean = false;
  isEtudiant: boolean = false;
  user: any = null;

  // Nouvelles propriétés pour l'analyse IA
  analyzingCVs = false;
  candidatsAnalyzed: any[] = [];
  showAnalysis = false;

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
    this.user = this.authService.getUser();
    this.isAdmin = this.user && Array.isArray(this.user.roles)
      ? this.user.roles.some((r: any) => r.nom_role === 'admin')
      : (this.user && this.user.role === 'admin');
    this.isEntrepriseProprietaire = this.user && ((Array.isArray(this.user.roles)
      ? this.user.roles.some((r: any) => r.nom_role === 'entreprise')
      : this.user.role === 'entreprise')
      && this.offre && this.user.entreprise_id === this.offre.id_entreprise);
    this.isEtudiant = this.user && (Array.isArray(this.user.roles)
      ? this.user.roles.some((r: any) => r.nom_role === 'etudiant')
      : this.user.role === 'etudiant');
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
        // Mettre à jour isEntrepriseProprietaire après chargement de l'offre
        this.isEntrepriseProprietaire = this.user && ((Array.isArray(this.user.roles)
          ? this.user.roles.some((r: any) => r.nom_role === 'entreprise')
          : this.user.role === 'entreprise')
          && this.offre && this.user.entreprise_id === this.offre.id_entreprise);
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
            this.candidatureExistante = list.find((c: any) => c.id_offre_stage == offre.id_offre_stage) || null;
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

  /**
   * Retourne l'URL d'un fichier
   */
  getFileUrl(filePath: string): string {
    return `http://localhost:8000/storage/${filePath}`;
  }

  /**
   * Analyse tous les CV et classe les candidatures par pertinence
   */
  analyzeAndRankCandidatures(): void {
    if (!this.offre || this.candidats.length === 0) return;

    this.analyzingCVs = true;
    this.showAnalysis = true;

    this.geminiService.analyzeAndRankCandidatures(this.candidats, this.offre)
      .subscribe({
        next: (candidatsAnalyzed) => {
          this.candidatsAnalyzed = candidatsAnalyzed;
          this.analyzingCVs = false;
          console.log('Candidatures analysées et classées:', candidatsAnalyzed);
        },
        error: (error) => {
          console.error('Erreur lors de l\'analyse des CV:', error);
          this.analyzingCVs = false;
          // En cas d'erreur, on garde la liste originale
          this.candidatsAnalyzed = this.candidats;
        }
      });
  }

  /**
   * Retourne la couleur du score selon sa valeur
   */
  getScoreColor(score: number): string {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    if (score >= 30) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  }

  /**
   * Retourne le niveau d'adéquation en français
   */
  getNiveauLabel(niveau: string): string {
    const labels: { [key: string]: string } = {
      'excellent': 'Excellent',
      'bon': 'Bon',
      'moyen': 'Moyen',
      'faible': 'Faible'
    };
    return labels[niveau] || niveau;
  }

  /**
   * Bascule entre la vue normale et la vue analysée
   */
  toggleAnalysisView(): void {
    if (this.showAnalysis && this.candidatsAnalyzed.length > 0) {
      // On utilise déjà la vue analysée
      return;
    }
    
    if (!this.analyzingCVs) {
      this.analyzeAndRankCandidatures();
    }
  }
} 