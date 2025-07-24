<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProfilTuteur;
use App\Models\ProfilEtudiant;
use App\Models\Utilisateur;
use App\Models\UtilisateurRole;
use App\Models\Role;
use App\Models\Entreprise;
use Illuminate\Support\Facades\Hash;

class ProfilsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Créer des rôles si ils n'existent pas
        $roleTuteur = Role::firstOrCreate(['nom_role' => 'tuteur']);
        $roleEtudiant = Role::firstOrCreate(['nom_role' => 'etudiant']);
        $roleEntreprise = Role::firstOrCreate(['nom_role' => 'entreprise']);

        // Créer des utilisateurs pour les entreprises
        $entreprises = [
            [
                'nom' => 'TechInnovate',
                'prenom' => 'Admin',
                'email' => 'contact@techinnovate.com',
                'telephone' => '+237 677889900',
                'description' => 'Entreprise spécialisée en développement web et mobile',
                'secteur' => 'developpement_web',
                'adresse' => 'Douala, Akwa',
                'site_web' => 'www.techinnovate.com'
            ],
            [
                'nom' => 'DataMasters',
                'prenom' => 'Admin',
                'email' => 'recrutement@datamasters.cm',
                'telephone' => '+237 699112233',
                'description' => 'Cabinet de conseil en Data Science et IA',
                'secteur' => 'data_science',
                'adresse' => 'Yaoundé, Bastos',
                'site_web' => 'www.datamasters.cm'
            ],
            [
                'nom' => 'CyberSecure',
                'prenom' => 'Admin',
                'email' => 'stages@cybersecure.cm',
                'telephone' => '+237 655443322',
                'description' => 'Leader en cybersécurité au Cameroun',
                'secteur' => 'cybersecurite',
                'adresse' => 'Douala, Bonanjo',
                'site_web' => 'www.cybersecure.cm'
            ]
        ];

        foreach ($entreprises as $entrepriseData) {
            // Créer l'utilisateur
            $utilisateur = Utilisateur::firstOrCreate(
                ['email' => $entrepriseData['email']],
                [
                    'nom' => $entrepriseData['nom'],
                    'prenom' => $entrepriseData['prenom'],
                    'telephone' => $entrepriseData['telephone'],
                    'mot_de_passe' => Hash::make('password')
                ]
            );

            // Créer l'entreprise
            $entreprise = Entreprise::firstOrCreate(
                ['email' => $entrepriseData['email']],
                [
                    'nom' => $entrepriseData['nom'],
                    'description' => $entrepriseData['description'],
                    'secteur' => $entrepriseData['secteur'],
                    'telephone' => $entrepriseData['telephone'],
                    'adresse' => $entrepriseData['adresse'],
                    'site_web' => $entrepriseData['site_web'],
                    'id_utilisateur' => $utilisateur->id_utilisateur
                ]
            );

            // Assigner le rôle entreprise
            UtilisateurRole::firstOrCreate(
                [
                    'utilisateur_id' => $utilisateur->id_utilisateur,
                    'role_id' => $roleEntreprise->id_role
                ]
            );
        }

        // Créer des utilisateurs et profils de tuteurs
        $tuteurs = [
            [
                'nom' => 'Dupont',
                'prenom' => 'Jean',
                'email' => 'jean.dupont@stagelink.com',
                'experience_annees' => 10,
                'photo' => 'photos/1753208226_687fd5a24ae0b.png',
                'tarif_horaire' => 35000,
                'telephone' => '+237 699887766'
            ],
            [
                'nom' => 'Martin',
                'prenom' => 'Sophie',
                'email' => 'sophie.martin@stagelink.com',
                'experience_annees' => 8,
                'photo' => 'photos/1753206414_687fce8e0fdf5.png',
                'tarif_horaire' => 30000,
                'telephone' => '+237 677889900'
            ],
            [
                'nom' => 'Dubois',
                'prenom' => 'Pierre',
                'email' => 'pierre.dubois@stagelink.com',
                'experience_annees' => 12,
                'photo' => 'photos/1753057138_687d8772125ee.png',
                'tarif_horaire' => 40000,
                'telephone' => '+237 655443322'
            ],
            [
                'nom' => 'Robert',
                'prenom' => 'Marie',
                'email' => 'marie.robert@stagelink.com',
                'experience_annees' => 7,
                'photo' => 'photos/1753208227_687fd5a24ae0c.png',
                'tarif_horaire' => 28000,
                'telephone' => '+237 699112233'
            ],
            [
                'nom' => 'Leroy',
                'prenom' => 'Thomas',
                'email' => 'thomas.leroy@stagelink.com',
                'experience_annees' => 9,
                'photo' => 'photos/1753208228_687fd5a24ae0d.png',
                'tarif_horaire' => 32000,
                'telephone' => '+237 677445566'
            ]
        ];

        foreach ($tuteurs as $tuteurData) {
            // Créer ou retrouver l'utilisateur
            $utilisateur = Utilisateur::firstOrCreate(
                ['email' => $tuteurData['email']],
                [
                    'nom' => $tuteurData['nom'],
                    'prenom' => $tuteurData['prenom'],
                    'photo' => $tuteurData['photo'],
                    'telephone' => $tuteurData['telephone'],
                    'mot_de_passe' => bcrypt('password')
                ]
            );

            // Créer ou retrouver le profil tuteur
            $tuteur = ProfilTuteur::firstOrCreate(
                ['utilisateur_id' => $utilisateur->id_utilisateur],
                [
                    'experience_annees' => $tuteurData['experience_annees'],
                    'tarif_horaire' => $tuteurData['tarif_horaire'],
                    'disponibilite' => 'Lundi au Samedi',
                    'bio' => 'Tuteur expérimenté spécialisé dans l\'enseignement personnalisé',
                    'specialites' => json_encode(['Mathématiques', 'Physique', 'Informatique'])
                ]
            );

            // Assigner le rôle tuteur
            UtilisateurRole::firstOrCreate([
                'utilisateur_id' => $utilisateur->id_utilisateur,
                'role_id' => $roleTuteur->id_role
            ]);
        }

        // Créer des utilisateurs et profils d'étudiants
        $etudiants = [
            [
                'nom' => 'Tagne',
                'prenom' => 'Alice',
                'email' => 'alice.tagne@stagelink.com',
                'telephone' => '+237 691234567',
                'niveau_etude' => 'Bac+3',
                'etablissement' => 'Université de Douala',
                'specialite' => 'Informatique',
                'photo' => 'photos/1753208226_687fd5a24ae0b.png',
                'cv_path' => 'candidatures/cv/eZWKKuJcOLFLHXU6ddJf4ZoBeveHyphG1RongXlT.pdf'
            ],
            [
                'nom' => 'Nkeng',
                'prenom' => 'Lucas',
                'email' => 'lucas.nkeng@stagelink.com',
                'telephone' => '+237 697654321',
                'niveau_etude' => 'Bac+4',
                'etablissement' => 'ENSPY',
                'specialite' => 'Génie Informatique',
                'photo' => 'photos/1753206414_687fce8e0fdf5.png',
                'cv_path' => 'candidatures/cv/26wRrzfX5gAJvPjBu0fnvECKDm1F4A70aY6P4NPJ.pdf'
            ],
            [
                'nom' => 'Moumie',
                'prenom' => 'Emma',
                'email' => 'emma.moumie@stagelink.com',
                'telephone' => '+237 698765432',
                'niveau_etude' => 'Master 2',
                'etablissement' => 'Université de Yaoundé I',
                'specialite' => 'Data Science',
                'photo' => 'photos/1753057138_687d8772125ee.png',
                'cv_path' => 'candidatures/cv/KQMltoNy0IRggZk9rOanXvhaZaTpY4j1LdzCF0CN.pdf'
            ],
            [
                'nom' => 'Ngono',
                'prenom' => 'David',
                'email' => 'david.ngono@stagelink.com',
                'telephone' => '+237 691122334',
                'niveau_etude' => 'Bac+2',
                'etablissement' => 'IUT de Douala',
                'specialite' => 'Réseaux et Télécommunications',
                'photo' => 'photos/1753208226_687fd5a24ae0b.png',
                'cv_path' => 'candidatures/cv/eZWKKuJcOLFLHXU6ddJf4ZoBeveHyphG1RongXlT.pdf'
            ],
            [
                'nom' => 'Simo',
                'prenom' => 'Julie',
                'email' => 'julie.simo@stagelink.com',
                'telephone' => '+237 697788990',
                'niveau_etude' => 'Bac+5',
                'etablissement' => 'IAI Cameroun',
                'specialite' => 'Intelligence Artificielle',
                'photo' => 'photos/1753206414_687fce8e0fdf5.png',
                'cv_path' => 'candidatures/cv/26wRrzfX5gAJvPjBu0fnvECKDm1F4A70aY6P4NPJ.pdf'
            ],
            [
                'nom' => 'Simon',
                'prenom' => 'Hugo',
                'email' => 'hugo.simon@stagelink.com',
                'telephone' => '+237 690112233',
                'niveau_etude' => 'Bac+3',
                'etablissement' => 'École d\'Ingénieurs',
                'specialite' => 'Génie Mécanique',
                'photo' => 'photos/1753208229_687fd5a24ae0e.png',
                'cv_path' => 'candidatures/cv/Nw8XpJk2Vy5Lm7Rt4Qs9Hb3Cf6Vg1Zn0Ua.pdf'
            ],
            [
                'nom' => 'Michel',
                'prenom' => 'Léa',
                'email' => 'lea.michel@stagelink.com',
                'telephone' => '+237 695667788',
                'niveau_etude' => 'Bac+4',
                'etablissement' => 'Université de Douala',
                'specialite' => 'Sciences Économiques',
                'photo' => 'photos/1753208230_687fd5a24ae0f.png',
                'cv_path' => 'candidatures/cv/Bv4Np7Kx2Wm9Jt5Qs3Hy6Cf1Vg8En0Ua.pdf'
            ]
        ];

        foreach ($etudiants as $etudiantData) {
            // Créer ou retrouver l'utilisateur
            $utilisateur = Utilisateur::firstOrCreate(
                ['email' => $etudiantData['email']],
                [
                    'nom' => $etudiantData['nom'],
                    'prenom' => $etudiantData['prenom'],
                    'mot_de_passe' => bcrypt('password'),
                    'telephone' => $etudiantData['telephone'],
                    'photo' => $etudiantData['photo']
                ]
            );

            // Créer ou retrouver le profil étudiant avec uniquement les champs existants
            $etudiant = ProfilEtudiant::firstOrCreate(
                ['utilisateur_id' => $utilisateur->id_utilisateur],
                [
                    'niveau_etude' => $etudiantData['niveau_etude'],
                    'etablissement' => $etudiantData['etablissement'],
                    'specialite' => $etudiantData['specialite'],
                    'objectifs' => 'Améliorer mes compétences et réussir mes études',
                    'adresse' => $etudiantData['adresse'] ?? 'Douala, Cameroun',
                    'cv_path' => $etudiantData['cv_path'],
                    'photo_profil' => $etudiantData['photo'],
                    'credits' => rand(0, 1000)
                ]
            );

            // Assigner le rôle si pas déjà fait
            UtilisateurRole::firstOrCreate([
                'utilisateur_id' => $utilisateur->id_utilisateur,
                'role_id' => $roleEtudiant->id_role
            ]);
        }

        $this->command->info('Profils de tuteurs et étudiants créés avec succès !');
    }
} 