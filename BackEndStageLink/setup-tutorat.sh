#!/bin/bash

echo "🚀 Configuration du module Tutorat pour StageLink"
echo "=================================================="

# Vérifier si on est dans le bon répertoire
if [ ! -f "artisan" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis le répertoire racine de Laravel"
    exit 1
fi

echo "📦 Installation des dépendances..."
composer install

echo "🔧 Configuration de l'environnement..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  Fichier .env créé. Veuillez configurer votre base de données."
    echo "   Puis relancez ce script."
    exit 1
fi

echo "🗄️  Exécution des migrations..."
php artisan migrate:fresh

echo "🌱 Exécution des seeders..."
echo "   - Matières..."
php artisan db:seed --class=matieresSeeder
echo "   - Niveaux..."
php artisan db:seed --class=niveauxSeeder
echo "   - Années académiques..."
php artisan db:seed --class=anneesAcademiquesSeeder
echo "   - Types de sujets..."
php artisan db:seed --class=TypesSujetsSeeder
echo "   - Corrigés d'examen..."
php artisan db:seed --class=CorrigesExamenSeeder
echo "   - Sujets d'examen..."
php artisan db:seed --class=SujetsExamenSeeder
echo "   - Profils utilisateurs..."
php artisan db:seed --class=ProfilsSeeder
echo "   - Tutorats..."
php artisan db:seed --class=TutoratSeeder

echo "🔑 Génération de la clé d'application..."
php artisan key:generate

echo "📁 Création des liens symboliques..."
php artisan storage:link

echo "🧹 Nettoyage du cache..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo "✅ Configuration terminée !"
echo ""
echo "🎯 Prochaines étapes :"
echo "   1. Démarrez le serveur Laravel : php artisan serve"
echo "   2. Dans un autre terminal, allez dans FrontEndStageLink"
echo "   3. Installez les dépendances : npm install"
echo "   4. Démarrez le serveur Angular : ng serve"
echo ""
echo "🌐 URLs d'accès :"
echo "   - Backend API : http://localhost:8000"
echo "   - Frontend : http://localhost:4200"
echo "   - Tutorats : http://localhost:4200/tutorats"
echo ""
echo "📚 Documentation :"
echo "   - Consultez le README.md du module tutorats pour plus d'informations" 