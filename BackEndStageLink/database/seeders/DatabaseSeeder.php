<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Entreprise;
use App\Models\OffreStage;
use App\Models\ProfilEtudiant;
use App\Models\Message;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Reset foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        // Créer d'abord les tables de base et les rôles
        $this->call([
            RolesAndAdminSeeder::class,    // Crée les rôles et les admins
            SecteursSeeder::class,         // Crée les secteurs d'activité
            matieresSeeder::class,         // Crée les matières pour les tutorats
            NiveauxSeeder::class,          // Crée les niveaux d'études
            TypesSujetsSeeder::class,      // Crée les types de sujets d'examen
            LangueSeeder::class,           // Crée les langues
            anneesAcademiquesSeeder::class,// Crée les années académiques
            // Les tables avec les données principales
            ProfilsSeeder::class,          // Crée les tuteurs et étudiants
            SujetsExamenSeeder::class,     // Crée les sujets d'examen
            CorrigesExamenSeeder::class,   // Crée les corrigés
            TutoratSeeder::class,          // Crée les tutorats et candidatures
        ]);
        
        // Création des offres de stage
        $offres = [
            [
                'id_entreprise' => 1,
                'titre' => 'Stage Développeur Full-Stack',
                'description' => 'Stage de développement web avec React et Laravel',
                'exigences' => 'Connaissances en React, PHP, Laravel requises',
                'competences_requises' => 'JavaScript, PHP, SQL, Git',
                'duree' => '6 mois',
                'date_debut' => '2025-09-01',
                'date_fin' => '2026-02-28',
                'localisation' => 'Douala, Akwa',
                'remuneration' => 150000,
                'secteur' => 'developpement_web',
                'statut' => 'ouvert'
            ],
            [
                'id_entreprise' => 2,
                'titre' => 'Stage UX/UI Designer',
                'description' => 'Stage en design d\'interface utilisateur',
                'exigences' => 'Maîtrise de Figma et des principes de design UI/UX',
                'competences_requises' => 'UI Design, UX Research, Prototypage',
                'duree' => '4 mois',
                'date_debut' => '2025-09-01',
                'date_fin' => '2025-12-31',
                'localisation' => 'Yaoundé, Bastos',
                'remuneration' => 120000,
                'secteur' => 'design_ui_ux',
                'statut' => 'ouvert'
            ],
            [
                'id_entreprise' => 3,
                'titre' => 'Stage Data Scientist',
                'description' => 'Stage en analyse de données et machine learning',
                'exigences' => 'Python, statistiques, machine learning',
                'competences_requises' => 'Python, R, SQL, TensorFlow',
                'duree' => '6 mois',
                'date_debut' => '2025-09-15',
                'date_fin' => '2026-03-15',
                'localisation' => 'Douala, Bonanjo',
                'remuneration' => 200000,
                'secteur' => 'data_science',
                'statut' => 'ouvert'
            ]
        ];

        foreach ($offres as $offre) {
            OffreStage::create($offre);
        }

        // Création des candidatures
        $candidatures = [
            [
                'id_offre_stage' => 1,
                'id_etudiant' => 1,
                'cv_path' => 'candidatures/cv/eZWKKuJcOLFLHXU6ddJf4ZoBeveHyphG1RongXlT.pdf',
                'lettre_motivation_path' => 'candidatures/lettres/lettre_motivation_1.pdf',
                'message_motivation' => 'Très intéressé par le développement web et les nouvelles technologies.',
                'statut' => 'en_attente',
                'postule_le' => now(),
            ],
            [
                'id_offre_stage' => 2,
                'id_etudiant' => 2,
                'cv_path' => 'candidatures/cv/26wRrzfX5gAJvPjBu0fnvECKDm1F4A70aY6P4NPJ.pdf',
                'lettre_motivation_path' => 'candidatures/lettres/lettre_motivation_2.pdf',
                'message_motivation' => 'Passionné par le marketing digital et la communication.',
                'statut' => 'examine',
                'postule_le' => now()->subDays(5),
            ],
            [
                'id_offre_stage' => 3,
                'id_etudiant' => 3,
                'cv_path' => 'candidatures/cv/KQMltoNy0IRggZk9rOanXvhaZaTpY4j1LdzCF0CN.pdf',
                'lettre_motivation_path' => 'candidatures/lettres/lettre_motivation_3.pdf',
                'message_motivation' => 'Expert en analyse de données et apprentissage automatique.',
                'statut' => 'accepte',
                'postule_le' => now()->subDays(10),
            ]
        ];

        foreach ($candidatures as $candidature) {
            DB::table('candidatures')->insert($candidature);
        }

        // Reset foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        
        $this->command->info('Database seeding completed successfully!');
        
        // Création des entreprises avec leur secteurs d'activité
        $entreprises = [
            [
                'nom' => 'Tech Solutions',
                'adresse' => 'Carrefour Warda, Akwa, Douala',
                'quartier' => 'Akwa',
                'telephone' => '+237 691234567',
                'email' => 'contact@techsolutions.com',
                'description' => 'Entreprise leader en solutions technologiques',
                'secteur' => 'Développement web',
                'site_web' => 'https://techsolutions.cm',
                'logo_path' => 'photos/1753208226_687fd5a24ae0b.png',
                'nif' => 'M123456789',
                'verifie' => true,
                'latitude' => 4.0511,
                'longitude' => 9.7679
            ],
            [
                'nom' => 'Digital Agency',
                'adresse' => 'Boulevard de la Liberté, Bastos, Yaoundé',
                'quartier' => 'Bastos',
                'telephone' => '+237 697654321',
                'email' => 'info@digitalagency.com',
                'description' => 'Agence de marketing digital innovante',
                'secteur' => 'Marketing Digital',
                'site_web' => 'https://digitalagency.cm',
                'logo_path' => 'photos/1753206414_687fce8e0fdf5.png',
                'nif' => 'M987654321',
                'verifie' => true,
                'latitude' => 3.8680,
                'longitude' => 11.5121
            ],
            [
                'nom' => 'Green IT',
                'adresse' => 'Rue des Banques, Bonanjo, Douala',
                'quartier' => 'Bonanjo',
                'telephone' => '237 5555555555',
                'email' => 'contact@greenit.com',
                'description' => 'Solutions IT écologiques',
                'latitude' => 4.0411,
                'longitude' => 9.7579
            ],
            [
                'nom' => 'Data Analytics Corp',
                'adresse' => 'Quartier Hippodrome, Yaoundé',
                'quartier' => 'Hippodrome',
                'telephone' => '237 1111111111',
                'email' => 'info@dataanalytics.com',
                'description' => 'Expertise en analyse de données',
                'latitude' => 3.8480,
                'longitude' => 11.5021
            ],
            [
                'nom' => 'Web Masters',
                'adresse' => 'Rue du Commerce, Akwa, Douala',
                'quartier' => 'Akwa',
                'telephone' => '237 2222222222',
                'email' => 'contact@webmasters.com',
                'description' => 'Développement web professionnel',
                'latitude' => 4.0511,
                'longitude' => 9.7679
            ],
            [
                'nom' => 'Innovation Lab',
                'adresse' => 'Quartier Fouda, Yaoundé',
                'quartier' => 'Fouda',
                'telephone' => '237 3333333333',
                'email' => 'contact@innovationlab.com',
                'description' => 'Laboratoire d\'innovation technologique',
                'latitude' => 3.8380,
                'longitude' => 11.4921
            ],
            [
                'nom' => 'Smart Systems',
                'adresse' => 'Rue du Marché Central, Bonanjo, Douala',
                'quartier' => 'Bonanjo',
                'telephone' => '237 4444444444',
                'email' => 'info@smartsystems.com',
                'description' => 'Solutions intelligentes pour entreprises',
                'latitude' => 4.0411,
                'longitude' => 9.7579
            ],
            [
                'nom' => 'Tech Hub',
                'adresse' => 'Quartier Nlongkak, Yaoundé',
                'quartier' => 'Nlongkak',
                'telephone' => '237 6666666666',
                'email' => 'contact@techhub.com',
                'description' => 'Centre d\'innovation et de formation tech',
                'latitude' => 3.8780,
                'longitude' => 11.5221
            ],
            [
                'nom' => 'Digital Solutions',
                'adresse' => 'Rue des Entrepreneurs, Akwa, Douala',
                'quartier' => 'Akwa',
                'telephone' => '237 7777777777',
                'email' => 'info@digitalsolutions.com',
                'description' => 'Solutions digitales pour PME',
                'latitude' => 4.0511,
                'longitude' => 9.7679
            ],
            [
                'nom' => 'Future Tech',
                'adresse' => 'Quartier Mendong, Yaoundé',
                'quartier' => 'Mendong',
                'telephone' => '237 8888888888',
                'email' => 'contact@futuretech.com',
                'description' => 'Technologies de demain',
                'latitude' => 3.8580,
                'longitude' => 11.4921
            ]
        ];

        foreach ($entreprises as $entrepriseData) {
            Entreprise::create($entrepriseData);
        }

        // Création des offres de stage
        $secteurs = DB::table('secteurs')->pluck('id', 'nom');
        $offres = [
            [
                'id_entreprise' => 1,
                'titre' => 'Stage Développeur Full Stack',
                'description' => 'Nous recherchons un stagiaire passionné par le développement web pour rejoindre notre équipe. Vous participerez au développement d\'applications web modernes en utilisant les dernières technologies.',
                'exigences' => 'Étudiant en informatique ou formation équivalente\nBonne connaissance des langages web\nCapacité d\'apprentissage rapide',
                'duree' => '3 mois',
                'date_debut' => '2024-07-01',
                'date_fin' => '2024-09-30',
                'localisation' => 'Douala',
                'remuneration' => 150000,
                'secteur_nom' => 'Développement web',
                'competences_requises' => 'JavaScript, Angular, Node.js, MySQL',
                'statut' => 'ouvert'
            ],
            [
                'id_entreprise' => 2,
                'titre' => 'Stage Marketing Digital',
                'description' => 'Opportunité de stage en marketing digital pour développer des stratégies de contenu et gérer les réseaux sociaux.',
                'exigences' => 'Formation en marketing ou communication\nMaîtrise des réseaux sociaux\nCréativité et esprit d\'équipe',
                'duree' => '6 mois',
                'date_debut' => '2024-06-01',
                'date_fin' => '2024-12-31',
                'localisation' => 'Yaoundé',
                'remuneration' => 120000,
                'secteur_nom' => 'Design UI/UX',
                'competences_requises' => 'Marketing Digital, Réseaux Sociaux, Content Marketing',
                'statut' => 'ouvert'
            ],
            [
                'id_entreprise' => 3,
                'titre' => 'Stage Data Analyst',
                'description' => 'Analyse de données et création de tableaux de bord pour optimiser les performances de l\'entreprise.',
                'exigences' => 'Formation en statistiques ou data science\nMaîtrise des outils d\'analyse de données\nEsprit analytique',
                'duree' => '4 mois',
                'date_debut' => '2024-08-01',
                'date_fin' => '2024-11-30',
                'localisation' => 'Douala',
                'remuneration' => 180000,
                'secteur_nom' => 'Data Science',
                'competences_requises' => 'Python, SQL, Power BI, Statistiques',
                'statut' => 'ouvert'
            ],
            [
                'id_entreprise' => 4,
                'titre' => 'Stage UX/UI Designer',
                'description' => 'Conception d\'interfaces utilisateur modernes et intuitives pour nos applications mobiles et web.',
                'exigences' => 'Formation en design ou expérience utilisateur\nPortfolio de projets\nMaîtrise des outils de design',
                'duree' => '3 mois',
                'date_debut' => '2024-07-15',
                'date_fin' => '2024-10-15',
                'localisation' => 'Yaoundé',
                'remuneration' => 140000,
                'secteur_nom' => 'Design UI/UX',
                'competences_requises' => 'Figma, Adobe XD, UI/UX Design, Prototypage',
                'statut' => 'ouvert'
            ],
            [
                'id_entreprise' => 5,
                'titre' => 'Stage DevOps',
                'description' => 'Automatisation des processus de déploiement et maintenance de l\'infrastructure cloud.',
                'exigences' => 'Connaissances en systèmes Linux\nBases en programmation\nIntérêt pour l\'automatisation',
                'duree' => '5 mois',
                'date_debut' => '2024-09-01',
                'date_fin' => '2025-01-31',
                'localisation' => 'Douala',
                'remuneration' => 200000,
                'secteur_nom' => 'Cloud Computing',
                'competences_requises' => 'Docker, Kubernetes, CI/CD, Linux',
                'statut' => 'ouvert'
            ],
            [
                'id_entreprise' => 1,
                'titre' => 'Stage Mobile Developer',
                'description' => 'Développement d\'applications mobiles natives et cross-platform.',
                'exigences' => 'Formation en développement mobile\nConnaissances en React Native ou Flutter\nPortfolio de projets',
                'duree' => '4 mois',
                'date_debut' => '2024-08-15',
                'date_fin' => '2024-12-15',
                'localisation' => 'Douala',
                'remuneration' => 160000,
                'secteur_nom' => 'Développement mobile',
                'competences_requises' => 'React Native, Flutter, Android, iOS',
                'statut' => 'ouvert'
            ],
            [
                'id_entreprise' => 2,
                'titre' => 'Stage SEO/SEM',
                'description' => 'Optimisation du référencement et gestion des campagnes publicitaires en ligne.',
                'exigences' => 'Connaissances en SEO/SEM\nMaîtrise des outils d\'analyse\nEsprit analytique',
                'duree' => '3 mois',
                'date_debut' => '2024-07-01',
                'date_fin' => '2024-09-30',
                'localisation' => 'Yaoundé',
                'remuneration' => 100000,
                'secteur_nom' => 'Design UI/UX',
                'competences_requises' => 'SEO, Google Ads, Analytics, Content Marketing',
                'statut' => 'ouvert'
            ],
            [
                'id_entreprise' => 3,
                'titre' => 'Stage Cloud Architect',
                'description' => 'Conception et déploiement d\'architectures cloud sur AWS et Azure.',
                'exigences' => 'Connaissances en cloud computing\nBases en programmation\nEsprit d\'innovation',
                'duree' => '6 mois',
                'date_debut' => '2024-09-01',
                'date_fin' => '2025-02-28',
                'localisation' => 'Douala',
                'remuneration' => 220000,
                'secteur_nom' => 'Cloud Computing',
                'competences_requises' => 'AWS, Azure, Cloud Architecture, Security',
                'statut' => 'ouvert'
            ],
            [
                'id_entreprise' => 4,
                'titre' => 'Stage Product Manager',
                'description' => 'Gestion du cycle de vie des produits et coordination des équipes de développement.',
                'exigences' => 'Formation en gestion de projet\nBonne communication\nEsprit d\'analyse',
                'duree' => '5 mois',
                'date_debut' => '2024-08-01',
                'date_fin' => '2024-12-31',
                'localisation' => 'Yaoundé',
                'remuneration' => 180000,
                'secteur_nom' => 'Gestion de projet',
                'competences_requises' => 'Agile, Scrum, Product Strategy, User Research',
                'statut' => 'ouvert'
            ],
            [
                'id_entreprise' => 5,
                'titre' => 'Stage Cybersecurity',
                'description' => 'Analyse de sécurité et mise en place de mesures de protection pour nos systèmes.',
                'exigences' => 'Formation en cybersécurité\nConnaissances en réseaux\nEsprit d\'analyse',
                'duree' => '4 mois',
                'date_debut' => '2024-07-15',
                'date_fin' => '2024-11-15',
                'localisation' => 'Douala',
                'remuneration' => 190000,
                'secteur_nom' => 'Cybersecurite',
                'competences_requises' => 'Network Security, Penetration Testing, Security Analysis',
                'statut' => 'ouvert'
            ],
            [
                'id_entreprise' => 1,
                'titre' => 'Stage AI/ML Engineer',
                'description' => 'Développement de modèles d\'intelligence artificielle et d\'apprentissage automatique.',
                'exigences' => 'Formation en IA/ML\nBonne connaissance de Python\nEsprit d\'innovation',
                'duree' => '6 mois',
                'date_debut' => '2024-09-01',
                'date_fin' => '2025-02-28',
                'localisation' => 'Douala',
                'remuneration' => 250000,
                'secteur_nom' => 'Intelligence artificielle',
                'competences_requises' => 'Python, TensorFlow, PyTorch, Machine Learning',
                'statut' => 'ouvert'
            ],
            [
                'id_entreprise' => 2,
                'titre' => 'Stage Content Writer',
                'description' => 'Création de contenu pour nos plateformes digitales et réseaux sociaux.',
                'exigences' => 'Excellent niveau de français et d\'anglais\nCréativité\nExpérience en rédaction web',
                'duree' => '3 mois',
                'date_debut' => '2024-07-01',
                'date_fin' => '2024-09-30',
                'localisation' => 'Yaoundé',
                'remuneration' => 90000,
                'secteur_nom' => 'Design UI/UX',
                'competences_requises' => 'Rédaction Web, SEO, Social Media, Storytelling',
                'statut' => 'ouvert'
            ],
            [
                'id_entreprise' => 3,
                'titre' => 'Stage QA Engineer',
                'description' => 'Tests et assurance qualité pour nos applications web et mobiles.',
                'exigences' => 'Connaissances en tests logiciels\nEsprit d\'analyse\nRigueur',
                'duree' => '4 mois',
                'date_debut' => '2024-08-01',
                'date_fin' => '2024-11-30',
                'localisation' => 'Douala',
                'remuneration' => 130000,
                'secteur_nom' => 'Développement web',
                'competences_requises' => 'Testing, Selenium, JIRA, Test Automation',
                'statut' => 'ouvert'
            ],
            [
                'id_entreprise' => 4,
                'titre' => 'Stage Business Analyst',
                'description' => 'Analyse des besoins métiers et rédaction des spécifications fonctionnelles.',
                'exigences' => 'Formation en gestion ou informatique\nBonne communication\nEsprit d\'analyse',
                'duree' => '5 mois',
                'date_debut' => '2024-09-01',
                'date_fin' => '2025-01-31',
                'localisation' => 'Yaoundé',
                'remuneration' => 150000,
                'secteur_nom' => 'Gestion de projet',
                'competences_requises' => 'UML, BPMN, Requirements Analysis, Documentation',
                'statut' => 'ouvert'
            ],
            [
                'id_entreprise' => 5,
                'titre' => 'Stage Technical Writer',
                'description' => 'Rédaction de documentation technique et guides utilisateurs.',
                'exigences' => 'Excellent niveau de français et d\'anglais\nConnaissances techniques\nEsprit de synthèse',
                'duree' => '3 mois',
                'date_debut' => '2024-07-15',
                'date_fin' => '2024-10-15',
                'localisation' => 'Douala',
                'remuneration' => 110000,
                'secteur_nom' => 'Développement web',
                'competences_requises' => 'Technical Writing, Documentation, API Documentation',
                'statut' => 'ouvert'
            ]
        ];
        // Remplacer les secteurs par secteur_id
        foreach ($offres as &$offreData) {
            if (isset($offreData['secteur_nom']) && isset($secteurs[$offreData['secteur_nom']])) {
                $offreData['secteur_id'] = $secteurs[$offreData['secteur_nom']];
            }
            unset($offreData['secteur_nom']);
        }
        unset($offreData);
        foreach ($offres as $offreData) {
            OffreStage::create($offreData);
        }


        // Création des messages
        $messages = [
            [
                'id_expediteur' => 3,
                'id_destinataire' => 2,
                'contenu' => 'Je suis intéressé par votre offre de stage.',
                'lu' => false
            ],
            [
                'id_expediteur' => 2,
                'id_destinataire' => 3,
                'contenu' => 'Merci de votre intérêt. Pouvons-nous prévoir un entretien?',
                'lu' => false
            ]
        ];

        foreach ($messages as $messageData) {
            Message::create($messageData);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }
}
