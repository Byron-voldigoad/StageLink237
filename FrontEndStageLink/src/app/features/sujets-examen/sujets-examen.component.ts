import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SujetExamenService } from '../../services/sujet-examen.service';
import { SujetExamen } from '../../models/sujet-examen.model';

@Component({
  selector: 'app-sujets-examen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Sujets d'Examens</h1>
        <button class="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
          Ajouter un sujet
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let sujet of sujets" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-2">{{ sujet.titre }}</h2>
          <div class="text-gray-600 mb-4">
            <p>Matière: {{ sujet.matiere?.nom }}</p>
            <p>Niveau: {{ sujet.niveau?.nom }}</p>
            <p>Année: {{ sujet.annee?.annee }}</p>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">
              {{ sujet.telechargements }} téléchargements
            </span>
            <div class="flex space-x-2">
              <button class="text-primary hover:text-primary-dark">
                Télécharger
              </button>
              <button class="text-red-500 hover:text-red-700">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SujetsExamenComponent implements OnInit {
  sujets: SujetExamen[] = [];

  constructor(private sujetExamenService: SujetExamenService) {}

  ngOnInit(): void {
    this.loadSujets();
  }

  loadSujets(): void {
    this.sujetExamenService.getAll().subscribe({
      next: (data) => {
        this.sujets = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des sujets:', error);
      }
    });
  }
} 