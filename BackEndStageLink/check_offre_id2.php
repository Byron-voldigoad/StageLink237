<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

// 1. Afficher les informations de l'offre avec ID 2
echo "=== Offre avec ID 2 ===\n";
$offre = DB::table('offres_stage')
    ->select('id_offre_stage', 'id_entreprise', 'secteur_id', 'titre', 'secteur')
    ->where('id_offre_stage', 2)
    ->first();

if ($offre) {
    echo "ID: {$offre->id_offre_stage}\n";
    echo "ID Entreprise: {$offre->id_entreprise}\n";
    echo "Secteur ID: " . ($offre->secteur_id ?? 'NULL') . "\n";
    echo "Secteur (ancien): " . ($offre->secteur ?? 'NULL') . "\n";
    echo "Titre: {$offre->titre}\n";
} else {
    echo "Aucune offre trouvée avec l'ID 2\n";
}

// 2. Afficher les secteurs disponibles
echo "\n=== Secteurs disponibles ===\n";
$secteurs = DB::table('secteurs')->select('id', 'nom')->orderBy('id')->get();
foreach ($secteurs as $secteur) {
    echo "- {$secteur->id}: {$secteur->nom}\n";
}

// 3. Vérifier la structure de la table offres_stage
echo "\n=== Structure de la table offres_stage ===\n";
$columns = DB::select("SHOW COLUMNS FROM offres_stage");
foreach ($columns as $column) {
    $null = $column->Null === 'YES' ? 'NULL' : 'NOT NULL';
    echo "- {$column->Field} ({$column->Type}) {$null}\n";
}
