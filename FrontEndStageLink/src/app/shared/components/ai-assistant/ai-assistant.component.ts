import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService, OffreStageAnalysis, CandidatureAnalysis, TutoratRecommendation } from '../../../core/services/gemini.service';

export type AIAssistantType = 'offre-analysis' | 'candidature-analysis' | 'tutorat-recommendation' | 'sujet-suggestion' | 'description-improvement';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ai-assistant-container">
      <!-- Bouton pour ouvrir l'assistant -->
      <button 
        (click)="toggleAssistant()"
        class="ai-toggle-btn bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
        Assistant IA
      </button>

      <!-- Panneau de l'assistant -->
      <div *ngIf="isOpen" class="ai-panel fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
          <!-- Header -->
          <div class="bg-primary text-white p-4 flex justify-between items-center">
            <h3 class="text-lg font-semibold">
              <svg class="w-6 h-6 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              Assistant IA - {{ getAssistantTitle() }}
            </h3>
            <button (click)="toggleAssistant()" class="text-white hover:text-gray-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="p-6 overflow-y-auto max-h-[60vh]">
            <!-- Loading -->
            <div *ngIf="loading" class="text-center py-8">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p class="mt-4 text-gray-600">L'assistant IA analyse vos données...</p>
            </div>

            <!-- Results -->
            <div *ngIf="!loading && (offreAnalysis || candidatureAnalysis || tutoratRecommendation || sujetSuggestions.length > 0 || improvedDescription)" class="space-y-6">
              <!-- Offre Analysis -->
              <div *ngIf="type === 'offre-analysis' && offreAnalysis" class="space-y-4">
                <div class="bg-blue-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-blue-800 mb-2">Compétences identifiées</h4>
                  <div class="flex flex-wrap gap-2">
                    <span *ngFor="let comp of offreAnalysis.competences" 
                          class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {{ comp }}
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-green-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-green-800 mb-2">Niveau de difficulté</h4>
                    <span class="text-green-700">{{ offreAnalysis.niveau_difficulte }}</span>
                  </div>
                  <div class="bg-purple-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-purple-800 mb-2">Score de pertinence</h4>
                    <div class="flex items-center">
                      <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div class="bg-purple-600 h-2 rounded-full" [style.width.%]="offreAnalysis.score_pertinence"></div>
                      </div>
                      <span class="text-purple-700 text-sm">{{ offreAnalysis.score_pertinence }}%</span>
                    </div>
                  </div>
                </div>

                <div *ngIf="offreAnalysis.suggestions_amelioration.length > 0" class="bg-yellow-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-yellow-800 mb-2">Suggestions d'amélioration</h4>
                  <ul class="list-disc list-inside text-yellow-700 space-y-1">
                    <li *ngFor="let suggestion of offreAnalysis.suggestions_amelioration">{{ suggestion }}</li>
                  </ul>
                </div>
              </div>

              <!-- Candidature Analysis -->
              <div *ngIf="type === 'candidature-analysis' && candidatureAnalysis" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-blue-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-blue-800 mb-2">Score des compétences</h4>
                    <div class="flex items-center">
                      <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div class="bg-blue-600 h-2 rounded-full" [style.width.%]="candidatureAnalysis.score_competences"></div>
                      </div>
                      <span class="text-blue-700 text-sm">{{ candidatureAnalysis.score_competences }}%</span>
                    </div>
                  </div>
                  <div class="bg-green-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-green-800 mb-2">Score global</h4>
                    <div class="flex items-center">
                      <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div class="bg-green-600 h-2 rounded-full" [style.width.%]="candidatureAnalysis.score_global"></div>
                      </div>
                      <span class="text-green-700 text-sm">{{ candidatureAnalysis.score_global }}%</span>
                    </div>
                  </div>
                </div>

                <div *ngIf="candidatureAnalysis.competences_manquantes.length > 0" class="bg-red-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-red-800 mb-2">Compétences manquantes</h4>
                  <div class="flex flex-wrap gap-2">
                    <span *ngFor="let comp of candidatureAnalysis.competences_manquantes" 
                          class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                      {{ comp }}
                    </span>
                  </div>
                </div>

                <div *ngIf="candidatureAnalysis.recommandations.length > 0" class="bg-purple-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-purple-800 mb-2">Recommandations</h4>
                  <ul class="list-disc list-inside text-purple-700 space-y-1">
                    <li *ngFor="let rec of candidatureAnalysis.recommandations">{{ rec }}</li>
                  </ul>
                </div>
              </div>

              <!-- Tutorat Recommendation -->
              <div *ngIf="type === 'tutorat-recommendation' && tutoratRecommendation" class="space-y-4">
                <div class="bg-blue-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-blue-800 mb-2">Matières suggérées</h4>
                  <div class="flex flex-wrap gap-2">
                    <span *ngFor="let matiere of tutoratRecommendation.matieres_suggerees" 
                          class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {{ matiere }}
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-green-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-green-800 mb-2">Niveau recommandé</h4>
                    <span class="text-green-700">{{ tutoratRecommendation.niveau_recommande }}</span>
                  </div>
                  <div class="bg-purple-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-purple-800 mb-2">Méthode pédagogique</h4>
                    <span class="text-purple-700">{{ tutoratRecommendation.methode_pedagogique }}</span>
                  </div>
                </div>

                <div *ngIf="tutoratRecommendation.ressources_utiles.length > 0" class="bg-yellow-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-yellow-800 mb-2">Ressources utiles</h4>
                  <ul class="list-disc list-inside text-yellow-700 space-y-1">
                    <li *ngFor="let ressource of tutoratRecommendation.ressources_utiles">{{ ressource }}</li>
                  </ul>
                </div>
              </div>

              <!-- Sujet Suggestions -->
              <div *ngIf="type === 'sujet-suggestion' && sujetSuggestions.length > 0" class="space-y-4">
                <div class="bg-blue-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-blue-800 mb-2">Suggestions de sujets</h4>
                  <ul class="list-decimal list-inside text-blue-700 space-y-2">
                    <li *ngFor="let sujet of sujetSuggestions">{{ sujet }}</li>
                  </ul>
                </div>
              </div>

              <!-- Description Improvement -->
              <div *ngIf="type === 'description-improvement' && improvedDescription" class="space-y-4">
                <div class="bg-green-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-green-800 mb-2">Description améliorée</h4>
                  <p class="text-green-700 whitespace-pre-wrap">{{ improvedDescription }}</p>
                </div>
                <button (click)="useImprovedDescription()" 
                        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Utiliser cette description
                </button>
              </div>
            </div>

            <!-- Error -->
            <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {{ error }}
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-3 border-t">
            <button (click)="runAnalysis()" 
                    [disabled]="loading"
                    class="bg-primary hover:bg-primary-dark disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors">
              {{ loading ? 'Analyse en cours...' : 'Analyser avec l\'IA' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ai-assistant-container {
      position: relative;
    }
    
    .ai-toggle-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 40;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .ai-panel {
      backdrop-filter: blur(4px);
    }
  `]
})
export class AIAssistantComponent implements OnInit {
  @Input() type: AIAssistantType = 'offre-analysis';
  @Input() data: any = null;
  @Output() resultReady = new EventEmitter<any>();
  @Output() descriptionImproved = new EventEmitter<string>();

  isOpen = false;
  loading = false;
  error: string | null = null;

  // Results
  offreAnalysis: OffreStageAnalysis | null = null;
  candidatureAnalysis: CandidatureAnalysis | null = null;
  tutoratRecommendation: TutoratRecommendation | null = null;
  sujetSuggestions: string[] = [];
  improvedDescription: string = '';

  constructor(private geminiService: GeminiService) {}

  ngOnInit() {
    // Auto-run analysis when data changes
    if (this.data) {
      this.runAnalysis();
    }
  }

  toggleAssistant() {
    this.isOpen = !this.isOpen;
  }

  getAssistantTitle(): string {
    const titles = {
      'offre-analysis': 'Analyse d\'offre de stage',
      'candidature-analysis': 'Analyse de candidature',
      'tutorat-recommendation': 'Recommandations de tutorat',
      'sujet-suggestion': 'Suggestions de sujets',
      'description-improvement': 'Amélioration de description'
    };
    return titles[this.type] || 'Assistant IA';
  }

  async runAnalysis() {
    if (!this.data) {
      this.error = 'Aucune donnée fournie pour l\'analyse';
      return;
    }

    console.log('[AI-ASSISTANT] data transmis à GeminiService:', this.data);
    if (this.data && this.data.id_offre_stage) {
      console.log('[AI-ASSISTANT] id_offre_stage transmis:', this.data.id_offre_stage);
    }
    this.loading = true;
    this.error = null;

    try {
      switch (this.type) {
        case 'offre-analysis':
          const offreResult = await this.geminiService.analyzeOffreStage(this.data).toPromise();
          this.offreAnalysis = offreResult || null;
          this.resultReady.emit(this.offreAnalysis);
          break;

        case 'candidature-analysis':
          const candidatureResult = await this.geminiService.analyzeCandidature(this.data.candidature, this.data.offre).toPromise();
          this.candidatureAnalysis = candidatureResult || null;
          this.resultReady.emit(this.candidatureAnalysis);
          break;

        case 'tutorat-recommendation':
          const tutoratResult = await this.geminiService.generateTutoratRecommendations(this.data.etudiant, this.data.matieres, this.data.offre).toPromise();
          this.tutoratRecommendation = tutoratResult || null;
          this.resultReady.emit(this.tutoratRecommendation);
          break;

        case 'sujet-suggestion':
          const sujetResult = await this.geminiService.generateSujetSuggestions(this.data.matiere, this.data.niveau, this.data.offre).toPromise();
          this.sujetSuggestions = sujetResult || [];
          this.resultReady.emit(this.sujetSuggestions);
          break;

        case 'description-improvement':
          const descriptionResult = await this.geminiService.improveOffreDescription(this.data.description).toPromise();
          this.improvedDescription = descriptionResult || '';
          this.resultReady.emit(this.improvedDescription);
          break;
      }
    } catch (error) {
      this.error = 'Erreur lors de l\'analyse IA: ' + error;
      console.error('Erreur IA:', error);
    } finally {
      this.loading = false;
    }
  }

  useImprovedDescription() {
    this.descriptionImproved.emit(this.improvedDescription);
    this.toggleAssistant();
  }
} 