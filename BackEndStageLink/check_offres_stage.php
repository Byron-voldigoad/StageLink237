<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illine\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Afficher la structure de la table
echo "=== Structure de la table offres_stage ===\n";
$columns = Schema::getConnection()->getDoctrineSchemaManager()->listTableColumns('offres_stage');
foreach ($columns as $column) {
    echo sprintf(
        "%s: %s\n",
        $column->getName(),
        $column->getType()->getName()
    );
}

// Afficher les premières lignes de la table
echo "\n=== Données de la table offres_stage ===\n";
$offres = DB::table('offres_stage')->limit(5)->get();
foreach ($offres as $offre) {
    echo json_encode($offre, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n";
}

// Vérifier si la colonne secteur_id est une clé étrangère
echo "\n=== Vérification des clés étrangères ===\n";
$foreignKeys = Schema::getConnection()->getDoctrineSchemaManager()->listTableForeignKeys('offres_stage');
if (empty($foreignKeys)) {
    echo "Aucune clé étrangère trouvée.\n";
} else {
    foreach ($foreignKeys as $foreignKey) {
        echo sprintf(
            "Clé étrangère: %s référence %s(%s)\n",
            implode(', ', $foreignKey->getLocalColumns()),
            $foreignKey->getForeignTableName(),
            implode(', ', $foreignKey->getForeignColumns())
        );
    }
}
