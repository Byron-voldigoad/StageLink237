<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\SujetExamenController;
use App\Http\Controllers\TypeSujetController;
use App\Http\Controllers\MatiereController;
use App\Http\Controllers\NiveauController;
use App\Http\Controllers\AnneeAcademiqueController;
use App\Http\Controllers\TutoratController;
use App\Http\Controllers\LangueController;
use App\Http\Controllers\SecteurController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', [App\Http\Controllers\AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [App\Http\Controllers\AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('langues', [LangueController::class, 'index']);
Route::get('secteurs', [SecteurController::class, 'index']);

// Routes publiques pour les offres de stage (pour permettre l'affichage sans authentification)
Route::get('offres-stage', [App\Http\Controllers\OffreStageController::class, 'index']);
Route::get('offres-stage/{id}', [App\Http\Controllers\OffreStageController::class, 'show']);

// Routes spécifiques pour les candidatures (temporairement sans auth pour test)
Route::prefix('candidatures')->group(function () {
    Route::post('/postuler', [App\Http\Controllers\CandidatureController::class, 'postuler']);
    Route::get('/offre/{offreId}', [App\Http\Controllers\CandidatureController::class, 'getCandidaturesByOffre']);
    Route::get('/etudiant/{etudiantId}', [App\Http\Controllers\CandidatureController::class, 'getCandidaturesByEtudiant']);
});

// Routes pour les candidatures de tutorat
Route::prefix('candidatures-tutorat')->group(function () {
    Route::get('/etudiant/{etudiantId}', [App\Http\Controllers\TutoratController::class, 'getCandidaturesByEtudiant']);
});

// Toutes les autres routes sont protégées par auth:sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [App\Http\Controllers\AuthController::class, 'logout']);

    // Routes du dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'getStats']);
        Route::get('/entreprises-by-quartier', [DashboardController::class, 'getEntreprisesByQuartier']);
        Route::get('/recent-entreprises', [DashboardController::class, 'getRecentEntreprises']);
    });

    Route::apiResources([
        'utilisateurs' => 'App\Http\Controllers\UtilisateurController',
        'roles' => 'App\Http\Controllers\RoleController',
        'profils-etudiants' => 'App\Http\Controllers\ProfilEtudiantController',
        'profils-tuteurs' => 'App\Http\Controllers\ProfilTuteurController',
        'matieres' => 'App\Http\Controllers\MatiereController',
        'tuteur-matieres' => 'App\Http\Controllers\TuteurMatiereController',
        'entreprises' => 'App\Http\Controllers\EntrepriseController',
        'candidatures' => 'App\Http\Controllers\CandidatureController',
        'sujets-examen' => 'App\Http\Controllers\SujetExamenController',
        'niveaux' => 'App\Http\Controllers\NiveauController',
        'annees-academiques' => 'App\Http\Controllers\AnneeAcademiqueController',
        'corriges-examen' => 'App\Http\Controllers\CorrigeExamenController',
        'transactions-credits' => 'App\Http\Controllers\TransactionCreditController',
        'messages' => 'App\Http\Controllers\MessageController',
        'notifications' => 'App\Http\Controllers\NotificationController',
        'evaluations-tuteurs' => 'App\Http\Controllers\EvaluationTuteurController',
        'soumissions-etudiants' => 'App\Http\Controllers\SoumissionEtudiantController',
        'tutorats' => 'App\Http\Controllers\TutoratController',
    ]);

    // Routes protégées pour les offres de stage (création, modification, suppression)
    Route::post('offres-stage', [App\Http\Controllers\OffreStageController::class, 'store']);
    Route::put('offres-stage/{id}', [App\Http\Controllers\OffreStageController::class, 'update']);
    Route::delete('offres-stage/{id}', [App\Http\Controllers\OffreStageController::class, 'destroy']);

    // Routes pour les entreprises
    Route::apiResource('entreprises', EntrepriseController::class);

    Route::resource('matieres', MatiereController::class)->only(['index', 'show']);
    Route::resource('niveaux', NiveauController::class)->only(['index', 'show']);
    Route::resource('annees-academiques', AnneeAcademiqueController::class)->only(['index', 'show']);
    Route::resource('sujets-examen', SujetExamenController::class);
    Route::resource('types-sujets', TypeSujetController::class)->only(['index']);

    Route::post('/sujets-examen/upload', [SujetExamenController::class, 'uploadFile']);

    // Routes pour les tutorats
    Route::prefix('tutorats')->group(function () {
        Route::get('/', [TutoratController::class, 'index']);
        Route::post('/', [TutoratController::class, 'store']);
        Route::get('/{id}', [TutoratController::class, 'show']);
        Route::put('/{id}', [TutoratController::class, 'update']);
        Route::delete('/{id}', [TutoratController::class, 'destroy']);
        Route::post('/{id}/postuler', [TutoratController::class, 'postuler']);
        Route::put('/{tutoratId}/candidatures/{candidatureId}', [TutoratController::class, 'gererCandidature']);
        Route::get('/statistiques', [TutoratController::class, 'statistiques']);
        Route::get('/domaines', [TutoratController::class, 'domaines']);
        Route::get('/niveaux', [TutoratController::class, 'niveaux']);
    });
});

// Route publique pour l'inscription utilisateur
Route::post('utilisateurs', [App\Http\Controllers\UtilisateurController::class, 'store']);
Route::post('entreprises', [App\Http\Controllers\EntrepriseController::class, 'store']);

// Routes pour l'IA (protégées par authentification)
Route::middleware('auth:sanctum')->prefix('ai')->group(function () {
    Route::post('/analyze-offre', [App\Http\Controllers\AIController::class, 'analyzeOffreStage']);
    // Alias pour compatibilité
    Route::post('/gemini/analyse-offre', [App\Http\Controllers\AIController::class, 'analyzeOffreStage']);
    Route::post('/analyze-candidature', [App\Http\Controllers\AIController::class, 'analyzeCandidature']);
    Route::post('/tutorat-recommendations', [App\Http\Controllers\AIController::class, 'generateTutoratRecommendations']);
    Route::post('/improve-description', [App\Http\Controllers\AIController::class, 'improveDescription']);
    Route::post('/sujet-suggestions', [App\Http\Controllers\AIController::class, 'generateSujetSuggestions']);
    Route::get('/intelligent-search', [App\Http\Controllers\AIController::class, 'intelligentSearch']);
    Route::post('/generate-motivation', [App\Http\Controllers\AIController::class, 'generateMotivation']);
});
