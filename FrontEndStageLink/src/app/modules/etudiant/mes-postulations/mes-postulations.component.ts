import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CandidatureService, Candidature } from '../../stages/services/candidature.service';
import { TutoratService } from '../../tutorats/services/tutorat.service';
import { AuthService } from '../../../auth/auth.service';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OffreStageService } from '../../stages/services/offre-stage.service';
import { OffreStage } from '../../stages/models/offre-stage.model';
import { Tutorat } from '../../tutorats/models/tutorat.model';

@Component({
  selector: 'app-mes-postulations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mes-postulations.component.html',
  styleUrls: []
})
export class MesPostulationsComponent implements OnInit {
  etudiantId: number | null = null;
  candidaturesStage: any[] = [];
  candidaturesTutorat: any[] = [];
  offresMap: { [id: number]: OffreStage } = {};
  tutoratsMap: { [id: number]: Tutorat } = {};
  
  // Onglets et filtres
  activeTab: 'stages' | 'tutorats' = 'stages';
  statusFilter: 'all' | 'en_attente' | 'acceptee' | 'refusee' = 'all';

  // Modal d'édition
  showEditModal = false;
  editingCandidature: any = null;
  editForm: any = {
    message_motivation: '',
    new_cv: null,
    new_lettre: null
  };
  isUpdating = false;

  constructor(
    private candidatureService: CandidatureService,
    private tutoratService: TutoratService,
    private offreStageService: OffreStageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    this.etudiantId = user?.etudiant_id || null;
    if (this.etudiantId) {
      this.loadCandidaturesStage();
      this.loadCandidaturesTutorat();
    }
  }

  /**
   * Charge les candidatures de stage
   */
  loadCandidaturesStage() {
    this.candidatureService.getCandidaturesByEtudiant(this.etudiantId!).pipe(
      catchError(() => of([]))
    ).subscribe((cands: any) => {
      let list: any[] = [];
      if (Array.isArray(cands)) {
        list = cands;
      } else if (cands && Array.isArray(cands.data)) {
        list = cands.data;
      }
      this.candidaturesStage = list;
      // Charger les détails des offres
      list.forEach((c) => {
        const id = c.id_offre_stage;
        if (id && !this.offresMap[id]) {
          this.offreStageService.getOffreById(id).subscribe(offre => {
            this.offresMap[id] = offre;
          });
        }
      });
    });
  }

  /**
   * Charge les candidatures de tutorat
   */
  loadCandidaturesTutorat() {
    if (this.tutoratService.getCandidaturesByEtudiant) {
      this.tutoratService.getCandidaturesByEtudiant(this.etudiantId!).pipe(
        catchError(() => of([]))
      ).subscribe((cands: any) => {
        let list: any[] = [];
        if (Array.isArray(cands)) {
          list = cands;
        } else if (cands && Array.isArray(cands.data)) {
          list = cands.data;
        }
        this.candidaturesTutorat = list;
        // Charger les détails des tutorats
        list.forEach((c) => {
          const id = c.tutorat_id;
          if (id && !this.tutoratsMap[id]) {
            this.tutoratService.getById(id).subscribe(tutorat => {
              this.tutoratsMap[id] = tutorat;
            });
          }
        });
      });
    }
  }

  /**
   * Change l'onglet actif
   */
  setActiveTab(tab: 'stages' | 'tutorats') {
    this.activeTab = tab;
  }

  /**
   * Change le filtre de statut
   */
  setStatusFilter(filter: 'all' | 'en_attente' | 'acceptee' | 'refusee') {
    this.statusFilter = filter;
  }

  /**
   * Retourne les candidatures de stage filtrées
   */
  getFilteredCandidaturesStage(): any[] {
    if (this.statusFilter === 'all') {
      return this.candidaturesStage;
    }
    return this.candidaturesStage.filter(c => c.statut === this.statusFilter);
  }

  /**
   * Retourne les candidatures de tutorat filtrées
   */
  getFilteredCandidaturesTutorat(): any[] {
    if (this.statusFilter === 'all') {
      return this.candidaturesTutorat;
    }
    return this.candidaturesTutorat.filter(c => c.statut === this.statusFilter);
  }

