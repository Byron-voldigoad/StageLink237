import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    DashboardHomeComponent
  ],
  exports: [
    DashboardHomeComponent
  ]
})
export class DashboardModule { } 