<?php

namespace App\Services;

class CompetencesService
{
    public static function getCompetencesParSecteur($secteur)
    {
        $competences = [
            'developpement_web' => [
                'HTML5, CSS3, JavaScript',
                'Frameworks front-end (Angular, React, Vue.js)',
                'Frameworks back-end (Laravel, Node.js, Django)',
                'Base de données SQL et NoSQL',
                'Contrôle de version Git',
                'Responsive design et principes UX',
                'API RESTful'
            ],
            'developpement_mobile' => [
                'Développement Android (Java/Kotlin)',
                'Développement iOS (Swift)',
                'React Native ou Flutter',
                'Architecture d\'applications mobiles',
                'APIs et services web',
                'SQLite et stockage local',
                'Tests unitaires mobiles'
            ],
            'intelligence_artificielle' => [
                'Python, TensorFlow, PyTorch',
                'Machine Learning et Deep Learning',
                'Traitement du langage naturel (NLP)',
                'Vision par ordinateur',
                'Mathématiques et statistiques',
                'Analyse de données',
                'Algorithmes d\'apprentissage'
            ],
            'cybersecurite' => [
                'Sécurité des réseaux',
                'Cryptographie',
                'Tests de pénétration',
                'Analyse de malwares',
                'Sécurité des applications web',
                'Gestion des incidents',
                'Conformité et normes de sécurité'
            ],
            'cloud_computing' => [
                'AWS, Azure ou Google Cloud',
                'Docker et Kubernetes',
                'Infrastructure as Code',
                'Microservices',
                'DevOps et CI/CD',
                'Sécurité cloud',
                'Optimisation des coûts cloud'
            ],
            'data_science' => [
                'Python, R',
                'SQL et NoSQL',
                'Visualisation de données',
                'Machine Learning',
                'Statistiques',
                'Big Data (Hadoop, Spark)',
                'Data Mining'
            ],
            'reseaux' => [
                'Protocoles réseau TCP/IP',
                'Configuration de routeurs et switches',
                'Sécurité réseau',
                'VPN et VLANs',
                'Monitoring réseau',
                'Virtualisation',
                'SDN (Software Defined Networking)'
            ],
            'systemes_embarques' => [
                'C/C++',
                'Microcontrôleurs',
                'RTOS',
                'Électronique numérique',
                'Protocoles de communication embarqués',
                'Debug hardware',
                'IoT'
            ],
            'design_ui_ux' => [
                'Figma, Adobe XD',
                'Principes de design UI/UX',
                'Prototypage',
                'Tests utilisateurs',
                'Design responsive',
                'Design systems',
                'Accessibilité web'
            ],
            'gestion_de_projet' => [
                'Méthodologies Agile (Scrum)',
                'Outils de gestion de projet',
                'Communication d\'équipe',
                'Gestion des risques',
                'Planification et estimation',
                'Reporting',
                'Leadership'
            ]
        ];

        return $competences[$secteur] ?? [];
    }
} 