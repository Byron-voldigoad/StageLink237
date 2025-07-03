import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/sujet-examen-list/sujet-examen-list.component')
      .then(m => m.SujetExamenListComponent)
  },
  {
    path: 'nouveau',
    loadComponent: () => import('./components/sujet-examen-form/sujet-examen-form.component')
      .then(m => m.SujetExamenFormComponent)
  },
  {
    path: 'modifier/:id',
    loadComponent: () => import('./components/sujet-examen-form/sujet-examen-form.component')
      .then(m => m.SujetExamenFormComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SujetRoutingModule { }
