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
            [
                'nom' => 'Mathématiques',
                'description' => 'Algèbre, analyse, géométrie et probabilités'
            ],
            [
                'nom' => 'Physique',
                'description' => 'Mécanique, électricité, optique et thermodynamique'
            ],
            [
                'nom' => 'Chimie',
                'description' => 'Chimie organique, inorganique et physique'
            ],
            [
                'nom' => 'Biologie',
                'description' => 'Biologie cellulaire, moléculaire et génétique'
            ],
            [
                'nom' => 'Informatique',
                'description' => 'Programmation, algorithmes et structures de données'
            ],
            [
                'nom' => 'Anglais',
                'description' => 'Langue anglaise et communication professionnelle'
            ],
            [
                'nom' => 'Français',
                'description' => 'Expression écrite et orale, littérature'
            ],
            [
                'nom' => 'Histoire',
                'description' => 'Histoire mondiale et africaine'
            ],
            [
                'nom' => 'Géographie',
                'description' => 'Géographie physique et humaine'
            ],
            [
                'nom' => 'Économie',
                'description' => 'Microéconomie et macroéconomie'
            ],
            [
                'nom' => 'Sciences de l\'ingénieur',
                'description' => 'Mécanique, électronique, automatisme'
            ],
            [
                'nom' => 'Développement Web',
                'description' => 'HTML, CSS, JavaScript, PHP, bases de données'
            ],
            [
                'nom' => 'Ingénierie',
                'description' => 'Conception, modélisation et optimisation des systèmes'
            ],
            [
                'nom' => 'Arts',
                'description' => 'Histoire de l\'art, techniques artistiques et création'
            ],
            [
                'nom' => 'Sciences Politiques',
                'description' => 'Relations internationales, institutions et politiques publiques'
            ],
            [
                'nom' => 'Psychologie',
                'description' => 'Psychologie cognitive, sociale et développementale'
            ],
            [
                'nom' => 'Sociologie',
                'description' => 'Études des phénomènes sociaux et comportements collectifs'
            ],
            [
                'nom' => 'Langues Étrangères',
                'description' => 'Apprentissage des langues et cultures étrangères'
            ]
        ];

        foreach ($matieres as $matiere) {
            Matiere::create([
                'nom' => $matiere['nom'],
                'description' => $matiere['description']
            ]);
        }

        $this->command->info('Matières créées avec succès !');
    }
}
