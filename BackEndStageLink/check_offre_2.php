<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

// 1. Afficher les informations de l'offre avec ID 2
$offre = DB::selectOne('SELECT id_offre_stage, id_entreprise, secteur_id, secteur, titre FROM offres_stage WHERE id_offre_stage = ?', [2]);

if ($offre) {
    echo "=== Offre avec ID 2 ===\n";
    echo "ID: " . $offre->id_offre_stage . "\n";
    echo "Titre: " . $offre->titre . "\n";
    echo "Secteur (ancien): " . ($offre->secteur ?? 'NULL') . "\n";
    echo "Secteur ID: " . ($offre->secteur_id ?? 'NULL') . "\n";
    
    // Si secteur_id est défini, afficher le nom du secteur correspondant
    if (!empty($offre->secteur_id)) {
        $secteur = DB::selectOne('SELECT nom FROM secteurs WHERE id = ?', [$offre->secteur_id]);
        if ($secteur) {
            echo "Nom du secteur (depuis l'ID): " . $secteur->nom . "\n";
        } else {
            echo "Aucun secteur trouvé avec l'ID: " . $offre->secteur_id . "\n";
        }
    }
} else {
    echo "Aucune offre trouvée avec l'ID 2\n";
}
