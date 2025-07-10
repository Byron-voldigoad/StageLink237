<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Utilisateur;
use App\Models\UtilisateurRole;
use App\Models\Entreprise;
use Illuminate\Support\Facades\Hash;

class RolesAndAdminSeeder extends Seeder
{
    public function run()
    {
        // 1. Créer les rôles admin et entreprise si absents
        $roleAdmin = Role::firstOrCreate(['nom_role' => 'admin'], ['description_role' => 'Administrateur']);
        $roleEntreprise = Role::firstOrCreate(['nom_role' => 'entreprise'], ['description_role' => 'Compte entreprise']);

        // 2. Créer un utilisateur admin si absent
        $adminEmail = 'admin@stagelink.com';
        $admin = Utilisateur::firstOrCreate(
            ['email' => $adminEmail],
            [
                'nom' => 'Admin',
                'prenom' => 'Super',
                'mot_de_passe' => Hash::make('admin1234'),
            ]
        );
        UtilisateurRole::firstOrCreate([
            'utilisateur_id' => $admin->id_utilisateur,
            'role_id' => $roleAdmin->id_role
        ]);

        // 3. Pour chaque entreprise, créer un utilisateur associé si besoin
        $entreprises = Entreprise::all();
        foreach ($entreprises as $entreprise) {
            // On utilise l'email de l'entreprise pour créer le compte
            $email = $entreprise->email ?? ($entreprise->nom ? strtolower(str_replace(' ', '', $entreprise->nom)).'@entreprise.com' : null);
            if (!$email) continue;
            $utilisateur = Utilisateur::firstOrCreate(
                ['email' => $email],
                [
                    'nom' => $entreprise->nom,
                    'prenom' => 'Responsable',
                    'mot_de_passe' => Hash::make('entreprise1234'),
                ]
            );
            UtilisateurRole::firstOrCreate([
                'utilisateur_id' => $utilisateur->id_utilisateur,
                'role_id' => $roleEntreprise->id_role
            ]);
            // Lier l'entreprise à ce compte si ce n'est pas déjà fait
            if (!$entreprise->id_utilisateur) {
                $entreprise->id_utilisateur = $utilisateur->id_utilisateur;
                $entreprise->save();
            }
        }
    }
} 