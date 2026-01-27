# 🚀 Déploiement Vercel - Doogoo v0.2.0

**Date** : 31 janvier 2025  
**Statut** : ✅ **Déployé en production**

---

## 📍 URLs de Production

### URL Principale

- **Production** : https://vylo.vercel.app (ou le nom de votre projet dans Vercel)

### Autres Aliases

- Les alias dépendent du nom du projet configuré dans Vercel Dashboard

---

## ✅ Configuration Actuelle

### 1. Fichier `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Variables d'Environnement

Variables configurées dans Vercel Dashboard :

- ✅ `VITE_SUPABASE_URL` → `https://hvhcyraudbabctsrxpqr.supabase.co`
- ✅ `VITE_SUPABASE_ANON_KEY` → (chiffrée)

**Environnements** : Production

---

### 3. Configuration Vite

Le fichier `vite.config.js` détecte automatiquement Vercel :

```javascript
const base = process.env.VERCEL ? '/' : process.env.NODE_ENV === 'production' ? '/Doogoo/' : '/'
```

- **Sur Vercel** : Base path = `/` (détection automatique)
- **Sur GitHub Pages** : Base path = `/Doogoo/`

---

## 🔗 Déploiements Automatiques (GitHub Integration)

### Configuration via Dashboard Vercel

1. **Accéder aux paramètres Git** :
   - Dashboard : https://vercel.com/[votre-team]/vylo/settings/git
   - Remplacez `[votre-team]` par le nom de votre équipe Vercel

2. **Connecter le repository GitHub** :
   - Cliquer sur "Connect Git Repository"
   - Sélectionner `LIILVAME/Doogoo`
   - Autoriser Vercel à accéder au repository

3. **Configuration automatique** :
   - Vercel détecte automatiquement la configuration Vite
   - Les variables d'environnement sont déjà configurées
   - Déploiements automatiques activés

### Résultat

Une fois connecté, chaque push sur `main` déclenchera :

- ✅ Build automatique
- ✅ Déploiement en production
- ✅ Preview deployments pour les Pull Requests

---

## 📊 Commandes Vercel CLI Utiles

### Vérifier le statut

```bash
vercel ls
```

### Voir les logs d'un déploiement

```bash
vercel inspect <deployment-url> --logs
```

### Lister les variables d'environnement

```bash
vercel env ls
```

### Ajouter une variable d'environnement

```bash
vercel env add VITE_NOM_VARIABLE production
```

### Redéployer en production

```bash
vercel --prod
```

### Voir les domaines

```bash
vercel domains ls
```

---

## 🌐 Ajouter un Domaine Personnalisé (Optionnel)

### Via CLI

```bash
vercel domains add votre-domaine.com
```

### Via Dashboard

1. Aller dans **Settings → Domains**
2. Ajouter un domaine
3. Configurer les DNS selon les instructions Vercel

---

## 🔍 Monitoring & Logs

### Dashboard Vercel

- **Analytics** : https://vercel.com/[votre-team]/vylo/analytics
- **Logs** : https://vercel.com/[votre-team]/vylo/logs
- **Deployments** : https://vercel.com/[votre-team]/vylo/deployments

### CLI

```bash
# Logs en temps réel
vercel logs

# Inspecter un déploiement spécifique
vercel inspect <deployment-url>
```

---

## ⚙️ Rollback en Cas de Problème

### Via Dashboard

1. Aller dans **Deployments**
2. Trouver le déploiement précédent
3. Cliquer sur "..." → "Promote to Production"

### Via CLI

```bash
vercel promote <deployment-url>
```

---

## 📝 Notes Importantes

1. **Variables d'environnement** :
   - Les variables doivent être configurées pour chaque environnement (Production, Preview, Development)
   - Utiliser `vercel env add` ou le dashboard pour ajouter des variables

2. **Base path** :
   - Sur Vercel, le base path est automatiquement `/`
   - Pour GitHub Pages, il reste `/Doogoo/`

3. **Build optimisé** :
   - Vercel détecte automatiquement Vite
   - Build time : ~15-20s
   - Output : `dist/` directory

---

## ✅ Checklist de Déploiement

- [x] Projet créé sur Vercel
- [x] Fichier `vercel.json` configuré
- [x] Variables d'environnement Supabase ajoutées
- [x] Déploiement en production réussi
- [x] Configuration Vite adaptée pour Vercel
- [ ] Intégration GitHub connectée (à faire via dashboard)
- [ ] Domaine personnalisé (optionnel)

---

## 🎯 Prochaines Étapes

1. **Connecter GitHub** : Activer les déploiements automatiques via dashboard
2. **Tester l'application** : Vérifier que https://vylo.vercel.app (ou votre URL personnalisée) fonctionne
3. **Configurer un domaine** (optionnel) : Si tu as un domaine personnalisé

---

**Statut** : ✅ **Déploiement réussi et opérationnel**
