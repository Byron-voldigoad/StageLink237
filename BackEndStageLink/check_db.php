<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

// 1. Afficher les informations de l'offre avec ID 2
echo "=== Offre avec ID 2 ===\n";
$offre = DB::selectOne('SELECT * FROM offres_stage WHERE id_offre_stage = ?', [2]);

if ($offre) {
    echo "ID: " . $offre->id_offre_stage . "\n";
    echo "ID Entreprise: " . $offre->id_entreprise . "\n";
    echo "Secteur ID: " . ($offre->secteur_id ?? 'NULL') . "\n";
    echo "Secteur (ancien): " . ($offre->secteur ?? 'NULL') . "\n";
    echo "Titre: " . $offre->titre . "\n";
} else {
    echo "Aucune offre trouvée avec l'ID 2\n";
}

// 2. Afficher les secteurs disponibles
echo "\n=== 5 premiers secteurs ===\n";
$secteurs = DB::select('SELECT id, nom FROM secteurs LIMIT 5');
foreach ($secteurs as $secteur) {
    echo "- " . $secteur->id . ": " . $secteur->nom . "\n";
}

// 3. Afficher les colonnes de la table offres_stage
echo "\n=== Colonnes de la table offres_stage ===\n";
$columns = DB::select('SHOW COLUMNS FROM offres_stage');
$columnNames = [];
foreach ($columns as $column) {
    $columnNames[] = $column->Field;
}
echo implode(", ", $columnNames) . "\n";
