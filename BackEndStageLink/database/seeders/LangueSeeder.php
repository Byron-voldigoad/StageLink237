<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LangueSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('langues')->insert([
            ['nom' => 'Français', 'code' => 'fr'],
            ['nom' => 'Anglais', 'code' => 'en'],
            ['nom' => 'Espagnol', 'code' => 'es'],
            ['nom' => 'Allemand', 'code' => 'de'],
            ['nom' => 'Arabe', 'code' => 'ar'],
        ]);
    }
}
