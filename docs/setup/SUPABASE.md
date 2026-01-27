# 🔐 Configuration Supabase

## Configuration des variables d'environnement

Pour activer l'authentification Supabase dans le projet Doogoo, vous devez créer un fichier `.env` à la racine du projet avec les variables suivantes :

```env
VITE_SUPABASE_URL=https://hvhcyraudbabctsrxpqr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2aGN5cmF1ZGJhYmN0c3J4cHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTcwNDMsImV4cCI6MjA3NzQ5MzA0M30.BgVqbyxAKyA74CVINENSEkEHy7vA-Qn0KH-QIABqQt0
```

### Étapes

1. **Créer le fichier `.env`** à la racine du projet (à côté de `package.json`)
2. **Copier les variables** ci-dessus dans ce fichier
3. **Redémarrer le serveur de développement** (`npm run dev`)

> ⚠️ **Important** : Le fichier `.env` est ignoré par Git (déjà configuré dans `.gitignore`) pour éviter d'exposer vos clés.

---

## Structure de l'authentification

### Fichiers créés

- `src/lib/supabaseClient.js` - Client Supabase configuré
- `src/stores/authStore.js` - Store Pinia pour la gestion de l'authentification
- `src/pages/LoginPage.vue` - Page de connexion
- `src/router/index.js` - Route guards pour protéger les routes

### Fonctionnalités implémentées

✅ **Connexion** (`login`)

- Email + mot de passe
- Gestion des erreurs
- États de chargement

✅ **Déconnexion** (`logout`)

- Suppression de la session Supabase
- Redirection automatique vers `/login`

✅ **Restauration de session** (`fetchUser`)

- Récupération automatique de l'utilisateur au chargement
- Persistance entre les rafraîchissements de page

✅ **Protection des routes**

- Route guard `beforeEach` qui vérifie l'authentification
- Redirection automatique vers `/login` si non authentifié
- Sauvegarde de l'URL de destination (`redirect` query)

✅ **Écouteur d'événements Supabase**

- Détection automatique des changements de session
- Gestion du refresh token
- Déconnexion automatique si la session expire

---

## Utilisation

### Connexion

1. Naviguer vers `/login`
2. Saisir email et mot de passe
3. Cliquer sur "Se connecter"
4. Redirection automatique vers `/dashboard` (ou la page demandée)

### Déconnexion

1. Cliquer sur "Déconnexion" dans la Sidebar
2. Redirection automatique vers `/login`

### Mot de passe oublié

1. Sur la page de login, cliquer sur "Mot de passe oublié ?"
2. Saisir l'email
3. Un lien de réinitialisation sera envoyé par email

---

## Routes protégées

Les routes suivantes nécessitent une authentification :

- `/dashboard`
- `/biens`
- `/paiements`
- `/locataires`
- `/parametres`

Les routes publiques :

- `/` (Landing page)
- `/login`

---

## Prochaines étapes (v0.2.0)

- [ ] Ajouter une page d'inscription (`SignUpPage.vue`)
- [ ] Implémenter la réinitialisation de mot de passe (`ResetPasswordPage.vue`)
- [ ] Ajouter la gestion de profil utilisateur (photo, nom, etc.)
- [ ] Intégrer les préférences utilisateur (thème, devise, etc.)
- [ ] Ajouter des notifications toast pour les succès/erreurs
- [ ] Implémenter la gestion des rôles (admin, user, etc.)

---

## Dépannage

### Erreur : "Missing Supabase environment variables"

➡️ Vérifiez que le fichier `.env` existe et contient les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`

### Erreur : "Invalid login credentials"

➡️ Vérifiez que l'utilisateur existe dans Supabase Auth et que le mot de passe est correct

### Session non persistante

➡️ Vérifiez que `authStore.initAuthListener()` est appelé dans `App.vue` et que le router guard initialise correctement la session
