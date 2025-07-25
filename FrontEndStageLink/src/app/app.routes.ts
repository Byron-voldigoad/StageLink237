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
import { DashboardComponent } from './modules/dashboard/dashboard.component';

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
  {path: 'utilisateurs', canActivate: [authGuard], loadComponent: () => import('./modules/utilisateurs/utilisateurs.component').then(m => m.UtilisateursComponent) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent),
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
        path: ':id/modifier',
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
      }
    ]
  },
  {
    path: 'sujets-examen',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/sujet/sujet.module').then(m => m.SujetModule)
  },
  {
    path: 'tutorats',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/tutorats/tutorats.module').then(m => m.TutoratsModule)
  },
  {
    path: 'sujets',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/sujet/sujet.module').then((m) => m.SujetModule)
  },
  {
    path: 'profil',
    canActivate: [authGuard],
    loadComponent: () => import('./modules/profil/profil.component').then((m) => m.ProfilComponent)
  },
  {
    path: 'mes-postulations',
    canActivate: [authGuard],
    loadComponent: () => import('./modules/etudiant/mes-postulations/mes-postulations.component').then(m => m.MesPostulationsComponent)
  }

  
  // ...add more as needed
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

