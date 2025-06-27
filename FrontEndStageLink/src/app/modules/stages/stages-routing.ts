import { Routes } from '@angular/router';

export const STAGES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/liste-offres/liste-offres.component')
      .then(m => m.ListeOffresComponent)
  },
  {
    path: 'nouveau',
    loadComponent: () => import('./pages/form-offre/form-offre.component')
      .then(m => m.FormOffreComponent)
  },
  {
    path: 'modifier/:id',
    loadComponent: () => import('./pages/form-offre/form-offre.component')
      .then(m => m.FormOffreComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/detail-offre/detail-offre.component')
      .then(m => m.DetailOffreComponent)
  }
]; 