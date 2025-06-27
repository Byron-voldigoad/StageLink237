//app.routes.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './modules/dashboard/pages/dashboard-home/dashboard-home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardHomeComponent },
  {
    path: 'stages',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./modules/stages/pages/liste-offres/liste-offres.component').then(
            (m) => m.ListeOffresComponent
          ),
      },
      {
        path: 'nouveau',
        loadComponent: () =>
          import('./modules/stages/pages/form-offre/form-offre.component').then(
            (m) => m.FormOffreComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./modules/stages/pages/detail-offre/detail-offre.component').then(
            (m) => m.DetailOffreComponent
          ),
      },
      {
        path: ':id/modifier',
        loadComponent: () =>
          import('./modules/stages/pages/form-offre/form-offre.component').then(
            (m) => m.FormOffreComponent
          ),
      },
    ],
  },
  {
    path: 'tutorats',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./modules/tutorats/pages/liste-tutorats/liste-tutorats.component').then(
            (m) => m.ListeTutoratsComponent
          ),
      },
      {
        path: 'nouveau',
        loadComponent: () =>
          import('./modules/tutorats/pages/form-tutorat/form-tutorat.component').then(
            (m) => m.FormTutoratComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./modules/tutorats/pages/detail-tutorat/detail-tutorat.component').then(
            (m) => m.DetailTutoratComponent
          ),
      },
      {
        path: ':id/modifier',
        loadComponent: () =>
          import('./modules/tutorats/pages/form-tutorat/form-tutorat.component').then(
            (m) => m.FormTutoratComponent
          ),
      },
    ],
  },
  {
    path: 'sujets',
    loadChildren: () =>
      import('./modules/sujet/sujet.module').then((m) => m.SujetModule),
  },
  {
    path: 'messages',
    loadComponent: () =>
      import('./modules/tuteur/tuteur.component').then(
        (m) => m.TuteurComponent
      ),
  },
  {
    path: 'profil',
    loadComponent: () =>
      import('./modules/etudiant/etudiant.component').then(
        (m) => m.EtudiantComponent
      ),
  },

  
  // ...add more as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
