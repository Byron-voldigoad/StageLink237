# StageLink - Application de Gestion de Stages

## Vue d'ensemble de l'Interface Utilisateur

### 1. Structure Générale
L'application utilise une mise en page moderne avec une barre de navigation latérale (sidebar) et une zone de contenu principale. Le design suit les principes de Material Design et utilise Tailwind CSS pour le styling.

### 2. Composants Principaux

#### 2.1 Barre de Navigation (Navbar)
- Position: En haut de l'écran
- Hauteur: 64px
- Couleur de fond: #FFFFFF
- Ombre portée légère
- Contenu:
  - Logo de l'application à gauche
  - Menu de navigation à droite
  - Indicateur de connexion/utilisateur

#### 2.2 Barre Latérale (Sidebar)
- Position: Côté gauche
- Largeur: 256px
- Couleur de fond: #1E293B
- Menu items:
  - Dashboard
  - Stages
  - Entreprises
  - Étudiants
  - Tuteurs
- Chaque item du menu:
  - Icône à gauche
  - Texte à droite
  - Effet hover: légère surbrillance
  - Item actif: fond bleu (#3B82F6)

#### 2.3 Zone de Contenu Principal
- Position: À droite de la sidebar
- Couleur de fond: #F8FAFC
- Padding: 24px
- Responsive: S'adapte à la largeur de l'écran

### 3. Pages Principales

#### 3.1 Dashboard
- En-tête avec titre "Tableau de bord"
- Statistiques en haut:
  - 4 cartes en ligne
  - Chaque carte: fond blanc, ombre légère
  - Contient: icône, titre, valeur numérique
- Graphiques au centre:
  - 2 graphiques côte à côte
  - Fond blanc, bordures arrondies
- Liste des dernières activités en bas

#### 3.2 Stages
- En-tête avec:
  - Titre "Gestion des Stages"
  - Bouton "Nouveau Stage" (bleu, #3B82F6)
- Tableau des stages:
  - En-têtes: ID, Titre, Entreprise, Étudiant, Statut, Actions
  - Lignes alternées (gris clair/blanc)
  - Actions: Éditer, Supprimer, Voir détails
- Pagination en bas
- Filtres en haut:
  - Recherche par texte
  - Filtres par statut
  - Filtres par date

#### 3.3 Entreprises
- En-tête avec:
  - Titre "Gestion des Entreprises"
  - Bouton "Nouvelle Entreprise"
- Liste des entreprises:
  - Carte par entreprise
  - Informations: Nom, Adresse, Contact
  - Actions: Éditer, Supprimer, Voir stages

#### 3.4 Étudiants
- En-tête avec:
  - Titre "Gestion des Étudiants"
  - Bouton "Nouvel Étudiant"
- Tableau des étudiants:
  - Colonnes: ID, Nom, Prénom, Formation, Stage actuel
  - Actions: Éditer, Supprimer, Voir profil

#### 3.5 Tuteurs
- En-tête avec:
  - Titre "Gestion des Tuteurs"
  - Bouton "Nouveau Tuteur"
- Liste des tuteurs:
  - Carte par tuteur
  - Informations: Nom, Entreprise, Étudiants suivis
  - Actions: Éditer, Supprimer, Voir détails

### 4. Composants Communs

#### 4.1 Boutons
- Primaire: Bleu (#3B82F6), coins arrondis
- Secondaire: Gris (#64748B), coins arrondis
- Danger: Rouge (#EF4444), coins arrondis
- Taille standard: 40px de hauteur

#### 4.2 Formulaires
- Champs de saisie:
  - Hauteur: 40px
  - Bordure: 1px solid #E2E8F0
  - Coins arrondis: 6px
  - Focus: bordure bleue (#3B82F6)
- Labels:
  - Au-dessus des champs
  - Taille: 14px
  - Couleur: #64748B

#### 4.3 Tableaux
- En-têtes: fond gris clair (#F1F5F9)
- Bordures: 1px solid #E2E8F0
- Lignes alternées
- Hover sur ligne: fond gris très clair

#### 4.4 Modales
- Fond semi-transparent
- Fenêtre centrée
- Coins arrondis: 8px
- Ombre portée
- Bouton de fermeture en haut à droite

### 5. Responsive Design
- Breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- Sidebar:
  - Desktop: Toujours visible
  - Mobile/Tablet: Menu hamburger
- Tableaux:
  - Desktop: Affichage complet
  - Mobile: Vue en cartes

### 6. Thème et Couleurs
- Couleurs principales:
  - Primaire: #3B82F6 (bleu)
  - Secondaire: #64748B (gris)
  - Succès: #10B981 (vert)
  - Danger: #EF4444 (rouge)
  - Warning: #F59E0B (orange)
- Typographie:
  - Police principale: Inter
  - Tailles: 14px (base), 16px (titres)
  - Poids: 400 (normal), 600 (semi-bold)

### 7. Animations
- Transitions douces (300ms)
- Hover effects sur les boutons et cartes
- Animations de chargement:
  - Spinner circulaire
  - Skeleton loading pour les contenus

### 8. États et Feedback
- États de chargement:
  - Spinner pour les actions
  - Skeleton pour le contenu
- Messages d'erreur:
  - Rouge (#EF4444)
  - Icône d'alerte
- Messages de succès:
  - Vert (#10B981)
  - Icône de validation
- Tooltips sur hover
- Confirmations pour les actions importantes 