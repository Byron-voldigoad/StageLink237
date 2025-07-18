# 🔑 Configuration API Gemini

## Variables d'environnement requises

Pour que l'intégration IA Gemini fonctionne correctement, vous devez ajouter la variable suivante dans votre fichier `.env` :

```env
# Clé API Gemini
GEMINI_API_KEY=AIzaSyAJWDp9BYAe1QREiNhFJcRPDGnAcvZeYQY
```

## Instructions de configuration

1. **Créez ou modifiez le fichier `.env`** dans le dossier `BackEndStageLink/`
2. **Ajoutez la ligne ci-dessus** avec votre clé API Gemini
3. **Redémarrez le serveur Laravel** pour que les changements prennent effet

## Obtenir une clé API Gemini

1. Allez sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Create API Key"
4. Copiez la clé générée
5. Remplacez la valeur dans le fichier `.env`

## Vérification de la configuration

Pour vérifier que la configuration fonctionne :

```bash
# Dans le dossier BackEndStageLink
php artisan tinker
```

Puis testez :

```php
echo env('AIzaSyAJWDp9BYAe1QREiNhFJcRPDGnAcvZeYQY');
```

Si la clé s'affiche correctement, la configuration est bonne.

## Sécurité

⚠️ **Important** : 
- Ne committez jamais votre clé API dans Git
- Le fichier `.env` est déjà dans `.gitignore`
- Utilisez des clés différentes pour développement et production 