import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CandidatureService } from '../../services/candidature.service';

@Component({
  selector: 'app-postuler-offre',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './postuler-offre.component.html',
  styleUrls: ['./postuler-offre.component.css']
})
export class PostulerOffreComponent implements OnInit {
  @Input() offreId!: number;
  @Input() etudiantId!: number;
  @Output() candidatureSubmitted = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  candidatureForm!: FormGroup;
  selectedFiles: { [key: string]: File | null } = {
    cv: null,
    lettre_motivation: null
  };
  loading = false;
  error = '';
  success = '';
  showProfileButton = false;

  constructor(
    private fb: FormBuilder,
    private candidatureService: CandidatureService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.candidatureForm = this.fb.group({
      message_motivation: ['', [Validators.required, Validators.minLength(50)]]
    });
  }

  onFileSelected(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (file.type !== 'application/pdf') {
        this.error = 'Seuls les fichiers PDF sont acceptés.';
        return;
      }

      // Vérifier la taille (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'Le fichier ne doit pas dépasser 5MB.';
        return;
      }

      this.selectedFiles[field] = file;
      this.candidatureForm.patchValue({ [field]: file });
      this.error = '';
    }
  }

  onSubmit(): void {
    // Blocage si pas de profil étudiant
    if (!this.etudiantId) {
      this.error = 'Vous devez créer un profil étudiant pour postuler.';
      this.showProfileButton = true;
      return;
    }

    // Vérifier que le CV est sélectionné
    if (!this.selectedFiles['cv']) {
      this.error = 'Le CV est requis.';
      return;
    }

    if (this.candidatureForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const formData = new FormData();
      formData.append('offre_stage_id', this.offreId.toString());
      formData.append('etudiant_id', this.etudiantId.toString());
      formData.append('message_motivation', this.candidatureForm.get('message_motivation')?.value);

      if (this.selectedFiles['cv']) {
        formData.append('cv_path', this.selectedFiles['cv']);
      }

      if (this.selectedFiles['lettre_motivation']) {
        formData.append('lettre_motivation_path', this.selectedFiles['lettre_motivation']);
      }

      this.candidatureService.postuler(formData).subscribe({
        next: (response) => {
          this.success = 'Votre candidature a été envoyée avec succès !';
          this.loading = false;
          setTimeout(() => {
            this.candidatureSubmitted.emit();
            this.onClose();
          }, 2000);
        },
        error: (error) => {
          this.error = error.error?.message || 'Une erreur est survenue lors de l\'envoi de votre candidature.';
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.candidatureForm.controls).forEach(key => {
      const control = this.candidatureForm.get(key);
      control?.markAsTouched();
    });
  }

  onClose(): void {
    this.closeModal.emit();
  }

  redirectToProfile(): void {
    window.location.href = '/profile/edit'; // À adapter selon le routing réel
  }
} 