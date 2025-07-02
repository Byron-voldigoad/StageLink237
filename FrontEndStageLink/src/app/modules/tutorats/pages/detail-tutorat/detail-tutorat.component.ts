import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TutoratService } from '../../services/tutorat.service';
import { Tutorat, CandidatureTutorat, SeanceTutorat } from '../../models/tutorat.model';

@Component({
  selector: 'app-detail-tutorat',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './detail-tutorat.component.html',
  styleUrls: ['./detail-tutorat.component.scss']
})
export class DetailTutoratComponent implements OnInit {
  tutorat?: Tutorat;
  candidatureForm: FormGroup;
  loading = false;
  submitting = false;
  error = '';
  success = '';
  showCandidatureForm = false;
  isTuteur = false; // À remplacer par la logique d'authentification
  currentUserId = 1; // À remplacer par l'ID de l'utilisateur connecté

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tutoratService: TutoratService,
    private fb: FormBuilder
  ) {
    this.candidatureForm = this.fb.group({
      message_motivation: ['', [Validators.required, Validators.minLength(50)]],
      cv: [null],
      lettre_motivation: [null]
    });
  }

  ngOnInit() {
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
        this.isTuteur = tutorat.tuteur_id === this.currentUserId;
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

  postuler() {
    if (this.candidatureForm.invalid || !this.tutorat) {
      this.markFormGroupTouched();
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';

    const formData = new FormData();
    formData.append('etudiant_id', this.currentUserId.toString());
    formData.append('message_motivation', this.candidatureForm.get('message_motivation')?.value);

    const cvFile = this.candidatureForm.get('cv')?.value;
    const lettreFile = this.candidatureForm.get('lettre_motivation')?.value;

    if (cvFile) {
      formData.append('cv', cvFile);
    }
    if (lettreFile) {
      formData.append('lettre_motivation', lettreFile);
    }

    this.tutoratService.postuler(this.tutorat.id_tutorat, {
      etudiant_id: this.currentUserId,
      message_motivation: this.candidatureForm.get('message_motivation')?.value,
      cv: cvFile,
      lettre_motivation: lettreFile
    }).subscribe({
      next: () => {
        this.success = 'Votre candidature a été envoyée avec succès !';
        this.showCandidatureForm = false;
        this.candidatureForm.reset();
        this.submitting = false;
        // Recharger le tutorat pour voir la nouvelle candidature
        this.loadTutorat(this.tutorat!.id_tutorat);
      },
      error: (error) => {
        console.error('Erreur lors de la candidature:', error);
        this.error = error.error?.message || 'Erreur lors de l\'envoi de la candidature';
        this.submitting = false;
      }
    });
  }

  gererCandidature(candidatureId: number, statut: 'acceptee' | 'refusee') {
    if (!this.tutorat) return;

    this.tutoratService.gererCandidature(this.tutorat.id_tutorat, candidatureId, statut).subscribe({
      next: () => {
        this.success = `Candidature ${statut === 'acceptee' ? 'acceptée' : 'refusée'} avec succès`;
        this.loadTutorat(this.tutorat!.id_tutorat);
      },
      error: (error) => {
        console.error('Erreur lors de la gestion de la candidature:', error);
        this.error = 'Erreur lors de la gestion de la candidature';
      }
    });
  }

  onFileChange(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      this.candidatureForm.get(field)?.setValue(file);
    }
  }

  markFormGroupTouched() {
    Object.keys(this.candidatureForm.controls).forEach(key => {
      const control = this.candidatureForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.candidatureForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Ce champ est requis';
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.candidatureForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
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
}