  /**
   * Ouvre le modal d'édition
   */
  editCandidature(candidature: any, type: 'stage' | 'tutorat') {
    this.editingCandidature = candidature;
    this.editForm = {
      message_motivation: candidature.message_motivation || '',
      new_cv: null,
      new_lettre: null
    };
    this.showEditModal = true;
  }

  /**
   * Ferme le modal d'édition
   */
  closeEditModal() {
    this.showEditModal = false;
    this.editingCandidature = null;
    this.editForm = {
      message_motivation: '',
      new_cv: null,
      new_lettre: null
    };
    this.isUpdating = false;
  }

  /**
   * Gère la sélection de fichiers
   */
  onFileSelected(event: any, type: 'cv' | 'lettre') {
    const file = event.target.files[0];
    if (file) {
      if (type === 'cv') {
        this.editForm.new_cv = file;
      } else {
        this.editForm.new_lettre = file;
      }
    }
  }

  /**
   * Met à jour la candidature
   */
  updateCandidature() {
    if (!this.editingCandidature) return;

    this.isUpdating = true;

    // Créer un FormData pour l'envoi des fichiers
    const formData = new FormData();
    formData.append('message_motivation', this.editForm.message_motivation);

    if (this.editForm.new_cv) {
      formData.append('cv_path', this.editForm.new_cv);
    }
    if (this.editForm.new_lettre) {
      formData.append('lettre_motivation_path', this.editForm.new_lettre);
    }

    // Appeler le service pour mettre à jour
    this.candidatureService.updateCandidatureWithFiles(this.editingCandidature.id_candidature, formData).subscribe({
      next: (response) => {
        console.log('Candidature mise à jour:', response);
        this.closeEditModal();
        this.loadCandidaturesStage(); // Recharger la liste
        alert('Candidature mise à jour avec succès !');
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        this.isUpdating = false;
        alert('Erreur lors de la mise à jour de la candidature');
      }
    });
  }

  /**
   * Supprime une candidature
   */
  deleteCandidature(candidature: any, type: 'stage' | 'tutorat') {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      if (type === 'stage') {
        this.candidatureService.deleteCandidature(candidature.id_candidature).subscribe({
          next: () => {
            console.log('Candidature stage supprimée');
            this.loadCandidaturesStage(); // Recharger la liste
            alert('Candidature supprimée avec succès !');
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            alert('Erreur lors de la suppression de la candidature');
          }
        });
      } else {
        // Pour les tutorats, vous devrez implémenter la méthode dans le service
        console.log('Supprimer candidature tutorat:', candidature);
        // this.tutoratService.deleteCandidature(candidature.id_candidature).subscribe(...);
      }
    }
  }



  /**
   * Retourne l'URL d'un fichier
   */
  getFileUrl(filePath: string): string {
    return `http://localhost:8000/storage/${filePath}`;
  }

  /**
   * Retourne le label français du statut
   */
  getStatutLabel(statut: string): string {
    const statuts: { [key: string]: string } = {
      'en_attente': 'En attente',
      'acceptee': 'Acceptée',
      'refusee': 'Refusée',
      'annulee': 'Annulée'
    };
    return statuts[statut] || statut;
  }

  /**
   * Formate une date pour l'affichage
   */
  formatDate(dateString: string): string {
    if (!dateString) return 'Date non disponible';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date invalide';
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Retourne le titre de l'offre de manière sûre
   */
  getOffreTitle(offreId: number): string {
    const offre = this.offresMap[offreId];
    return offre && offre.titre ? offre.titre : `Offre #${offreId}`;
  }

  /**
   * Retourne le nom de l'entreprise de manière sûre
   */
  getOffreEntreprise(offreId: number): string {
    const offre = this.offresMap[offreId];
    return offre && offre.entreprise && offre.entreprise.nom ? offre.entreprise.nom : 'Entreprise non spécifiée';
  }

  /**
   * Retourne le titre du tutorat de manière sûre
   */
  getTutoratTitle(tutoratId: number): string {
    const tutorat = this.tutoratsMap[tutoratId];
    return tutorat && tutorat.titre ? tutorat.titre : `Tutorat #${tutoratId}`;
  }

  /**
   * Retourne le domaine du tutorat de manière sûre
   */
  getTutoratDomaine(tutoratId: number): string {
    const tutorat = this.tutoratsMap[tutoratId];
    return tutorat && tutorat.domaine ? tutorat.domaine : 'Domaine non spécifié';
  }
} 