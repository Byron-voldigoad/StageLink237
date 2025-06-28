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
        // Récupérer quelques tuteurs existants
        $tuteurs = ProfilTuteur::take(5)->get();
        $etudiants = ProfilEtudiant::take(10)->get();
        $matieres = Matiere::all();
        $niveaux = Niveau::all();

        if ($tuteurs->isEmpty()) {
            $this->command->warn('Aucun tuteur trouvé. Créez d\'abord des tuteurs.');
            return;
        }

        if ($matieres->isEmpty()) {
            $this->command->warn('Aucune matière trouvée. Exécutez d\'abord le seeder des matières.');
            return;
        }

        if ($niveaux->isEmpty()) {
            $this->command->warn('Aucun niveau trouvé. Exécutez d\'abord le seeder des niveaux.');
            return;
        }

        $statuts = ['ouverte', 'pourvue', 'cloturee'];

        // Créer des tutorats
        for ($i = 1; $i <= 20; $i++) {
            $tuteur = $tuteurs->random();
            $matiere = $matieres->random();
            $niveau = $niveaux->random();
            $dateDebut = now()->addDays(rand(1, 30));
            $dateFin = $dateDebut->copy()->addDays(rand(7, 90));

            $tutorat = Tutorat::create([
                'titre' => 'Tutorat ' . $matiere->nom . ' - ' . $niveau->nom,
                'description' => 'Description détaillée du tutorat ' . $i . '. Ce tutorat vise à améliorer les compétences des étudiants dans le domaine de ' . $matiere->nom . ' au niveau ' . $niveau->nom . '.',
                'domaine' => $matiere->nom,
                'niveau' => $niveau->nom,
                'date_debut' => $dateDebut,
                'date_fin' => $dateFin,
                'tuteur_id' => $tuteur->id_tuteur,
                'localisation' => rand(0, 1) ? ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux'][array_rand(['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux'])] : null,
                'statut' => $statuts[array_rand($statuts)],
                'tarif_horaire' => rand(15, 50),
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
                    $dateSeance = $dateDebut->copy()->addDays(rand(0, 60));
                    $heureDebut = ['09:00', '14:00', '16:00', '18:00'][array_rand(['09:00', '14:00', '16:00', '18:00'])];
                    $heureFin = date('H:i', strtotime($heureDebut) + 3600); // +1 heure

                    SeanceTutorat::create([
                        'tutorat_id' => $tutorat->id_tutorat,
                        'date_seance' => $dateSeance->format('Y-m-d'),
                        'heure_debut' => $heureDebut,
                        'heure_fin' => $heureFin,
                        'lieu' => rand(0, 1) ? 'Salle ' . rand(1, 20) : 'En ligne',
                        'mode' => ['presentiel', 'en_ligne', 'hybride'][array_rand(['presentiel', 'en_ligne', 'hybride'])],
                        'statut' => ['planifiee', 'terminee'][array_rand(['planifiee', 'terminee'])],
                        'notes_tuteur' => rand(0, 1) ? 'Notes du tuteur pour cette séance.' : null,
                        'materiel_requis' => rand(0, 1) ? 'Calculatrice, cahier, stylos' : null
                    ]);
                }
            }
        }

        $this->command->info('Tutorats créés avec succès !');
    }
} 