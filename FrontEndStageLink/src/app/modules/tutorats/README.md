# Module Tutorat - StageLink

## 📋 Résumé des corrections apportées

### ✅ Problèmes résolus

1. **Couleurs de la charte graphique** : Toutes les couleurs bleues (indigo) ont été remplacées par du vert pour respecter la charte graphique
2. **Formulaire d'ajout** : 
   - Les champs domaine et niveau sont maintenant des selects chargés depuis l'API
   - Validation des dates améliorée
   - Gestion d'erreurs améliorée
3. **Données manquantes** : 
   - Création de seeders pour matières et niveaux
   - Création de seeders pour profils de tuteurs et étudiants
   - Correction du seeder de tutorats pour utiliser les vraies données
4. **API Backend** :
   - Ajout des routes pour récupérer domaines et niveaux
   - Correction des contrôleurs
   - Amélioration de la gestion d'erreurs

## 🚀 Installation et configuration

### Backend (Laravel)

1. **Exécuter le script de setup** :
```bash
cd BackEndStageLink
chmod +x setup-tutorat.sh
./setup-tutorat.sh
```

2. **Ou exécuter manuellement** :
```bash
# Migrations
php artisan migrate:fresh

# Seeders dans l'ordre
php artisan db:seed --class=matieresSeeder
php artisan db:seed --class=niveauxSeeder
php artisan db:seed --class=anneesAcademiquesSeeder
php artisan db:seed --class=TypesSujetsSeeder
php artisan db:seed --class=CorrigesExamenSeeder
php artisan db:seed --class=SujetsExamenSeeder
php artisan db:seed --class=ProfilsSeeder
php artisan db:seed --class=TutoratSeeder

# Générer la clé
php artisan key:generate

# Créer le lien storage
php artisan storage:link
```

3. **Démarrer le serveur** :
```bash
php artisan serve
```

### Frontend (Angular)

1. **Installer les dépendances** :
```bash
cd FrontEndStageLink
npm install
```

2. **Démarrer le serveur** :
```bash
ng serve
```

## 📁 Structure du module

```
FrontEndStageLink/src/app/modules/tutorats/
├── models/
│   └── tutorat.model.ts          # Modèle TypeScript
├── pages/
│   ├── liste-tutorats/           # Liste des tutorats avec filtres
│   ├── detail-tutorat/           # Détail d'un tutorat
│   └── form-tutorat/             # Formulaire création/édition
├── services/
│   └── tutorat.service.ts        # Service API
├── tutorats-routing.ts           # Routes Angular
└── README.md                     # Documentation
```

## 🎨 Charte graphique

- **Couleur principale** : Vert (`bg-green-600`, `text-green-600`)
- **Couleur secondaire** : Bleu (pour les éléments secondaires)
- **Couleur d'erreur** : Rouge (`bg-red-600`, `text-red-600`)

## 🔧 Fonctionnalités

### Liste des tutorats
- ✅ Affichage paginé
- ✅ Filtres par domaine, niveau, statut
- ✅ Recherche par texte
- ✅ Statistiques
- ✅ Bouton de création

### Détail d'un tutorat
- ✅ Informations complètes
- ✅ Gestion des candidatures
- ✅ Séances planifiées
- ✅ Actions (postuler, accepter/refuser)

### Formulaire de création/édition
- ✅ Champs obligatoires validés
- ✅ Selects pour domaine et niveau
- ✅ Validation des dates
- ✅ Gestion d'erreurs
- ✅ Mode édition

## 📊 Données de test

Le module inclut des données de test complètes :
- **20 matières** : Mathématiques, Physique, Chimie, etc.
- **16 niveaux** : 6ème à Doctorat
- **5 tuteurs** avec profils complets
- **5 étudiants** avec profils complets
- **20 tutorats** avec candidatures et séances

## 🔗 API Endpoints

### Tutorats
- `GET /api/tutorats` - Liste des tutorats
- `POST /api/tutorats` - Créer un tutorat
- `GET /api/tutorats/{id}` - Détail d'un tutorat
- `PUT /api/tutorats/{id}` - Modifier un tutorat
- `DELETE /api/tutorats/{id}` - Supprimer un tutorat

### Candidatures
- `POST /api/tutorats/{id}/postuler` - Postuler à un tutorat
- `PUT /api/tutorats/{tutoratId}/candidatures/{candidatureId}` - Gérer candidature

### Données de référence
- `GET /api/tutorats/domaines` - Liste des domaines
- `GET /api/tutorats/niveaux` - Liste des niveaux
- `GET /api/tutorats/statistiques` - Statistiques

## 🐛 Résolution de problèmes

### Aucune offre ne s'affiche
1. Vérifier que les seeders ont été exécutés
2. Vérifier la connexion à la base de données
3. Vérifier les logs Laravel : `tail -f storage/logs/laravel.log`

### Erreur lors de la création
1. Vérifier que l'ID du tuteur existe (actuellement fixé à 1)
2. Vérifier la validation des dates
3. Vérifier les logs d'erreur

### Problèmes de couleurs
- Toutes les couleurs indigo ont été remplacées par du vert
- Vérifier que Tailwind CSS est bien configuré

## 🔮 Améliorations futures

1. **Authentification** : Intégrer un vrai système d'auth
2. **Notifications** : Système de notifications en temps réel
3. **Paiements** : Intégration de système de paiement
4. **Évaluations** : Système d'évaluation des tutorats
5. **Chat** : Messagerie entre tuteurs et étudiants

## 📞 Support

Pour toute question ou problème :
1. Vérifier les logs d'erreur
2. Consulter la documentation Laravel/Angular
3. Vérifier la configuration de la base de données 