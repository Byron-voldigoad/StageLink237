import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { STAGES_ROUTES } from './modules/stages/stages-routing';

const routes: Routes = [
  {
    path: 'stages',
    children: STAGES_ROUTES
  },
  {
    path: '',
    redirectTo: 'stages',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 