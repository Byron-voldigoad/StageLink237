<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

// 1. Afficher la structure de la table offres_stage
echo "=== Structure de la table offres_stage ===\n";
$columns = DB::select('SHOW COLUMNS FROM offres_stage');
foreach ($columns as $column) {
    echo "- {$column->Field} ({$column->Type})\n";
}

// 2. Afficher l'offre avec ID 2
echo "\n=== Données de l'offre avec ID 2 ===\n";
$offre = DB::table('offres_stage')->where('id_offre_stage', 2)->first();
if ($offre) {
    foreach ((array)$offre as $key => $value) {
        echo "$key: " . (is_null($value) ? 'NULL' : "'$value'") . "\n";
    }
} else {
    echo "Aucune offre trouvée avec l'ID 2\n";
}

// 3. Afficher les secteurs
echo "\n=== Secteurs disponibles ===\n";
$secteurs = DB::table('secteurs')->get();
foreach ($secteurs as $secteur) {
    echo "- {$secteur->id}: {$secteur->nom}\n";
}
