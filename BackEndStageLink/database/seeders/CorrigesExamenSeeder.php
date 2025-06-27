<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CorrigesExamenSeeder extends Seeder
{
    public function run()
    {
        // On suppose que les IDs 1 existent pour chaque entité (sujet, tuteur)
        $corriges = [
            [
                'id_sujet' => 1,
                'id_tuteur' => 1,
                'fichier_path' => 'corriges/corrige_maths_2023.pdf',
                'prix' => 200,
                'approuve' => true,
                'telechargements' => 3,
                'created_at' => now(),
            ],
            [
                'id_sujet' => 2,
                'id_tuteur' => 2,
                'fichier_path' => 'corriges/corrige_physique_2024.pdf',
                'prix' => 300,
                'approuve' => false,
                'telechargements' => 0,
                'created_at' => now(),
            ],
        ];
        DB::table('corriges_examen')->insert($corriges);
    }
} 