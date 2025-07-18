<?php

require_once 'vendor/autoload.php';

use App\Models\OffreStage;

// Charger l'application Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    // Récupérer une offre de stage
    $offre = OffreStage::find(1);
    
    if (!$offre) {
        echo "Aucune offre trouvée\n";
        exit;
    }
    
    echo "=== DÉBOGAGE OFFRE ===\n";
    echo "ID: " . $offre->id_offre_stage . "\n";
    echo "Titre: " . (is_string($offre->titre) ? 'string' : gettype($offre->titre)) . " - " . $offre->titre . "\n";
    echo "Description: " . (is_string($offre->description) ? 'string' : gettype($offre->description)) . " - " . substr($offre->description, 0, 50) . "...\n";
    echo "Compétences requises: " . (is_string($offre->competences_requises) ? 'string' : gettype($offre->competences_requises)) . " - " . $offre->competences_requises . "\n";
    echo "Exigences: " . (is_string($offre->exigences) ? 'string' : gettype($offre->exigences)) . " - " . ($offre->exigences ?: 'null') . "\n";
    
    // Test de concaténation
    echo "\n=== TEST CONCATÉNATION ===\n";
    $testString = "Titre: {$offre->titre}\n";
    echo "Test 1 OK\n";
    
    $testString .= "Description: {$offre->description}\n";
    echo "Test 2 OK\n";
    
    $testString .= "Compétences: {$offre->competences_requises}\n";
    echo "Test 3 OK\n";
    
    echo "Tous les tests de concaténation ont réussi!\n";
    
} catch (Exception $e) {
    echo "ERREUR: " . $e->getMessage() . "\n";
    echo "Fichier: " . $e->getFile() . "\n";
    echo "Ligne: " . $e->getLine() . "\n";
} 