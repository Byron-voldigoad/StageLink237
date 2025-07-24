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
        // 1. Créer tous les rôles nécessaires
        $roleAdmin = Role::firstOrCreate(['nom_role' => 'admin'], ['description_role' => 'Administrateur du système']);
        $roleEntreprise = Role::firstOrCreate(['nom_role' => 'entreprise'], ['description_role' => 'Compte entreprise']);
        $roleTuteur = Role::firstOrCreate(['nom_role' => 'tuteur'], ['description_role' => 'Tuteur académique']);
        $roleEtudiant = Role::firstOrCreate(['nom_role' => 'etudiant'], ['description_role' => 'Étudiant']);

        // 2. Créer les administrateurs
        $admins = [
            [
                'nom' => 'Admin',
                'prenom' => 'Principal',
                'email' => 'admin@stagelink.com',
                'photo' => 'photos/1753208226_687fd5a24ae0b.png',
                'telephone' => '+237 699999999'
            ],
            [
                'nom' => 'Administrateur',
                'prenom' => 'Système',
                'email' => 'system@stagelink.com',
                'photo' => 'photos/1753206414_687fce8e0fdf5.png',
                'telephone' => '+237 677777777'
            ],
            [
                'nom' => 'Support',
                'prenom' => 'Technique',
                'email' => 'support@stagelink.com',
                'photo' => 'photos/1753057138_687d8772125ee.png',
                'telephone' => '+237 688888888'
            ]
        ];

        foreach ($admins as $adminData) {
            $admin = Utilisateur::firstOrCreate(
                ['email' => $adminData['email']],
                [
                    'nom' => $adminData['nom'],
                    'prenom' => $adminData['prenom'],
                    'mot_de_passe' => Hash::make('StageLink2024!'),
                    'telephone' => $adminData['telephone'],
                    'photo' => $adminData['photo'],
                    'email_verified_at' => now()
                ]
            );
            
            // Attribution du rôle admin
            UtilisateurRole::firstOrCreate([
                'utilisateur_id' => $admin->id_utilisateur,
                'role_id' => $roleAdmin->id_role
            ]);
        }

        // 3. Pour chaque entreprise, créer un utilisateur associé si besoin
        $entreprises = Entreprise::all();
        foreach ($entreprises as $entreprise) {
            // On utilise l'email de l'entreprise pour créer le compte
            $email = $entreprise->email ?? ($entreprise->nom ? strtolower(str_replace(' ', '', $entreprise->nom)).'@stagelink.com' : null);
            if (!$email) continue;

            $utilisateur = Utilisateur::firstOrCreate(
                ['email' => $email],
                [
                    'nom' => $entreprise->nom,
                    'prenom' => 'Responsable',
                    'mot_de_passe' => Hash::make('Entreprise2024!'),
                    'telephone' => '+237 6' . rand(10000000, 99999999),
                    'photo' => 'photos/entreprise_' . rand(1000, 9999) . '.png',
                    'email_verified_at' => now()
                ]
            );

            // Attribution du rôle entreprise
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

        $this->command->info('Rôles et administrateurs créés avec succès !');
    }
} 