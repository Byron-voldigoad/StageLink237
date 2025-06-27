<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Remplace Route::resources par Route::apiResources pour les contrôleurs API
Route::apiResources([
    'utilisateurs' => 'App\Http\Controllers\UtilisateurController',
    'roles' => 'App\Http\Controllers\RoleController',
    'profils-etudiants' => 'App\Http\Controllers\ProfilEtudiantController',
    'profils-tuteurs' => 'App\Http\Controllers\ProfilTuteurController',
    'matieres' => 'App\Http\Controllers\MatiereController',
    'tuteur-matieres' => 'App\Http\Controllers\TuteurMatiereController',
    'entreprises' => 'App\Http\Controllers\EntrepriseController',
    'offres-stage' => 'App\Http\Controllers\OffreStageController',
    'candidatures' => 'App\Http\Controllers\CandidatureController',
    'sujets-examen' => 'App\Http\Controllers\SujetExamenController',
    'niveaux' => 'App\Http\Controllers\NiveauController',
    'annees-academiques' => 'App\Http\Controllers\AnneeAcademiqueController',
    'corriges-examen' => 'App\Http\Controllers\CorrigeExamenController',
    'transactions-credits' => 'App\Http\Controllers\TransactionCreditController',
    'messages' => 'App\Http\Controllers\MessageController',
    'evaluations-tuteurs' => 'App\Http\Controllers\EvaluationTuteurController',
    'soumissions-etudiants' => 'App\Http\Controllers\SoumissionEtudiantController',
]);
