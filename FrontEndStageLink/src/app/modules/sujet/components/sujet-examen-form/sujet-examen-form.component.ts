import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SujetExamenService } from '../../services/sujet-examen.service';
import { MatiereService } from '../../services/matiere.service';
import { NiveauService } from '../../services/niveau.service';
import { AnneeAcademiqueService } from '../../services/annee-academique.service';
import { TypeSujetService } from '../../services/type-sujet.service';
import { TypeSujet } from '../../models/sujet-examen.model';

@Component({
  selector: 'app-sujet-examen-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sujet-examen-form.component.html',
  styleUrls: ['./sujet-examen-form.component.css']
})
export class SujetExamenFormComponent implements OnInit {
  message: string = '';
  messageType: 'success' | 'error' | '' = '';
  sujetForm: FormGroup;
  matieres: any[] = [];
  niveaux: any[] = [];
  annees: any[] = [];
  types: TypeSujet[] = [];
  selectedFile: File | null = null;
  isEditMode = false;
  isSubmitting = false;
  isLoading = false;
  private loadingCounter = 0;
  private readonly TOTAL_LOADING_OPERATIONS = 4; // Nombre d'appels API dans loadData

  constructor(
    private fb: FormBuilder,
    private sujetExamenService: SujetExamenService,
    private matiereService: MatiereService,
    private niveauService: NiveauService,
    private anneeAcademiqueService: AnneeAcademiqueService,
    private typeSujetService: TypeSujetService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.sujetForm = this.fb.group({
      titre: ['', Validators.required],
      id_matiere: ['', Validators.required],
      id_niveau: ['', Validators.required],
      id_annee: ['', Validators.required],
      id_type: ['', Validators.required],
      est_gratuit: [true],
      prix: [{value: '0', disabled: true}, [Validators.min(0), Validators.required]]
    });

    // Réagir aux changements de est_gratuit
    this.sujetForm.get('est_gratuit')?.valueChanges.subscribe(estGratuit => {
      const prixControl = this.sujetForm.get('prix');
      if (estGratuit) {
        prixControl?.disable();
        prixControl?.setValue('0');
      } else {
        prixControl?.enable();
      }
    });
  }

  ngOnInit(): void {
    this.loadData();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadSujet(Number(id));
    }
  }

  loadData(): void {
    this.isLoading = true;
    
    this.matiereService.getAll().subscribe({
      next: (data) => {
        this.matieres = Array.isArray(data) ? data : [];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des matières:', error);
        this.message = 'Impossible de charger les matières. Veuillez réessayer plus tard.';
        this.messageType = 'error';
      },
      complete: () => {
        this.checkLoadingComplete();
      }
    });

    this.niveauService.getAll().subscribe({
      next: (data) => {
        this.niveaux = Array.isArray(data) ? data : [];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des niveaux:', error);
        this.message = 'Erreur lors du chargement des niveaux';
        this.messageType = 'error';
        this.isLoading = false;
      },
      complete: () => {
        this.checkLoadingComplete();
      }
    });

    this.anneeAcademiqueService.getAll().subscribe({
      next: (data) => {
        // Filtrer les années pour n'afficher que celles valides selon la structure réelle
        this.annees = Array.isArray(data) ? data.filter(a => a && a.id_annee && a.annee_debut && a.annee_fin) : [];
        console.log('Données années reçues:', this.annees);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des années:', error);
        this.message = 'Impossible de charger les années académiques. Veuillez réessayer plus tard.';
        this.messageType = 'error';
      },
      complete: () => {
        this.checkLoadingComplete();
      }
    });

    this.typeSujetService.getAll().subscribe({
      next: (data) => {
        this.types = Array.isArray(data) ? data : [];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des types:', error);
        this.message = 'Impossible de charger les types de sujet. Veuillez réessayer plus tard.';
        this.messageType = 'error';
      },
      complete: () => {
        this.checkLoadingComplete();
      }
    });
  }

  private checkLoadingComplete(): void {
    this.loadingCounter++;
    if (this.loadingCounter >= this.TOTAL_LOADING_OPERATIONS) {
      this.isLoading = false;
      this.loadingCounter = 0; // Réinitialiser pour les futurs chargements
    }
  }

  loadSujet(id: number): void {
    this.isLoading = true;
    this.sujetExamenService.getById(id).subscribe({
      next: (sujet) => {
        this.sujetForm.patchValue({
          titre: sujet.titre,
          id_matiere: sujet.id_matiere,
          id_niveau: sujet.id_niveau,
          id_annee: sujet.id_annee,
          id_type: sujet.id_type,
          est_gratuit: sujet.est_gratuit === 1,
          prix: sujet.prix
        });

        // Si le sujet n'est pas gratuit, activer le champ prix
        if (sujet.est_gratuit === 0) {
          this.sujetForm.get('prix')?.enable();
        }
      },
      error: (error) => console.error('Erreur lors du chargement du sujet:', error)
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    this.message = '';
    this.messageType = '';
    // Vérification manuelle des champs requis
    const { titre, id_matiere, id_niveau, id_annee } = this.sujetForm.value;
    if (!titre || !id_matiere || !id_niveau || !id_annee) {
      this.message = 'Veuillez remplir tous les champs obligatoires.';
      this.messageType = 'error';
      return;
    }
    if (this.sujetForm.valid) {
      this.isSubmitting = true;
      const formData = new FormData();
      // Conversion explicite des types pour Laravel
      formData.append('titre', this.sujetForm.value.titre);
      formData.append('id_matiere', String(Number(this.sujetForm.value.id_matiere)));
      formData.append('id_niveau', String(Number(this.sujetForm.value.id_niveau)));
      formData.append('id_annee', String(Number(this.sujetForm.value.id_annee)));
      formData.append('id_type', String(Number(this.sujetForm.value.id_type)));
      formData.append('est_gratuit', this.sujetForm.value.est_gratuit ? '1' : '0');
      formData.append('prix', this.sujetForm.value.est_gratuit ? '0' : this.sujetForm.get('prix')?.value);
      if (this.selectedFile) {
        formData.append('fichier', this.selectedFile);
      }

      console.log([...formData.entries()]); // DEBUG : affiche toutes les valeurs envoyées
      const id = this.route.snapshot.paramMap.get('id');
      const request = this.isEditMode && id
        ? this.sujetExamenService.update(Number(id), formData)
        : this.sujetExamenService.create(formData);

      request.subscribe({
        next: () => {
          this.message = "Sujet d'examen ajouté avec succès !";
          this.messageType = 'success';
          this.isSubmitting = false;
          setTimeout(() => {
            this.router.navigate(['/sujets']);
          }, 1200);
        },
        error: (error) => {
          let msg = 'Erreur lors de l\'enregistrement.';
          // Gestion des erreurs Laravel 422 (validation)
          if (error.status === 422) {
            msg = 'Les données envoyées sont invalides.';
            if (error?.error?.errors) {
              const details = Object.values(error.error.errors)
                .map((errs: any) => Array.isArray(errs) ? errs.join(' ') : errs)
                .join(' ');
              msg += ' ' + details;
            }
          } else if (error?.error?.message) {
            msg += ' ' + error.error.message;
          }
          this.message = msg;
          this.messageType = 'error';
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/sujets']);
  }
} 