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
                'id_sujet' => 1, // Sujet Mathématiques 2023
                'id_tuteur' => 1,
                'fichier_path' => 'docs/8akqcXmjXIdANE1MKfkEaxm2F7Lh5pOJ1yr3fdK1.pdf',
                'prix' => 1000,
                'approuve' => true,
                'telechargements' => 25,
                'created_at' => now(),
            ],
            [
                'id_sujet' => 2, // Sujet Physique Avancée 2024
                'id_tuteur' => 2,
                'fichier_path' => 'docs/31K9UcAlCcAdPkGCxLCRObViyAZGqTs87QrbEylg.pdf',
                'prix' => 1500,
                'approuve' => true,
                'telechargements' => 15,
                'created_at' => now(),
            ],
            [
                'id_sujet' => 3, // Sujet Informatique - Algorithmique
                'id_tuteur' => 3,
                'fichier_path' => 'docs/FtqC8K85AnmSaVU9sD0o1frZMqUeOC1B4a9wUqK4.pdf',
                'prix' => 2000,
                'approuve' => true,
                'telechargements' => 30,
                'created_at' => now(),
            ],
            [
                'id_sujet' => 4, // Sujet Informatique 2024
                'id_tuteur' => 1,
                'fichier_path' => 'docs/YhR7Bv2WxKpMnL9QsE4TuI6OjN3CmD8FaZ5XvG1.pdf',
                'prix' => 1200,
                'approuve' => true,
                'telechargements' => 18,
                'created_at' => now(),
            ],
            [
                'id_sujet' => 5, // Sujet Chimie Organique 2024
                'id_tuteur' => 2,
                'fichier_path' => 'docs/Kp9Nv4Rx2WmLj8Zt5Qs3Hy6Bf1Cg7Vd9En0Ua.pdf',
                'prix' => 1800,
                'approuve' => true,
                'telechargements' => 22,
                'created_at' => now(),
            ]
        ];
        DB::table('corriges_examen')->insert($corriges);
    }
} 