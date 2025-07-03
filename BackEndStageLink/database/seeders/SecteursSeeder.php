<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SecteursSeeder extends Seeder
{
    public function run()
    {
        $secteurs = [
            'Développement web',
            'Développement mobile',
            'Design UI/UX',
            'Data Science',
            'Cloud Computing',
            'Gestion de projet',
            'Cybersécurité',
            'Intelligence Artificielle',
            'Marketing Digital',
            'Ressources Humaines',
            'Finance',
            'Autre'
        ];
        foreach ($secteurs as $secteur) {
            DB::table('secteurs')->insert([
                'nom' => $secteur,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
} 