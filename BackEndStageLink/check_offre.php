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
        echo str_repeat("-", strlen($title) + 6) . "\n";
    }
}

// Afficher les colonnes de la table offres_stage
separator("Structure de la table offres_stage");
$columns = DB::select('SHOW COLUMNS FROM offres_stage');
foreach ($columns as $column) {
    $null = $column->Null === 'YES' ? 'NULL' : 'NOT NULL';
    $default = $column->Default !== null ? "DEFAULT '{$column->Default}'" : '';
    $key = $column->Key ? "[{$column->Key}]" : '';
    echo sprintf("%-20s %-30s %-10s %-15s %s\n", 
        $column->Field, 
        $column->Type, 
        $null, 
        $default,
        $key
    );
}

// Afficher l'offre avec ID 2
separator("Données de l'offre avec ID 2");
$offre = DB::table('offres_stage')->where('id_offre_stage', 2)->first();
if ($offre) {
    echo "ID: {$offre->id_offre_stage}\n";
    echo "ID Entreprise: {$offre->id_entreprise}\n";
    echo "Secteur ID: " . ($offre->secteur_id ?? 'NULL') . "\n";
    echo "Secteur (ancien): " . ($offre->secteur ?? 'NULL') . "\n";
    echo "Titre: {$offre->titre}\n";
    
    // Afficher toutes les colonnes pour débogage
    separator("Toutes les données de l'offre");
    foreach ((array)$offre as $key => $value) {
        echo sprintf("%-20s: %s\n", $key, is_null($value) ? 'NULL' : "'$value'");
    }
} else {
    echo "Aucune offre trouvée avec l'ID 2\n";
}

// Vérifier les contraintes de clé étrangère
separator("Contraintes de clé étrangère");
try {
    $database = DB::getDatabaseName();
    $foreignKeys = DB::select("
        SELECT 
            TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, 
            REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE 
            TABLE_SCHEMA = ? 
            AND REFERENCED_TABLE_SCHEMA IS NOT NULL
            AND TABLE_NAME = 'offres_stage'
    ", [$database]);

    if (empty($foreignKeys)) {
        echo "Aucune clé étrangère trouvée pour la table offres_stage\n";
    } else {
        foreach ($foreignKeys as $fk) {
            echo "- {$fk->COLUMN_NAME} => {$fk->REFERENCED_TABLE_NAME}({$fk->REFERENCED_COLUMN_NAME})\n";
        }
    }
} catch (Exception $e) {
    echo "Erreur lors de la récupération des clés étrangères: " . $e->getMessage() . "\n";
}

// Vérifier les données de la table secteurs
separator("Données de la table secteurs");
$secteurs = DB::table('secteurs')->get();
if ($secteurs->isEmpty()) {
    echo "Aucun secteur trouvé dans la table secteurs\n";
} else {
    echo "ID  | Nom\n";
    echo str_repeat("-", 50) . "\n";
    foreach ($secteurs as $secteur) {
        echo sprintf("%-3d | %s\n", $secteur->id, $secteur->nom);
    }
}
