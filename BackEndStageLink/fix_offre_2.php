<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

// 1. Afficher les informations avant la mise à jour
echo "=== AVANT LA MISE À JOUR ===\n";
$offre = DB::selectOne('SELECT id_offre_stage, id_entreprise, secteur_id, secteur, titre FROM offres_stage WHERE id_offre_stage = ?', [2]);

if ($offre) {
    echo "ID: " . $offre->id_offre_stage . "\n";
    echo "Titre: " . $offre->titre . "\n";
    echo "Ancien secteur: " . ($offre->secteur ?? 'NULL') . "\n";
    echo "Ancien secteur_id: " . ($offre->secteur_id ?? 'NULL') . "\n";
    
    // 2. Déterminer le bon secteur_id en fonction de la valeur de secteur
    $secteur_id = null;
    switch ($offre->secteur) {
        case 'design_ui_ux':
            $secteur_id = 3; // ID correspondant à "Design UI/UX"
            break;
        // Ajoutez d'autres cas si nécessaire
    }
    
    if ($secteur_id) {
        // 3. Mettre à jour le secteur_id
        DB::update('UPDATE offres_stage SET secteur_id = ? WHERE id_offre_stage = ?', [$secteur_id, $offre->id_offre_stage]);
        
        // 4. Afficher les informations après la mise à jour
        echo "\n=== APRÈS LA MISE À JOUR ===\n";
        $offre = DB::selectOne('SELECT id_offre_stage, id_entreprise, secteur_id, secteur, titre FROM offres_stage WHERE id_offre_stage = ?', [2]);
        
        if ($offre) {
            echo "ID: " . $offre->id_offre_stage . "\n";
            echo "Titre: " . $offre->titre . "\n";
            echo "Nouveau secteur: " . ($offre->secteur ?? 'NULL') . "\n";
            echo "Nouveau secteur_id: " . ($offre->secteur_id ?? 'NULL') . "\n";
            
            // Vérifier le nom du secteur correspondant
            $secteur = DB::selectOne('SELECT nom FROM secteurs WHERE id = ?', [$offre->secteur_id]);
            if ($secteur) {
                echo "Nom du secteur: " . $secteur->nom . "\n";
            }
            
            echo "\n=== MISE À JOUR RÉUSSIE ===\n";
            echo "Le secteur_id a été mis à jour pour correspondre à la valeur de secteur.\n";
        }
    } else {
        echo "\nAucune correspondance trouvée pour le secteur: " . $offre->secteur . "\n";
    }
} else {
    echo "Aucune offre trouvée avec l'ID 2\n";
}
