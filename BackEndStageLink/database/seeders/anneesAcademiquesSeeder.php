<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AnneeAcademique;

class AnneesAcademiquesSeeder extends Seeder
{
    public function run()
    {
        $annees = [
            [
                'annee_debut' => 2022,
                'annee_fin' => 2023,
                'description' => 'Année académique 2022-2023',
                'active' => false
            ],
            [
                'annee_debut' => 2023,
                'annee_fin' => 2024,
                'description' => 'Année académique 2023-2024',
                'active' => false
            ],
            [
                'annee_debut' => 2024,
                'annee_fin' => 2025,
                'description' => 'Année académique 2024-2025',
                'active' => true
            ],
            [
                'annee_debut' => 2025,
                'annee_fin' => 2026,
                'description' => 'Année académique 2025-2026',
                'active' => false
            ],
            [
                'annee_debut' => 2026,
                'annee_fin' => 2027,
                'description' => 'Année académique 2026-2027',
                'active' => false
            ]
        ];

        foreach ($annees as $annee) {
            AnneeAcademique::create($annee);
        }

        $this->command->info('Années académiques créées avec succès !');
    }
}
