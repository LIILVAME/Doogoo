# 🔧 Correction du Base Path Vercel - `/Doogoo/` dans l'URL

**Problème** : L'application est accessible sur `https://doogoo.vercel.app/Doogoo/` au lieu de `https://doogoo.vercel.app/`

**Cause** : La variable d'environnement `VITE_BASE_PATH` est probablement définie à `/Doogoo/` dans Vercel, alors qu'elle devrait être `/` ou non définie.

---

## 🔍 Diagnostic

### Vérification locale

```bash
npm run verify:vercel
```

Le script vérifie :

- ✅ Variables locales (`.env`, `.env.local`)
- ⚠️ Variables Vercel (nécessite Vercel CLI authentifié)

### Vérification Vercel Dashboard

1. **Aller sur** : https://vercel.com/dashboard
2. **Sélectionner le projet** : `doogoo`
3. **Settings → Environment Variables**
4. **Chercher** : `VITE_BASE_PATH`

---

## ✅ Solution

### Option 1 : Supprimer la variable (Recommandé)

Si `VITE_BASE_PATH` existe dans Vercel avec la valeur `/Doogoo/` :

1. **Vercel Dashboard** → Settings → Environment Variables
2. **Trouver** `VITE_BASE_PATH`
3. **Cliquer sur** "..." → **Delete**
4. **Confirmer** la suppression
5. **Redéployer** : Deployments → Dernier déploiement → "..." → Redeploy

### Option 2 : Définir à `/`

Si vous devez garder la variable :

1. **Vercel Dashboard** → Settings → Environment Variables
2. **Trouver** `VITE_BASE_PATH`
3. **Cliquer sur** "..." → **Edit**
4. **Changer la valeur** de `/Doogoo/` à `/`
5. **Sauvegarder**
6. **Redéployer** : Deployments → Dernier déploiement → "..." → Redeploy

---

## 🚀 Vérification après correction

1. **Attendre** que le redéploiement soit terminé (~2-3 minutes)
2. **Tester** : https://doogoo.vercel.app/
3. **Vérifier** que l'URL ne contient plus `/Doogoo/`

### URLs attendues

- ✅ **Correct** : `https://doogoo.vercel.app/`
- ✅ **Correct** : `https://doogoo.vercel.app/dashboard`
- ✅ **Correct** : `https://doogoo.vercel.app/login`
- ❌ **Incorrect** : `https://doogoo.vercel.app/Doogoo/`
- ❌ **Incorrect** : `https://doogoo.vercel.app/Doogoo/dashboard`

---

## 📝 Notes importantes

### Base Path par environnement

- **Vercel** : `/` (racine) - **PAS de base path**
- **GitHub Pages** : `/Doogoo/` - **Nécessite base path**

### Configuration Vite

Le fichier `vite.config.js` gère automatiquement :

```javascript
// Base path pour GitHub Pages vs Vercel
const base = process.env.VITE_BASE_PATH || '/'
```

- Si `VITE_BASE_PATH` n'est pas défini → utilise `/` (correct pour Vercel)
- Si `VITE_BASE_PATH=/Doogoo/` → utilise `/Doogoo/` (incorrect pour Vercel, correct pour GitHub Pages)

### Pourquoi `/Doogoo/` existe ?

Le base path `/Doogoo/` est nécessaire pour GitHub Pages car le repository est dans un sous-dossier :

- GitHub Pages : `https://liilvame.github.io/Doogoo/`
- Vercel : `https://doogoo.vercel.app/` (domaine racine)

---

## 🔄 Via Vercel CLI (Optionnel)

Si vous avez Vercel CLI installé et authentifié :

```bash
# Vérifier les variables
vercel env ls

# Supprimer VITE_BASE_PATH
vercel env rm VITE_BASE_PATH production

# Ou définir à /
vercel env add VITE_BASE_PATH production
# Entrer "/" comme valeur

# Redéployer
vercel --prod
```

---

## ✅ Checklist

- [ ] Vérifier dans Vercel Dashboard que `VITE_BASE_PATH` n'existe pas ou est à `/`
- [ ] Supprimer ou corriger la variable si nécessaire
- [ ] Redéployer l'application
- [ ] Vérifier que `https://doogoo.vercel.app/` fonctionne sans `/Doogoo/`
- [ ] Tester quelques routes (dashboard, login, etc.)

---

## 🆘 En cas de problème

Si après correction, l'URL contient toujours `/Doogoo/` :

1. **Vérifier le cache du navigateur** : Ctrl+Shift+R (Windows/Linux) ou Cmd+Shift+R (Mac)
2. **Vérifier le dernier déploiement** : Vercel Dashboard → Deployments → Vérifier que le build est récent
3. **Vérifier les logs de build** : Vercel Dashboard → Deployments → Dernier déploiement → Logs
4. **Vérifier que le build utilise bien** `base: '/'` dans les logs

---

**Dernière mise à jour** : 2025-01-02
