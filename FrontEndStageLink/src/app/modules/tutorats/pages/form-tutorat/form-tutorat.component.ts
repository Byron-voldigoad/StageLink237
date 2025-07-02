import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TutoratService } from '../../services/tutorat.service';
import { Tutorat, Matiere, Niveau, Langue } from '../../models/tutorat.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form-tutorat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './form-tutorat.component.html',
  styleUrls: ['./form-tutorat.component.css']
})
export class FormTutoratComponent implements OnInit {
  tutoratForm: FormGroup;
  isEditMode = false;
  tutoratId?: number;
  loading = false;
  submitting = false;
  error = '';
  matieres: Matiere[] = [];
  niveaux: Niveau[] = [];
  langues: Langue[] = [];
  loadingData = false;


  constructor(
    private fb: FormBuilder,
    private tutoratService: TutoratService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.tutoratForm = this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required]],
      domaine: ['', [Validators.required, Validators.maxLength(100)]],
      niveau: ['', [Validators.required, Validators.maxLength(50)]],
      langues: [[]],
      date_debut: ['', [Validators.required]],
      date_fin: ['', [Validators.required]],
      localisation: [''],
      tarif_horaire: ['', [Validators.min(0)]],
      duree_seance: ['', [Validators.min(15)]],
      nombre_seances: ['', [Validators.min(1)]],
      prerequis: [''],
      objectifs: [''],
      methode_pedagogique: ['']
    });
  }

  ngOnInit(): void {
    this.loadData();
    const idParam = this.route.snapshot.params['id'];
    if (idParam) {
      this.tutoratId = +idParam;
      this.isEditMode = true;
      this.loadTutorat();
    }
  }

  loadData(): void {
    this.loadingData = true;
    this.tutoratService.getMatieres().subscribe({
      next: (matieres: Matiere[]) => {
        this.matieres = matieres;
        this.loadingData = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des matières:', error);
        this.loadingData = false;
      }
    });
    this.tutoratService.getNiveaux().subscribe({
      next: (niveaux: any) => {
        console.log('Niveaux reçus du service:', niveaux);
        // Si les données sont dans une propriété `data`, comme c'est souvent le cas avec les API Laravel
        const data = niveaux.data || niveaux;
        this.niveaux = Array.isArray(data) ? data : [];
        if (!Array.isArray(data)) {
          console.warn('La réponse pour les niveaux n\'était pas un tableau.', data);
        }
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des niveaux:', error);
      }
    });
    this.tutoratService.getLangues().subscribe({
      next: (langues: Langue[]) => {
        this.langues = Array.isArray(langues) ? langues : [];
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des langues:', error);
      }
    });
  }

  loadTutorat(): void {
    if (!this.tutoratId) return;
    
    this.loading = true;
    this.tutoratService.getById(this.tutoratId).subscribe({
      next: (tutorat: Tutorat) => {
        this.tutoratForm.patchValue({
          ...tutorat,
          date_debut: this.formatDateForInput(tutorat.date_debut),
          date_fin: this.formatDateForInput(tutorat.date_fin),
          langues: tutorat.langues ? tutorat.langues.map((l: Langue) => l.nom) : []
        });
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement du tutorat:', error);
        this.error = 'Erreur lors du chargement du tutorat';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.markFormGroupTouched();
    if (this.tutoratForm.invalid) {
      return;
    }

    this.submitting = true;
    this.error = '';

    const tutoratData: Partial<Tutorat> = this.tutoratForm.value;
    
    // TODO: Remplacer par l'ID du tuteur connecté
    tutoratData.tuteur_id = 1;

    if (new Date(tutoratData.date_fin!) <= new Date(tutoratData.date_debut!)) {
      this.error = 'La date de fin doit être postérieure à la date de début';
      this.submitting = false;
      return;
    }

    const operation: Observable<Tutorat> = this.isEditMode && this.tutoratId
      ? this.tutoratService.update(this.tutoratId, tutoratData as Partial<Tutorat>)
      : this.tutoratService.create(tutoratData as Partial<Tutorat>);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/tutorats']);
      },
      error: (err: any) => {
        console.error('Erreur lors de la soumission du formulaire:', err);
        this.error = err.error?.message || 'Une erreur est survenue.';
        this.submitting = false;
      }
    });
  }

  markFormGroupTouched(): void {
    Object.values(this.tutoratForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  formatDateForInput(dateString: string | Date): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }
    return date.toISOString().split('T')[0];
  }

  getFieldError(fieldName: string): string {
    const field = this.tutoratForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }
    if (field.errors['required']) return 'Ce champ est requis';
    if (field.errors['maxlength']) return `Maximum ${field.errors['maxlength'].requiredLength} caractères`;
    if (field.errors['min']) return `Minimum ${field.errors['min'].min}`;
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.tutoratForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  get selectedLangues(): string[] {
    return this.tutoratForm.get('langues')?.value || [];
  }

  get availableLangues(): Langue[] {
    const selected = this.selectedLangues;
    return this.langues.filter(l => !selected.includes(l.nom));
  }

  addLangueFromSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const langue = selectElement.value;
    const selected = this.selectedLangues;

    if (langue && !selected.includes(langue)) {
      this.tutoratForm.get('langues')?.setValue([...selected, langue]);
    }
    // Reset the select to the placeholder
    selectElement.value = '';
  }

  removeLangue(langue: string): void {
    const selected = this.selectedLangues;
    this.tutoratForm.get('langues')?.setValue(selected.filter(l => l !== langue));
  }


}
