<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

// Fonction pour afficher une ligne de séparation
function separator($title = '') {
    echo "\n" . str_repeat("=", 80) . "\n";
    if (!empty($title)) {
        echo "=== $title ===\n";
    }
}

// 1. Afficher les informations avant la mise à jour
separator("AVANT LA MISE À JOUR");
echo "=== Offre avec ID 2 ===\n";
$offre = DB::selectOne('SELECT * FROM offres_stage WHERE id_offre_stage = ?', [2]);
if ($offre) {
    echo "ID: " . $offre->id_offre_stage . "\n";
    echo "Titre: " . $offre->titre . "\n";
    echo "Ancien secteur: " . ($offre->secteur ?? 'NULL') . "\n";
    echo "Ancien secteur_id: " . ($offre->secteur_id ?? 'NULL') . "\n";
}

// 2. Mettre à jour les secteurs
separator("MISE À JOUR EN COURS");

try {
    // Désactiver temporairement les vérifications de clés étrangères
    DB::statement('SET FOREIGN_KEY_CHECKS=0');
    
    // Mettre à jour secteur_id en fonction de la valeur de secteur
    $updated = DB::update("
        UPDATE offres_stage 
        SET secteur_id = CASE 
            WHEN secteur = 'developpement_web' THEN 1
            WHEN secteur = 'developpement_mobile' THEN 2
            WHEN secteur = 'design_ui_ux' THEN 3
            WHEN secteur = 'data_science' THEN 4
            WHEN secteur = 'cloud_computing' THEN 5
            WHEN secteur = 'intelligence_artificielle' THEN 6
            WHEN secteur = 'cybersecurite' THEN 7
            WHEN secteur = 'reseau' THEN 8
            WHEN secteur = 'systemes_embarques' THEN 9
            WHEN secteur = 'gestion_de_projet' THEN 10
            ELSE secteur_id
        END
        WHERE secteur_id IS NULL OR secteur_id = 0 OR secteur_id = ''
    ");
    
    echo "Nombre d'offres mises à jour: $updated\n";
    
    // Réactiver les vérifications de clés étrangères
    DB::statement('SET FOREIGN_KEY_CHECKS=1');
    
    // 3. Vérifier les informations après la mise à jour
    separator("APRÈS LA MISE À JOUR");
    $offre = DB::selectOne('SELECT * FROM offres_stage WHERE id_offre_stage = ?', [2]);
    if ($offre) {
        echo "ID: " . $offre->id_offre_stage . "\n";
        echo "Titre: " . $offre->titre . "\n";
        echo "Nouveau secteur: " . ($offre->secteur ?? 'NULL') . "\n";
        echo "Nouveau secteur_id: " . ($offre->secteur_id ?? 'NULL') . "\n";
        
        // Récupérer le nom du secteur correspondant
        if ($offre->secteur_id) {
            $secteur = DB::selectOne('SELECT nom FROM secteurs WHERE id = ?', [$offre->secteur_id]);
            if ($secteur) {
                echo "Nom du secteur: " . $secteur->nom . "\n";
            }
        }
    }
    
    separator("OPÉRATION TERMINÉE AVEC SUCCÈS");
    
} catch (Exception $e) {
    echo "\nERREUR: " . $e->getMessage() . "\n";
    // S'assurer que les vérifications de clés étrangères sont réactivées en cas d'erreur
    DB::statement('SET FOREIGN_KEY_CHECKS=1');
}
