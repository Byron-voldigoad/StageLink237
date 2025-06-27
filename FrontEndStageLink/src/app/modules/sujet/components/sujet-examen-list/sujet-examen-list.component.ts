import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SujetExamenService } from '../../services/sujet-examen.service';
import { MatiereService } from '../../services/matiere.service';
import { NiveauService } from '../../services/niveau.service';
import { AnneeAcademiqueService } from '../../services/annee-academique.service';
import { TypeSujetService } from '../../services/type-sujet.service';
import { SujetExamen, TypeSujet } from '../../models/sujet-examen.model';
import { environment } from '../../../../../environments/environment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-sujet-examen-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sujet-examen-list.component.html',
  styleUrls: ['./sujet-examen-list.component.css']
})
export class SujetExamenListComponent implements OnInit {
  sujets: SujetExamen[] = [];
  filteredSujets: SujetExamen[] = [];
  matieres: any[] = [];
  niveaux: any[] = [];
  annees: any[] = [];
  types: TypeSujet[] = [];
  selectedMatiere: string = '';
  selectedNiveau: string = '';
  selectedAnnee: string = '';
  selectedType: string = '';
  activeTab: 'all' | 'free' | 'paid' = 'all';
  isLoading: boolean = true;

  constructor(
    private sujetExamenService: SujetExamenService,
    private matiereService: MatiereService,
    private niveauService: NiveauService,
    private anneeAcademiqueService: AnneeAcademiqueService,
    private typeSujetService: TypeSujetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;
    forkJoin({
      matieres: this.matiereService.getAll(),
      niveaux: this.niveauService.getAll(),
      annees: this.anneeAcademiqueService.getAll(),
      types: this.typeSujetService.getAll(),
      sujets: this.sujetExamenService.getAll()
    }).subscribe({
      next: ({ matieres, niveaux, annees, types, sujets }) => {
        this.matieres = Array.isArray(matieres) ? matieres : [];
        this.niveaux = Array.isArray(niveaux) ? niveaux : [];
        this.annees = Array.isArray(annees) ? annees : [];
        this.types = Array.isArray(types) ? types : [];

        this.sujets = sujets.map(sujet => {
          const matiere = this.matieres.find(m => m.id_matiere === sujet.id_matiere);
          const niveau = this.niveaux.find(n => n.id_niveau === sujet.id_niveau);
          const annee = this.annees.find(a => a.id_annee === sujet.id_annee);
          const type = this.types.find(t => t.id_type === sujet.id_type);

          return {
            ...sujet,
            matiereObj: matiere,
            niveauObj: niveau,
            anneeObj: annee,
            typeObj: type
          };
        });

        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données initiales:', error);
        // Initialiser avec des tableaux vides en cas d'erreur
        this.matieres = [];
        this.niveaux = [];
        this.annees = [];
        this.types = [];
        this.sujets = [];
        this.filteredSujets = [];
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredSujets = this.sujets.filter(sujet => {
      const matchMatiere = !this.selectedMatiere || sujet.id_matiere === parseInt(this.selectedMatiere);
      const matchNiveau = !this.selectedNiveau || sujet.id_niveau === parseInt(this.selectedNiveau);
      const matchAnnee = !this.selectedAnnee || sujet.id_annee === parseInt(this.selectedAnnee);
      const matchType = !this.selectedType || sujet.id_type === parseInt(this.selectedType);
      
      let matchGratuit = true;
      if (this.activeTab === 'free') {
        matchGratuit = sujet.est_gratuit === 1;
      } else if (this.activeTab === 'paid') {
        matchGratuit = sujet.est_gratuit === 0;
      }

      return matchMatiere && matchNiveau && matchAnnee && matchType && matchGratuit;
    });
  }

  selectTab(tab: 'all' | 'free' | 'paid'): void {
    this.activeTab = tab;
    this.applyFilters();
  }

  resetFilters(): void {
    this.selectedMatiere = '';
    this.selectedNiveau = '';
    this.selectedAnnee = '';
    this.selectedType = '';
    this.activeTab = 'all';
    this.applyFilters();
  }

  navigateToAdd(): void {
    this.router.navigate(['/sujets/ajouter']);
  }

  downloadFile(sujet: SujetExamen): void {
    if (!sujet.fichier_path) {
      alert('Aucun fichier disponible pour ce sujet.');
      return;
    }

    let baseUrl = environment.apiUrl.replace('/api', '');
    let fileUrl = `${baseUrl}/storage/${sujet.fichier_path}`;

    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.sujetExamenService.getById(sujet.id_sujet!).subscribe({
      next: (updatedSujet) => {
        const index = this.sujets.findIndex(s => s.id_sujet === sujet.id_sujet);
        if (index !== -1) {
          const originalSujet = this.sujets[index];
          this.sujets[index] = {
            ...updatedSujet,
            matiereObj: originalSujet.matiereObj,
            niveauObj: originalSujet.niveauObj,
            anneeObj: originalSujet.anneeObj,
            typeObj: originalSujet.typeObj
          };
          this.applyFilters();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du compteur de téléchargements:', error);
      }
    });
  }

  deleteSujet(id: number | undefined): void {
    if (id && confirm('Êtes-vous sûr de vouloir supprimer ce sujet ?')) {
      this.sujetExamenService.delete(id).subscribe({
        next: () => {
          this.sujets = this.sujets.filter(s => s.id_sujet !== id);
          this.applyFilters();
        },
        error: (error) => {
          alert('Erreur lors de la suppression du sujet.');
          console.error('Erreur lors de la suppression du sujet:', error);
        }
      });
    }
  }
} 