# 🤖 Intégration de l'IA Gemini dans StageLink

## 📋 Vue d'ensemble

Cette documentation décrit l'intégration de l'API Google Gemini dans l'application StageLink pour améliorer l'expérience utilisateur avec des fonctionnalités intelligentes.

## 🏗️ Architecture

### Frontend (Angular 19)
- **Service Gemini** : `src/app/core/services/gemini.service.ts`
- **Composant Assistant IA** : `src/app/shared/components/ai-assistant/ai-assistant.component.ts`
- **Intégration dans les composants** : Exemple avec `detail-offre.component.ts`

### Backend (Laravel 8)
- **Contrôleur IA** : `app/Http/Controllers/AIController.php`
- **Routes API** : `routes/api.php` (préfixe `/ai`)

## 🔧 Configuration

### 1. Clé API Gemini

#### Frontend
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  geminiApiKey: 'VOTRE_CLE_API_GEMINI_ICI'
};
```

#### Backend
```env
# .env
GEMINI_API_KEY=votre_cle_api_gemini_ici
```

### 2. Installation des dépendances

#### Frontend
```bash
cd FrontEndStageLink
npm install
```

#### Backend
```bash
cd BackEndStageLink
composer install
```

## 🚀 Fonctionnalités IA Intégrées

### 1. 📊 Analyse d'Offres de Stage
**Service** : `analyzeOffreStage()`
**Composant** : `offre-analysis`

**Fonctionnalités** :
- Extraction automatique des compétences
- Évaluation du niveau de difficulté
- Suggestions d'amélioration
- Score de pertinence

**Utilisation** :
```typescript
// Dans un composant
<app-ai-assistant 
  type="offre-analysis"
  [data]="offre"
  (resultReady)="onAIAnalysisResult($event)">
</app-ai-assistant>
```

### 2. 👤 Analyse de Candidatures
**Service** : `analyzeCandidature()`
**Composant** : `candidature-analysis`

**Fonctionnalités** :
- Évaluation de la correspondance CV/offre
- Identification des compétences manquantes
- Suggestions d'amélioration du CV
- Score global de candidature

### 3. 📚 Recommandations de Tutorat
**Service** : `generateTutoratRecommendations()`
**Composant** : `tutorat-recommendation`

**Fonctionnalités** :
- Suggestions de matières personnalisées
- Recommandation de niveau
- Méthodes pédagogiques adaptées
- Ressources utiles

### 4. 📝 Amélioration de Descriptions
**Service** : `improveOffreDescription()`
**Composant** : `description-improvement`

**Fonctionnalités** :
- Amélioration automatique des descriptions
- Optimisation pour l'attractivité
- Suggestions de formulation professionnelle

### 5. 📖 Suggestions de Sujets d'Examen
**Service** : `generateSujetSuggestions()`
**Composant** : `sujet-suggestion`

**Fonctionnalités** :
- Génération de sujets par matière/niveau
- Suggestions variées et pertinentes
- Adaptation au contexte éducatif

### 6. 🔍 Recherche Intelligente
**Service** : `intelligentSearch()`
**Endpoint** : `GET /api/ai/intelligent-search`

**Fonctionnalités** :
- Extraction de mots-clés intelligente
- Recherche sémantique
- Suggestions de recherche

## 📡 API Endpoints

### Routes Protégées (Authentification requise)

```php
Route::middleware('auth:sanctum')->prefix('ai')->group(function () {
    Route::post('/analyze-offre', [AIController::class, 'analyzeOffreStage']);
    Route::post('/analyze-candidature', [AIController::class, 'analyzeCandidature']);
    Route::post('/tutorat-recommendations', [AIController::class, 'generateTutoratRecommendations']);
    Route::post('/improve-description', [AIController::class, 'improveDescription']);
    Route::post('/sujet-suggestions', [AIController::class, 'generateSujetSuggestions']);
    Route::get('/intelligent-search', [AIController::class, 'intelligentSearch']);
});
```

### Exemples d'utilisation

#### Analyse d'offre
```bash
POST /api/ai/analyze-offre
{
  "offre_id": 123
}
```

#### Amélioration de description
```bash
POST /api/ai/improve-description
{
  "description": "Description originale..."
}
```

#### Recherche intelligente
```bash
GET /api/ai/intelligent-search?query=développeur web
```

## 🎨 Interface Utilisateur

### Composant Assistant IA

Le composant `AIAssistantComponent` fournit une interface unifiée pour toutes les fonctionnalités IA :

```typescript
export type AIAssistantType = 
  | 'offre-analysis' 
  | 'candidature-analysis' 
  | 'tutorat-recommendation' 
  | 'sujet-suggestion' 
  | 'description-improvement';
