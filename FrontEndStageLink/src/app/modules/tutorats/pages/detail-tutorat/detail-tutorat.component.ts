import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TutoratService } from '../../services/tutorat.service';
import { Tutorat, CandidatureTutorat, SeanceTutorat } from '../../models/tutorat.model';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-detail-tutorat',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './detail-tutorat.component.html',
  styleUrls: ['./detail-tutorat.component.scss']
})
export class DetailTutoratComponent implements OnInit {
  tutorat?: Tutorat;
  loading = false;
  submitting = false;
  error = '';
  success = '';
  isTuteur = false;
  isAdmin = false;
  isEtudiant = false;
  currentUserId: number = 0;
  showConfirmationPopup = false;
  user: any = null;
  
  // Onglets Détail/Candidats
  activeTab: 'detail' | 'candidats' = 'detail';
  setActiveTab(tab: 'detail' | 'candidats') {
    this.activeTab = tab;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tutoratService: TutoratService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    console.log('USER DEBUG', this.user);
    if (this.user) {
      this.currentUserId = this.user.etudiant_id || 0;
      this.isTuteur = Array.isArray(this.user.roles) && this.user.roles.some((r: any) => r.nom_role === 'tuteur');
      this.isAdmin = Array.isArray(this.user.roles) && this.user.roles.some((r: any) => r.nom_role === 'admin');
      this.isEtudiant = Array.isArray(this.user.roles)
        ? this.user.roles.some((r: any) => r.nom_role === 'etudiant')
        : this.user.role === 'etudiant';
      console.log('isTuteur:', this.isTuteur, 'isAdmin:', this.isAdmin, 'isEtudiant:', this.isEtudiant, 'roles:', this.user.roles);
      if (!(this.isTuteur || this.isAdmin)) {
        this.activeTab = 'detail';
      }
    }
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTutorat(parseInt(id));
    }
  }

  loadTutorat(id: number) {
    this.loading = true;
    this.tutoratService.getById(id).subscribe({
      next: (tutorat: Tutorat) => {
        this.tutorat = tutorat;
        // Correction : seul le tuteur lié ET ayant le rôle tuteur, ou l'admin, peut voir l'onglet Candidats
        this.isTuteur = Array.isArray(this.user.roles)
          && this.user.roles.some((r: any) => r.nom_role === 'tuteur')
          && tutorat.tuteur_id === this.currentUserId;
        // isAdmin reste global
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du tutorat:', error);
        this.error = 'Erreur lors du chargement du tutorat';
        this.loading = false;
        this.tutorat = undefined;
      }
    });
  }

  ouvrirConfirmationPostulation() {
    this.showConfirmationPopup = true;
  }

  confirmerPostulation() {
    if (!this.tutorat || !this.currentUserId) {
      this.error = 'Utilisateur non connecté';
      return;
    }
    this.submitting = true;
    this.error = '';
    this.success = '';
    this.tutoratService.postuler(this.tutorat.id_tutorat, {
      etudiant_id: this.currentUserId,
      message_motivation: ''
    }).subscribe({
      next: (response) => {
        this.success = 'Votre candidature a été envoyée avec succès !';
        this.submitting = false;
        this.showConfirmationPopup = false;
        this.loadTutorat(this.tutorat!.id_tutorat);
        setTimeout(() => this.scrollToFeedback(), 100);
      },
      error: (error) => {
        this.error = error.error?.message || "Erreur lors de l'envoi de la candidature";
        this.submitting = false;
        this.showConfirmationPopup = false;
        setTimeout(() => this.scrollToFeedback(), 100);
      }
    });
  }

  gererCandidature(candidatureId: number, statut: 'acceptee' | 'refusee') {
    if (!this.tutorat) return;

    this.tutoratService.gererCandidature(this.tutorat.id_tutorat, candidatureId, statut).subscribe({
      next: () => {
        this.success = `Candidature ${statut === 'acceptee' ? 'acceptée' : 'refusée'} avec succès`;
        this.loadTutorat(this.tutorat!.id_tutorat);
        setTimeout(() => this.scrollToFeedback(), 100);
      },
      error: (error) => {
        console.error('Erreur lors de la gestion de la candidature:', error);
        this.error = 'Erreur lors de la gestion de la candidature';
        setTimeout(() => this.scrollToFeedback(), 100);
      }
    });
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'ouverte': return 'bg-green-100 text-green-800';
      case 'pourvue': return 'bg-blue-100 text-blue-800';
      case 'cloturee': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'ouverte': return 'Ouverte';
      case 'pourvue': return 'Pourvue';
      case 'cloturee': return 'Clôturée';
      default: return statut;
    }
  }

  getCandidatureStatutClass(statut: string): string {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'acceptee': return 'bg-green-100 text-green-800';
      case 'refusee': return 'bg-red-100 text-red-800';
      case 'annulee': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getCandidatureStatutLabel(statut: string): string {
    switch (statut) {
      case 'en_attente': return 'En attente';
      case 'acceptee': return 'Acceptée';
      case 'refusee': return 'Refusée';
      case 'annulee': return 'Annulée';
      default: return statut;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  formatPrice(price?: number): string {
    if (!price) return 'Non spécifié';
    return `${price}FCFA/h`;
  }

  formatDuration(minutes?: number): string {
    if (!minutes) return 'Non spécifié';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
    }
    return `${mins}min`;
  }

  canPostuler(): boolean {
    if (!this.tutorat) return false;
    if (this.tutorat.statut !== 'ouverte') return false;
    if (this.isTuteur) return false;
    
    // Vérifier si l'utilisateur a déjà postulé
    const hasAlreadyApplied = this.tutorat.candidatures?.some(
      c => c.etudiant_id === this.currentUserId
    );
    
    return !hasAlreadyApplied;
  }

  hasAlreadyApplied(): boolean {
    if (!this.tutorat?.candidatures) return false;
    return this.tutorat.candidatures.some(c => c.etudiant_id === this.currentUserId);
  }

  getCurrentUserCandidature(): CandidatureTutorat | undefined {
    if (!this.tutorat?.candidatures) return undefined;
    return this.tutorat.candidatures.find(c => c.etudiant_id === this.currentUserId);
  }

  afficherFormulaire() {
    // This method is no longer needed as the form is removed.
    // Keeping it for now, but it will be removed in a subsequent edit.
    console.log('Formulaire affiché');
  }

  scrollToFeedback() {
    const el = document.getElementById('feedback-message');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
