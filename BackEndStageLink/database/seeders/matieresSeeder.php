<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Matiere;

class matieresSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $matieres = [
            'Mathématiques',
            'Physique',
            'Chimie',
            'Biologie',
            'Informatique',
            'Anglais',
            'Français',
            'Histoire',
            'Géographie',
            'Philosophie',
            'Économie',
            'Droit',
            'Médecine',
            'Ingénierie',
            'Arts',
            'Sciences Politiques',
            'Psychologie',
            'Sociologie',
            'Langues Étrangères',
            'Sciences de l\'Ingénieur'
        ];

        foreach ($matieres as $matiere) {
            Matiere::create([
                'nom' => $matiere,
                'description' => 'Description de la matière ' . $matiere
            ]);
        }

        $this->command->info('Matières créées avec succès !');
    }
}
