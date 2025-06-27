import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SujetExamenListComponent } from './components/sujet-examen-list/sujet-examen-list.component';
import { SujetExamenFormComponent } from './components/sujet-examen-form/sujet-examen-form.component';

const routes: Routes = [
  {
    path: '',
    component: SujetExamenListComponent
  },
  {
    path: 'ajouter',
    component: SujetExamenFormComponent
  },
  {
    path: 'modifier/:id',
    component: SujetExamenFormComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SujetExamenListComponent,
    SujetExamenFormComponent
  ]
})
export class SujetModule { } 