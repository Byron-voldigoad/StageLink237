import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TutoratService, TutoratPaginatedResponse } from '../../services/tutorat.service';
import { Tutorat, TutoratFilters, TutoratStats, Matiere, Niveau } from '../../models/tutorat.model';

@Component({
  selector: 'app-liste-tutorats',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './liste-tutorats.component.html',
  styleUrls: ['./liste-tutorats.component.scss']
})
export class ListeTutoratsComponent implements OnInit {
  constructor(
    private router: Router,
    private tutoratService: TutoratService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      domaine: [''],
      niveau: [''],
      statut: [''] // keep statut if needed by your logic
    });
  }

  goToTutoratDetail(id: number) {
    this.router.navigate(['/tutorats', id]);
  }

  tutorats: Tutorat[] = [];

  domaines: Matiere[] = [];
  niveaux: Niveau[] = [];
  filters: TutoratFilters = { page: 1 };
  filterForm: FormGroup;
  loading = false;
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  Math = Math; // Exposer Math pour le template
  Array = Array; // Exposer Array pour le template


  ngOnInit() {
    this.loadData();
    this.loadFilters();
  }

  loadData() {
    this.loading = true;
    this.tutoratService.getAll(this.filters).subscribe({
      next: (response: TutoratPaginatedResponse) => {
        this.tutorats = this.cleanTutoratsData(response.data || []);
        this.currentPage = response.current_page || 1;
        this.totalPages = response.last_page || 1;
        this.totalItems = response.total || this.tutorats.length;
        this.loading = false;
      },
      error: (error) => {
        this.tutorats = [];
        this.loading = false;
      }
    });
  }

  // Méthode pour nettoyer et valider les données des tutorats
  private cleanTutoratsData(data: any[]): Tutorat[] {
    if (!Array.isArray(data)) {
      console.log('Data n\'est pas un tableau:', data);
      return [];
    }
    
    console.log('Nettoyage des données, longueur:', data.length);
    
    const cleanedData: Tutorat[] = [];
    
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      
      // Vérifier que l'item est un objet valide
      if (!item || typeof item !== 'object' || !item.id_tutorat) {
        console.log(`Item ${i} invalide:`, item);
        continue;
      }
      
      console.log(`Traitement item ${i}:`, item);
      
      // Créer un nouvel objet simple sans références circulaires
      const cleanItem: Tutorat = {
        id_tutorat: Number(item.id_tutorat) || 0,
        titre: String(item.titre || ''),
        description: String(item.description || ''),
        domaine: String(item.domaine || ''),
        niveau: String(item.niveau || ''),
        tarif_horaire: Number(item.tarif_horaire) || 0,
        date_debut: String(item.date_debut || ''),
        date_fin: String(item.date_fin || ''),
        statut: item.statut || 'ouverte',
        tuteur_id: Number(item.tuteur_id) || 0,
        created_at: String(item.created_at || ''),
        updated_at: String(item.updated_at || '')
      };
      
      console.log(`Item ${i} nettoyé:`, cleanItem);
      cleanedData.push(cleanItem);
    }
    
    console.log('Données nettoyées finales:', cleanedData);
    return cleanedData;
  }

  loadFilters() {
    this.tutoratService.getMatieres().subscribe({
      next: (domaines: Matiere[]) => {
        this.domaines = Array.isArray(domaines) ? domaines : [];
      },
      error: (error: any) => {
        this.domaines = [];
      }
    });

    this.tutoratService.getNiveaux().subscribe({
      next: (niveaux: Niveau[]) => {
        this.niveaux = Array.isArray(niveaux) ? niveaux : [];
      },
      error: (error: any) => {
        this.niveaux = [];
      }
    });
  }

  onFilterChange() {
    this.filters = { ...this.filterForm.value, page: 1 };
    this.currentPage = 1;
    this.loadData();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.filters = { ...this.filters, page: page };
    this.loadData();
  }

  clearFilters() {
    this.filterForm.reset();
    this.filters = { page: 1 };
    this.currentPage = 1;
    this.loadData();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
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

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  formatPrice(price?: number): string {
    if (!price) return 'Non spécifié';
    return `${price}FCFA/h`;
  }

  // Fonction trackBy pour optimiser les performances de ngFor
  trackByTutoratId(index: number, tutorat: Tutorat): number {
    return tutorat.id_tutorat;
  }
}
