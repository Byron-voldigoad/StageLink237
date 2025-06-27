<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Matiere;

class MatieresSeeder extends Seeder
{
    public function run()
    {
        $matieres = [
            [
                'nom' => 'Mathématiques',
                'description' => 'Mathématiques générales'
            ],
            [
                'nom' => 'Physique',
                'description' => 'Physique générale'
            ],
            [
                'nom' => 'Chimie',
                'description' => 'Chimie générale'
            ],
            [
                'nom' => 'Français',
                'description' => 'Français et littérature'
            ],
            [
                'nom' => 'Anglais',
                'description' => 'Anglais'
            ],
            [
                'nom' => 'Informatique',
                'description' => 'Informatique générale'
            ],
            [
                'nom' => 'Histoire',
                'description' => 'Histoire'
            ],
            [
                'nom' => 'Géographie',
                'description' => 'Géographie'
            ],
            [
                'nom' => 'Philosophie',
                'description' => 'Philosophie'
            ],
            [
                'nom' => 'Économie',
                'description' => 'Économie générale'
            ]
        ];

        Matiere::insert($matieres);
    }
}
