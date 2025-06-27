import { Routes } from '@angular/router';

export const TUTORATS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/liste-tutorats/liste-tutorats.component')
      .then(m => m.ListeTutoratsComponent)
  },
  {
    path: 'nouveau',
    loadComponent: () => import('./pages/form-tutorat/form-tutorat.component')
      .then(m => m.FormTutoratComponent)
  },
  {
    path: 'modifier/:id',
    loadComponent: () => import('./pages/form-tutorat/form-tutorat.component')
      .then(m => m.FormTutoratComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/detail-tutorat/detail-tutorat.component')
      .then(m => m.DetailTutoratComponent)
  }
];
