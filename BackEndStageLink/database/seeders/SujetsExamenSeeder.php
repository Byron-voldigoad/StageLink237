<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\SujetExamen;

class SujetsExamenSeeder extends Seeder
{
    public function run()
    {
        // On suppose que les IDs 1 existent pour chaque entité (matiere, niveau, annee, utilisateur)
        $sujets = [
            [
                'titre' => 'Sujet Mathématiques 2023',
                'id_matiere' => 1,
                'id_niveau' => 1,
                'id_annee' => 2,
                'fichier_path' => 'sujets/maths_2023.pdf',
                'est_gratuit' => true,
                'prix' => 0,
                'id_upload_par' => 1,
                'approuve' => true,
                'telechargements' => 10,
                'created_at' => now(),
            ],
            [
                'titre' => 'Sujet Physique 2024',
                'id_matiere' => 2,
                'id_niveau' => 2,
                'id_annee' => 3,
                'fichier_path' => 'sujets/physique_2024.pdf',
                'est_gratuit' => false,
                'prix' => 500,
                'id_upload_par' => 2,
                'approuve' => false,
                'telechargements' => 2,
                'created_at' => now(),
            ],
            [
                'titre' => 'Sujet Informatique 2024',
                'id_matiere' => 6,
                'id_niveau' => 3,
                'id_annee' => 3,
                'fichier_path' => 'sujets/info_2024.pdf',
                'est_gratuit' => false,
                'prix' => 1000,
                'id_upload_par' => 1,
                'approuve' => true,
                'telechargements' => 5,
                'created_at' => now(),
            ],
        ];
        DB::table('sujets_examen')->insert($sujets);
    }
} 