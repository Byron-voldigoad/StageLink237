//app.routes.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './modules/dashboard/pages/dashboard-home/dashboard-home.component';
import { LoginComponent } from './auth/login.component';
import { inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { ForgotPasswordComponent } from './auth/forgot-password.component';
import { HomeComponent } from './home.component';
import { RegisterUserComponent } from './features/auth/register-user/register-user.component';

// Guard d'authentification
const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'register-user', component: RegisterUserComponent },
  { path: 'register-entreprise', loadComponent: () => import('./features/auth/register-entreprise/register-entreprise.component').then(m => m.RegisterEntrepriseComponent) },
  { 
    path: 'dashboard', 
    component: DashboardHomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'stages',
    canActivate: [authGuard],
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
    canActivate: [authGuard],
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
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/sujet/sujet.module').then((m) => m.SujetModule),
  },
  {
    path: 'messages',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/tuteur/tuteur.component').then(
        (m) => m.TuteurComponent
      ),
  },
  {
    path: 'profil',
    canActivate: [authGuard],
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
