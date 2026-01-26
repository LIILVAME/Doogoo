# 🚀 Guide de Déploiement Doogoo

## ✅ Pre-flight Check

### 1. Build de Production

Le build de production a été vérifié avec succès :

```bash
npm run build
```

✅ **Statut :** Build réussi sans erreurs

- Compilation TypeScript : OK
- Bundle généré : `dist/`
- PWA Service Worker : Généré
- Avertissement : Un chunk dépasse 1000KB (ReportsPage) - acceptable pour l'instant

### 2. Configuration Vercel

Le fichier `vercel.json` est configuré avec :

- ✅ Rewrites pour SPA (évite les 404 sur refresh)
- ✅ Headers de sécurité (CSP, XSS Protection, etc.)
- ✅ Build command configuré

### 3. Sécurité Git

Le fichier `.gitignore` ignore correctement :

- ✅ `.env` et toutes ses variantes (`.env.local`, `.env.production`, etc.)
- ✅ `node_modules/`
- ✅ `dist/`
- ✅ Fichiers sensibles

---

## 📋 Étapes de Déploiement

### Étape 1 : Préparer le Repository GitHub

```bash
# Vérifier l'état Git
git status

# Ajouter tous les fichiers (sauf ceux dans .gitignore)
git add .

# Commit final
git commit -m "feat: release v1.0.0 - ready for deployment"

# Pousser sur GitHub
git push origin main
```

### Étape 2 : Connecter le Repository à Vercel

1. **Créer un compte Vercel** (si nécessaire)
   - Allez sur [https://vercel.com](https://vercel.com)
   - Connectez-vous avec GitHub

2. **Importer le projet**
   - Cliquez sur "Add New Project"
   - Sélectionnez le repository `Doogoo`
   - Vercel détectera automatiquement :
     - Framework : Vue.js
     - Build Command : `npm run build` (défini dans vercel.json)
     - Output Directory : `dist`

3. **Configuration du projet**
   - Framework Preset : Vue.js
   - Root Directory : `./` (racine du projet)
   - Build Command : `npm run build` (automatique via vercel.json)
   - Output Directory : `dist`

---

## 🔐 Variables d'Environnement à Configurer

### ⚠️ IMPORTANT : Variables OBLIGATOIRES

Dans le dashboard Vercel → Settings → Environment Variables, ajoutez :

#### 1. Variables Supabase (OBLIGATOIRES)

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key_ici
```

**Comment les trouver :**

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **API**
4. Copiez :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

#### 2. Variables Optionnelles (Analytics, Monitoring)

```env
# Analytics (optionnel)
VITE_ENABLE_ANALYTICS=true

# Google Analytics 4 (optionnel)
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Plausible Analytics (optionnel)
VITE_PLAUSIBLE_DOMAIN=votre-domaine.com

# Sentry Error Tracking (optionnel)
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx

# Email admin (optionnel, pour les diagnostics)
VITE_ADMIN_EMAIL=admin@votre-domaine.com
```

#### 3. Variables de Base Path (si déploiement sur sous-chemin)

```env
# Si l'app est déployée sur un sous-chemin (ex: /Doogoo/)
VITE_BASE_PATH=/Doogoo/
```

---

## 📝 Configuration par Environnement

Dans Vercel, vous pouvez définir des variables différentes pour chaque environnement :

- **Production** : Variables pour production
- **Preview** : Variables pour les branches (staging)
- **Development** : Variables pour développement local

**Recommandation :**

- Définissez les variables Supabase pour **Production** et **Preview**
- Les variables optionnelles (analytics) peuvent être différentes selon l'environnement

---

## 🔄 Après le Déploiement

### 1. Vérifier le Déploiement

Une fois déployé, Vercel vous fournira une URL (ex: `doogoo.vercel.app`)

1. Visitez l'URL
2. Testez la connexion :
   - Créez un compte
   - Connectez-vous
   - Vérifiez que les données se chargent

### 2. Configuration du Domaine Personnalisé (Optionnel)

1. Dans Vercel Dashboard → Settings → Domains
2. Ajoutez votre domaine personnalisé
3. Suivez les instructions pour configurer les DNS

### 3. Vérification Post-Déploiement

- ✅ L'authentification fonctionne
- ✅ Les données se chargent depuis Supabase
- ✅ Le temps réel (Realtime) fonctionne
- ✅ Les PDF se génèrent correctement
- ✅ Le PWA fonctionne (service worker)

---

## 🔍 Troubleshooting

### Erreur : "Failed to fetch" au chargement

**Cause :** Variables d'environnement Supabase manquantes ou incorrectes

**Solution :**

1. Vérifiez dans Vercel Dashboard → Settings → Environment Variables
2. Vérifiez que `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont bien définies
3. Redéployez après modification des variables

### Erreur : 404 sur les routes (ex: `/dashboard`)

**Cause :** Rewrites non configurés

**Solution :** Vérifiez que `vercel.json` contient bien les rewrites (déjà configuré ✅)

### Erreur : "Row Level Security policy violation"

**Cause :** Les politiques RLS Supabase bloquent les requêtes

**Solution :**

1. Vérifiez dans Supabase Dashboard → Authentication → Policies
2. Assurez-vous que les politiques RLS sont bien créées (voir `supabase/migrations/`)

---

## 📚 Documentation Supplémentaire

- **Schema SQL** : `supabase/migrations/README_SCHEMA.md`
- **Architecture** : `docs/ARCHITECTURE_REF.md`
- **Supabase Integration** : `docs/SUPABASE_INTEGRATION.md` (si disponible)

---

## ✅ Checklist de Déploiement

- [ ] Code poussé sur GitHub
- [ ] Repository connecté à Vercel
- [ ] Variables d'environnement configurées (au minimum `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`)
- [ ] Build Vercel réussi
- [ ] Application accessible sur l'URL Vercel
- [ ] Authentification testée
- [ ] Données Supabase accessibles
- [ ] Temps réel fonctionnel (testez en ouvrant deux onglets)
- [ ] Génération PDF testée
- [ ] (Optionnel) Domaine personnalisé configuré

---

**🎉 Une fois toutes les cases cochées, votre application Doogoo est prête pour la production !**
