<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tutorat;
use App\Models\ProfilTuteur;
use App\Models\CandidatureTutorat;
use App\Models\SeanceTutorat;
use App\Models\ProfilEtudiant;
use App\Models\Matiere;
use App\Models\Niveau;

class TutoratSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Récupérer les données nécessaires
        $tuteurs = ProfilTuteur::all();
        $etudiants = ProfilEtudiant::all();
        $matieres = Matiere::all();
        $niveaux = Niveau::all();

        // Vérifier les prérequis
        if ($tuteurs->isEmpty() || $etudiants->isEmpty() || $matieres->isEmpty() || $niveaux->isEmpty()) {
            $this->command->warn('Données manquantes. Assurez-vous d\'avoir exécuté les seeders pour les tuteurs, étudiants, matières et niveaux.');
            return;
        }

        $villes = [
            'Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 
            'Garoua', 'Maroua', 'Buea', 'Limbé', 'Kribi'
        ];

        $methodes = [
            'Cours particuliers avec exercices pratiques',
            'Apprentissage par projet',
            'Méthode interactive avec supports multimédias',
            'Exercices progressifs et corrections détaillées',
            'Approche pratique basée sur des cas concrets'
        ];

        // Créer des tutorats variés
        foreach ($tuteurs as $tuteur) {
            // Créer 2-4 tutorats par tuteur
            $nbTutorats = rand(2, 4);
            for ($i = 0; $i < $nbTutorats; $i++) {
                $matiere = $matieres->random();
                $niveau = $niveaux->random();
                $dateDebut = now()->addDays(rand(1, 30));
                
                $tutorat = Tutorat::create([
                    'titre' => $matiere->nom . ' - ' . $niveau->nom,
                    'description' => 'Formation approfondie en ' . $matiere->nom . ' pour les étudiants de niveau ' . $niveau->nom,
                    'domaine' => $matiere->nom,
                    'niveau' => $niveau->nom,
                    'date_debut' => $dateDebut,
                    'date_fin' => $dateDebut->copy()->addMonths(rand(1, 3)),
                    'tuteur_id' => $tuteur->id_tuteur,
                    'localisation' => 'En ligne',
                    'statut' => ['ouverte', 'pourvue', 'ouverte'][rand(0, 2)],
                    'tarif_horaire' => rand(15, 50) * 1000,
                    'duree_seance' => [60, 90, 120][array_rand([60, 90, 120])],
                    'nombre_seances' => rand(8, 15),
                    'prerequis' => 'Niveau ' . ($niveau->id_niveau - 1) . ' ou équivalent',
                    'objectifs' => "Maîtriser les concepts fondamentaux\nRéussir les examens\nAcquérir une méthodologie efficace",
                    'methode_pedagogique' => $methodes[array_rand($methodes)],
                    'created_at' => now()
                ]);

                // Ajouter des candidatures si le tutorat est ouvert
                if ($tutorat->statut === 'ouverte') {
                    $nbCandidatures = rand(2, 5);
                    $candidats = $etudiants->random($nbCandidatures);
                    
                    foreach ($candidats as $etudiant) {
                        CandidatureTutorat::create([
                            'tutorat_id' => $tutorat->id_tutorat,
                            'etudiant_id' => $etudiant->id_etudiant,
                            'statut' => ['en_attente', 'acceptee', 'refusee'][rand(0, 2)],
                            'message_motivation' => 'Je souhaite participer à ce tutorat pour approfondir mes connaissances.',
                            'cv_path' => $etudiant->cv_path ?? ('candidatures/cv/' . md5(uniqid()) . '.pdf'),
                            'date_candidature' => now()->subDays(rand(1, 10))
                        ]);
                    }
                }

                // Créer des séances pour les tutorats pourvus
                if ($tutorat->statut === 'pourvue') {
                    $nbSeances = rand(3, 8);
                    for ($k = 0; $k < $nbSeances; $k++) {
                        $dateSeance = $dateDebut->copy()->addDays($k * 7); // Une séance par semaine
                        $heureDebut = ['08:00', '10:00', '14:00', '16:00'][array_rand(['08:00', '10:00', '14:00', '16:00'])];
                        $heureFin = date('H:i', strtotime($heureDebut) + $tutorat->duree_seance * 60);

                        SeanceTutorat::create([
                            'tutorat_id' => $tutorat->id_tutorat,
                            'date_seance' => $dateSeance->format('Y-m-d'),
                            'heure_debut' => $heureDebut,
                            'heure_fin' => $heureFin,
                            'lieu' => rand(0, 1) ? $villes[array_rand($villes)] . ' - Salle ' . rand(1, 20) : 'En ligne',
                            'mode' => ['presentiel', 'en_ligne', 'hybride'][array_rand(['presentiel', 'en_ligne', 'hybride'])],
                            'statut' => $dateSeance->isPast() ? 'terminee' : 'planifiee',
                            'notes_tuteur' => rand(0, 1) ? 'Points importants discutés. Progrès satisfaisants.' : null,
                            'materiel_requis' => rand(0, 1) ? 'Calculatrice, cahier, ordinateur portable' : null
                        ]);
                    }
                }
            }
        }

        // Créer des tutorats supplémentaires pour assurer une bonne diversité
        foreach ($matieres as $matiere) {
            $nbTutoratsParMatiere = rand(2, 4);
            for ($i = 0; $i < $nbTutoratsParMatiere; $i++) {
                $tuteur = $tuteurs->random();
                $niveau = $niveaux->random();
                $dateDebut = now()->addDays(rand(1, 30));
                $dateFin = $dateDebut->copy()->addMonths(rand(1, 3));

                $tutorat = Tutorat::create([
                    'titre' => 'Tutorat ' . $matiere->nom . ' - ' . $niveau->nom,
                    'description' => 'Description détaillée du tutorat ' . $i . '. Ce tutorat vise à améliorer les compétences des étudiants dans le domaine de ' . $matiere->nom . ' au niveau ' . $niveau->nom . '.',
                    'domaine' => $matiere->nom,
                    'niveau' => $niveau->nom,
                    'date_debut' => $dateDebut,
                    'date_fin' => $dateFin,
                    'tuteur_id' => $tuteur->id_tuteur,
                    'localisation' => rand(0, 1) ? $villes[array_rand($villes)] : 'En ligne',
                    'statut' => ['ouverte', 'pourvue', 'cloturee'][array_rand(['ouverte', 'pourvue', 'cloturee'])],
                'tarif_horaire' => rand(15, 50) * 1000,
                'duree_seance' => [60, 90, 120][array_rand([60, 90, 120])],
                'nombre_seances' => rand(5, 20),
                'prerequis' => rand(0, 1) ? 'Connaissances de base requises dans le domaine de ' . $matiere->nom . '.' : null,
                'objectifs' => 'À la fin de ce tutorat, l\'étudiant sera capable de maîtriser les concepts fondamentaux de ' . $matiere->nom . ' et d\'appliquer ses connaissances.',
                'methode_pedagogique' => 'Approche personnalisée avec exercices pratiques et suivi individualisé.'
            ]);

            // Créer des candidatures pour certains tutorats
            if ($tutorat->statut === 'ouverte' && rand(0, 1)) {
                $nbCandidatures = min(rand(1, 5), $etudiants->count());
                $etudiantsCandidats = $etudiants->random($nbCandidatures);
                foreach ($etudiantsCandidats as $etudiant) {
                    $candidatureStatut = ['en_attente', 'acceptee', 'refusee'][array_rand(['en_attente', 'acceptee', 'refusee'])];
                    CandidatureTutorat::create([
                        'tutorat_id' => $tutorat->id_tutorat,
                        'etudiant_id' => $etudiant->id_etudiant,
                        'statut' => $candidatureStatut,
                        'message_motivation' => 'Je suis très motivé pour suivre ce tutorat car il correspond parfaitement à mes objectifs académiques et professionnels.',
                        'date_candidature' => now()->subDays(rand(1, 30))
                    ]);
                }
            }

            // Créer des séances pour les tutorats pourvus
            if ($tutorat->statut === 'pourvue') {
                $nbSeances = rand(3, 8);
                for ($k = 0; $k < $nbSeances; $k++) {
                    $dateSeance = $dateDebut->copy()->addDays($k * 7); // Une séance par semaine
                    $heureDebut = ['08:00', '10:00', '14:00', '16:00'][array_rand(['08:00', '10:00', '14:00', '16:00'])];
                    $heureFin = date('H:i', strtotime($heureDebut) + $tutorat->duree_seance * 60);

                    SeanceTutorat::create([
                        'tutorat_id' => $tutorat->id_tutorat,
                        'date_seance' => $dateSeance->format('Y-m-d'),
                        'heure_debut' => $heureDebut,
                        'heure_fin' => $heureFin,
                        'lieu' => rand(0, 1) ? $villes[array_rand($villes)] . ' - Salle ' . rand(1, 20) : 'En ligne',
                        'mode' => ['presentiel', 'en_ligne', 'hybride'][array_rand(['presentiel', 'en_ligne', 'hybride'])],
                        'statut' => $dateSeance->isPast() ? 'terminee' : 'planifiee',
                        'notes_tuteur' => rand(0, 1) ? 'Notes du tuteur pour cette séance.' : null,
                        'materiel_requis' => rand(0, 1) ? 'Calculatrice, cahier, stylos' : null
                    ]);
                }
            }
        }
    }

        $this->command->info('Tutorats créés avec succès ! Total créé : ' . Tutorat::count());
    }
} 