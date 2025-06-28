<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Niveau;

class niveauxSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $niveaux = [
            '6ème',
            '5ème',
            '4ème',
            '3ème',
            'Seconde',
            'Première',
            'Terminale',
            'Bac',
            'Bac+1',
            'Bac+2',
            'Bac+3',
            'Bac+4',
            'Bac+5',
            'Master 1',
            'Master 2',
            'Doctorat'
        ];

        foreach ($niveaux as $niveau) {
            Niveau::create([
                'nom' => $niveau,
                'description' => 'Niveau ' . $niveau
            ]);
        }

        $this->command->info('Niveaux créés avec succès !');
    }
}
