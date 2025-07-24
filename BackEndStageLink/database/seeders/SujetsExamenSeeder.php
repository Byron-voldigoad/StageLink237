<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\SujetExamen;

class SujetsExamenSeeder extends Seeder
{
    public function run()
    {
        $matieres = \App\Models\Matiere::all();
        $niveaux = \App\Models\Niveau::all();
        $annees = \App\Models\AnneeAcademique::all();
        $tuteurs = \App\Models\Utilisateur::whereHas('roles', function($q) {
            $q->where('nom_role', 'tuteur');
        })->get();

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
                'fichier_path' => 'docs/8akqcXmjXIdANE1MKfkEaxm2F7Lh5pOJ1yr3fdK1.pdf',
                'created_at' => now(),
            ],
            [
                'titre' => 'Sujet Physique Avancée 2024',
                'id_matiere' => 2,
                'id_niveau' => 13, // Bac+4
                'id_annee' => 3,
                'fichier_path' => 'docs/31K9UcAlCcAdPkGCxLCRObViyAZGqTs87QrbEylg.pdf',
                'est_gratuit' => false,
                'prix' => 1500,
                'id_upload_par' => 2,
                'approuve' => true,
                'telechargements' => 25,
                'created_at' => now(),
            ],
            [
                'titre' => 'Sujet Informatique - Algorithmique',
                'id_matiere' => 5,
                'id_niveau' => 11, // Bac+2
                'id_annee' => 3,
                'fichier_path' => 'docs/FtqC8K85AnmSaVU9sD0o1frZMqUeOC1B4a9wUqK4.pdf',
                'est_gratuit' => false,
                'prix' => 2000,
                'id_upload_par' => 3,
                'approuve' => true,
                'telechargements' => 15,
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