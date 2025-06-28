import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TutoratService } from '../../services/tutorat.service';
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
    private fb: FormBuilder
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


  ngOnInit() {
    this.loadData();
    this.loadFilters();
  }

  loadData() {
    this.loading = true;
    this.tutoratService.getAll(this.filters).subscribe({
      next: (response) => {
        // Correction NG0900: toujours un tableau
        let tutorats = Array.isArray(response) ? response : response.data;
        if (!Array.isArray(tutorats)) tutorats = [];
        this.tutorats = tutorats;
        this.currentPage = response.current_page || 1;
        this.totalPages = response.last_page || 1;
        this.totalItems = response.total || this.tutorats.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tutorats:', error);
        this.loading = false;
      }
    });
  }

  loadFilters() {
    this.tutoratService.getMatieres().subscribe({
      next: (domaines: Matiere[]) => {
        this.domaines = domaines;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des domaines:', error);
      }
    });

    this.tutoratService.getNiveaux().subscribe({
      next: (niveaux: Niveau[]) => {
        this.niveaux = niveaux;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des niveaux:', error);
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
}
