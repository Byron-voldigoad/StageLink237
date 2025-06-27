<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypesSujetsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $types = [
            [
                'nom' => 'Sujet d\'examen',
                'description' => 'Sujet d\'examen original'
            ],
            [
                'nom' => 'Corrigé',
                'description' => 'Corrigé d\'un sujet d\'examen'
            ],
            [
                'nom' => 'Exercices',
                'description' => 'Série d\'exercices'
            ],
            [
                'nom' => 'Cours',
                'description' => 'Support de cours'
            ]
        ];

        foreach ($types as $type) {
            DB::table('types_sujets')->insert($type);
        }
    }
} 