import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TutoratService } from './services/tutorat.service';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/liste-tutorats/liste-tutorats.component').then(m => m.ListeTutoratsComponent)
  },
  {
    path: 'nouveau',
    loadComponent: () => import('./pages/form-tutorat/form-tutorat.component').then(m => m.FormTutoratComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/detail-tutorat/detail-tutorat.component').then(m => m.DetailTutoratComponent)
  },
  {
    path: ':id/modifier',
    loadComponent: () => import('./pages/form-tutorat/form-tutorat.component').then(m => m.FormTutoratComponent)
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    TutoratService
  ]
})
export class TutoratsModule { }
