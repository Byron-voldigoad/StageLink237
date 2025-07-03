import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => import('./components/sujet-examen-list/sujet-examen-list.component').then(m => m.SujetExamenListComponent)
      },
      {
        path: 'ajouter',
        loadComponent: () => import('./components/sujet-examen-form/sujet-examen-form.component').then(m => m.SujetExamenFormComponent)
      },
      {
        path: 'modifier/:id',
        loadComponent: () => import('./components/sujet-examen-form/sujet-examen-form.component').then(m => m.SujetExamenFormComponent)
      }
    ])
  ]
})
export class SujetModule { }