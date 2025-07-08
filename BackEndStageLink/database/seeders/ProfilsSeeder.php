<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProfilTuteur;
use App\Models\ProfilEtudiant;
use App\Models\Utilisateur;
use App\Models\UtilisateurRole;
use App\Models\Role;

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

        // Créer des utilisateurs et profils de tuteurs
        $tuteurs = [
            [
                'nom' => 'Dupont',
                'prenom' => 'Jean',
                'email' => 'jean.dupont@example.com',
                'telephone' => '0123456789',
                'bio' => 'Professeur de mathématiques avec 10 ans d\'expérience',
                'specialites' => 'Mathématiques, Physique',
                'tarif_horaire' => 25.00
            ],
            [
                'nom' => 'Martin',
                'prenom' => 'Marie',
                'email' => 'marie.martin@example.com',
                'telephone' => '0987654321',
                'bio' => 'Enseignante en français et littérature',
                'specialites' => 'Français, Littérature',
                'tarif_horaire' => 20.00
            ],
            [
                'nom' => 'Bernard',
                'prenom' => 'Pierre',
                'email' => 'pierre.bernard@example.com',
                'telephone' => '0555666777',
                'bio' => 'Ingénieur en informatique, spécialisé en programmation',
                'specialites' => 'Informatique, Programmation',
                'tarif_horaire' => 30.00
            ],
            [
                'nom' => 'Petit',
                'prenom' => 'Sophie',
                'email' => 'sophie.petit@example.com',
                'telephone' => '0444333222',
                'bio' => 'Professeure d\'anglais native speaker',
                'specialites' => 'Anglais, Communication',
                'tarif_horaire' => 28.00
            ],
            [
                'nom' => 'Roux',
                'prenom' => 'Thomas',
                'email' => 'thomas.roux@example.com',
                'telephone' => '0333222111',
                'bio' => 'Docteur en physique, chercheur',
                'specialites' => 'Physique, Chimie',
                'tarif_horaire' => 35.00
            ]
        ];

        foreach ($tuteurs as $tuteurData) {
            // Créer ou retrouver l'utilisateur
            $utilisateur = Utilisateur::firstOrCreate(
                ['email' => $tuteurData['email']],
                [
                'nom' => $tuteurData['nom'],
                'prenom' => $tuteurData['prenom'],
                'mot_de_passe' => bcrypt('password'),
                'telephone' => $tuteurData['telephone']
                ]
            );

            // Créer ou retrouver le profil tuteur
            $tuteur = ProfilTuteur::firstOrCreate(
                ['utilisateur_id' => $utilisateur->id_utilisateur],
                [
                'bio' => $tuteurData['bio'],
                'specialites' => $tuteurData['specialites'],
                'tarif_horaire' => $tuteurData['tarif_horaire'],
                'experience_annees' => rand(2, 15),
                'diplomes' => 'Master, Doctorat',
                'methodes_pedagogiques' => 'Approche personnalisée, exercices pratiques'
                ]
            );

            // Assigner le rôle si pas déjà fait
            UtilisateurRole::firstOrCreate([
                'utilisateur_id' => $utilisateur->id_utilisateur,
                'role_id' => $roleTuteur->id_role
            ]);
        }

        // Créer des utilisateurs et profils d'étudiants
        $etudiants = [
            [
                'nom' => 'Durand',
                'prenom' => 'Alice',
                'email' => 'alice.durand@example.com',
                'telephone' => '0111222333',
                'niveau_etude' => 'Bac+2',
                'etablissement' => 'Université de Paris'
            ],
            [
                'nom' => 'Leroy',
                'prenom' => 'Lucas',
                'email' => 'lucas.leroy@example.com',
                'telephone' => '0222333444',
                'niveau_etude' => 'Terminale',
                'etablissement' => 'Lycée Victor Hugo'
            ],
            [
                'nom' => 'Moreau',
                'prenom' => 'Emma',
                'email' => 'emma.moreau@example.com',
                'telephone' => '0333444555',
                'niveau_etude' => 'Bac+1',
                'etablissement' => 'Université de Lyon'
            ],
            [
                'nom' => 'Simon',
                'prenom' => 'Hugo',
                'email' => 'hugo.simon@example.com',
                'telephone' => '0444555666',
                'niveau_etude' => 'Bac+3',
                'etablissement' => 'École d\'Ingénieurs'
            ],
            [
                'nom' => 'Michel',
                'prenom' => 'Léa',
                'email' => 'lea.michel@example.com',
                'telephone' => '0555666777',
                'niveau_etude' => 'Bac+4',
                'etablissement' => 'Université de Toulouse'
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
                    'telephone' => $etudiantData['telephone'] ?? null
                ]
            );

            // Créer ou retrouver le profil étudiant avec uniquement les champs existants
            $etudiant = ProfilEtudiant::firstOrCreate(
                ['utilisateur_id' => $utilisateur->id_utilisateur],
                [
                    'niveau_etude' => $etudiantData['niveau_etude'] ?? 'N/A',
                    'etablissement' => $etudiantData['etablissement'] ?? 'Etablissement inconnu',
                    'specialite' => $etudiantData['specialite'] ?? 'Informatique',
                    'objectifs' => 'Améliorer mes compétences en programmation',
                    'adresse' => $etudiantData['adresse'] ?? 'Adresse inconnue',
                    'cv_path' => null,
                    'photo_profil' => null,
                    'credits' => 0
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