```

### Caractéristiques UI/UX

- **Bouton flottant** : Position fixe en bas à droite
- **Modal responsive** : Interface adaptative
- **Animations** : Transitions fluides
- **États de chargement** : Feedback visuel
- **Gestion d'erreurs** : Messages d'erreur clairs
- **Résultats structurés** : Affichage organisé des analyses

### Palette de couleurs
- **Primaire** : Rouge (#E53935) - Cohérent avec le design existant
- **Succès** : Vert (#16a34a) - Pour les scores positifs
- **Attention** : Jaune/Orange - Pour les suggestions
- **Erreur** : Rouge - Pour les problèmes

## 🔒 Sécurité

### Authentification
- Toutes les routes IA sont protégées par `auth:sanctum`
- Vérification des permissions utilisateur
- Logs des appels API pour audit

### Validation des données
- Validation côté client et serveur
- Sanitisation des prompts
- Limitation de la taille des requêtes

### Gestion des erreurs
- Try-catch sur tous les appels API
- Messages d'erreur appropriés
- Fallback en cas d'échec de l'IA

## 📊 Monitoring et Logs

### Logs Laravel
```php
Log::error('Erreur analyse offre IA: ' . $e->getMessage());
```

### Métriques à surveiller
- Taux de succès des appels IA
- Temps de réponse moyen
- Utilisation par fonctionnalité
- Erreurs fréquentes

## 🚀 Déploiement

### Variables d'environnement
```env
# Production
GEMINI_API_KEY=your_production_key
APP_ENV=production

# Développement
GEMINI_API_KEY=your_development_key
APP_ENV=local
```

### Build Frontend
```bash
cd FrontEndStageLink
npm run build
```

### Déploiement Backend
```bash
cd BackEndStageLink
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
```

## 🔮 Évolutions Futures

### Fonctionnalités prévues
1. **Chat IA** : Assistant conversationnel intégré
2. **Analyse de CV** : Extraction automatique des compétences
3. **Recommandations personnalisées** : Basées sur l'historique utilisateur
4. **Génération de contenu** : Création automatique de descriptions
5. **Analyse de sentiment** : Évaluation des candidatures

### Optimisations techniques
1. **Cache IA** : Mise en cache des réponses fréquentes
2. **Batch processing** : Traitement en lot des analyses
3. **Webhooks** : Notifications en temps réel
4. **API rate limiting** : Gestion des quotas Gemini

## 🛠️ Dépannage

### Problèmes courants

#### Clé API invalide
```
Erreur: Clé API Gemini non configurée
Solution: Vérifier GEMINI_API_KEY dans .env
```

#### Timeout des requêtes
```
Erreur: Timeout lors de l'appel IA
Solution: Augmenter le timeout HTTP
```

#### Réponses malformées
```
Erreur: JSON invalide dans la réponse
Solution: Vérifier le parsing des réponses
```

### Debug
```typescript
// Frontend
console.log('Réponse IA:', response);

// Backend
Log::debug('Prompt IA:', $prompt);
Log::debug('Réponse IA:', $response);
```

## 📚 Ressources

- [Documentation API Gemini](https://ai.google.dev/docs)
- [Guide Angular HttpClient](https://angular.io/guide/http)
- [Documentation Laravel HTTP Client](https://laravel.com/docs/http-client)

## 👥 Contribution

Pour contribuer à l'intégration IA :

1. Fork le projet
2. Créer une branche feature
3. Implémenter les fonctionnalités
4. Ajouter les tests
5. Soumettre une pull request

---

**Note** : Cette intégration nécessite une clé API Gemini valide. Obtenez-la sur [Google AI Studio](https://makersuite.google.com/app/apikey). 