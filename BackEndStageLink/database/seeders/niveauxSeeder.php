<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Niveau;

class NiveauxSeeder extends Seeder
{
    public function run()
    {
        $niveaux = [
            [
                'nom' => 'Licence 1',
                'description' => 'Première année de licence'
            ],
            [
                'nom' => 'Licence 2',
                'description' => 'Deuxième année de licence'
            ],
            [
                'nom' => 'Licence 3',
                'description' => 'Troisième année de licence'
            ],
            [
                'nom' => 'Master 1',
                'description' => 'Première année de master'
            ],
            [
                'nom' => 'Master 2',
                'description' => 'Deuxième année de master'
            ],
            [
                'nom' => 'Doctorat',
                'description' => 'Doctorat'
            ],
            [
                'nom' => 'BTS',
                'description' => 'Brevet de Technicien Supérieur'
            ],
            [
                'nom' => 'DUT',
                'description' => 'Diplôme Universitaire de Technologie'
            ]
        ];

        Niveau::insert($niveaux);
    }
}
