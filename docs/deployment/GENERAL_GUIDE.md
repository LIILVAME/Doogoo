# 🚀 Guide de déploiement

Ce guide explique comment déployer Doogoo sur GitHub Pages et d'autres plateformes.

## 📋 Prérequis

- Compte GitHub
- Repository GitHub configuré
- GitHub Actions activé

---

## 🌐 Déploiement sur GitHub Pages

### Configuration automatique (recommandé)

Le projet est configuré pour se déployer automatiquement via GitHub Actions.

#### 1. Activer GitHub Pages

1. Allez dans **Settings** → **Pages** de votre repository
2. Sous **Source**, sélectionnez **GitHub Actions**
3. Le workflow `.github/workflows/deploy.yml` se déclenchera automatiquement

#### 2. Déclenchement du déploiement

Le déploiement se déclenche automatiquement sur :

- ✅ Push sur `main` ou `master`
- ✅ Création d'un tag `v*` (ex: `v0.1.0`)
- ✅ Action manuelle via **Actions** → **Workflow dispatch**

#### 3. URL de déploiement

Votre application sera disponible sur :

```
https://votre-username.github.io/vylo/
```

### Configuration manuelle

Si vous préférez déployer manuellement :

```bash
# Build le projet
npm run build

# Le dossier dist/ contient les fichiers à déployer
# Vous pouvez les pousser sur la branche gh-pages
```

---

## 🔧 Configuration Vite pour GitHub Pages

Le fichier `vite.config.js` doit être configuré avec la base correcte :

```javascript
export default defineConfig({
  base:
    process.env.NODE_ENV === 'production'
      ? '/vylo/' // Remplacez 'vylo' par votre nom de repo
      : '/'
  // ... reste de la config
})
```

**Important** : Remplacez `/vylo/` par le nom exact de votre repository GitHub.

---

## 🏷️ Créer une release

### 1. Créer un tag

```bash
# Créer un tag annoté
git tag -a v0.1.0 -m "Release version 0.1.0"

# Pousser le tag
git push origin v0.1.0
```

### 2. Créer une release sur GitHub

1. Allez dans **Releases** → **Draft a new release**
2. Sélectionnez le tag créé (ex: `v0.1.0`)
3. Remplissez le titre et la description (copiez depuis CHANGELOG.md)
4. Publiez la release

Le déploiement se déclenchera automatiquement.

---

## 🔄 Workflow de déploiement

```
Push/Tag → GitHub Actions → Build → Deploy → GitHub Pages
```

### Étapes du workflow

1. **Checkout** : Récupère le code
2. **Setup Node.js** : Configure Node.js 18 avec cache npm
3. **Install** : `npm ci` (installation propre)
4. **Build** : `npm run build` (génère `dist/`)
5. **Upload** : Upload l'artifact `dist/`
6. **Deploy** : Déploie sur GitHub Pages

---

## 🌍 Déploiement sur d'autres plateformes

### Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

Configuration recommandée dans `vercel.json` :

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Netlify

1. Connectez votre repository GitHub
2. Configuration :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
   - **Framework preset** : Vite

### Netlify CLI

```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Déployer
netlify deploy --prod --dir=dist
```

### Firebase Hosting

```bash
# Installer Firebase CLI
npm i -g firebase-tools

# Initialiser
firebase init hosting

# Build
npm run build

# Déployer
firebase deploy --only hosting
```

Configuration `firebase.json` :

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## ✅ Vérification du déploiement

### Checklist post-déploiement

- [ ] L'application charge correctement
- [ ] Les routes fonctionnent (testez `/` et `/dashboard`)
- [ ] Les assets (CSS, JS, images) se chargent
- [ ] Le design responsive fonctionne
- [ ] Les liens internes fonctionnent
- [ ] Console du navigateur sans erreurs

### Tests de régression

```bash
# Après déploiement, tester :
1. Navigation entre les pages
2. Responsive sur mobile/tablette
3. Chargement des images
4. Affichage des données mockées
```

---

## 🐛 Dépannage

### Problème : Page blanche

**Cause** : Base path incorrect dans `vite.config.js`

**Solution** : Vérifiez que `base` correspond au nom de votre repo

### Problème : Assets 404

**Cause** : Chemins relatifs incorrects

**Solution** : Vérifiez que `base` est configuré correctement

### Problème : Route 404

**Cause** : GitHub Pages ne gère pas le routing SPA par défaut

**Solution** : Ajoutez un fichier `404.html` qui redirige vers `index.html` :

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Doogoo</title>
    <script>
      sessionStorage.redirect = location.href
      location.replace(location.href.replace(/\/vylo\/.*/, '/vylo/'))
    </script>
  </head>
  <body></body>
</html>
```

---

## 📊 Monitoring du déploiement

### GitHub Actions

Consultez l'onglet **Actions** pour voir :

- ✅ Statut des builds
- ⏱️ Temps d'exécution
- 📋 Logs détaillés
- ❌ Erreurs éventuelles

### Badges de statut

Les badges dans le README affichent automatiquement le statut :

- 🟢 Vert : Build réussi
- 🔴 Rouge : Build échoué
- 🟡 Jaune : Build en cours

---

## 🔐 Variables d'environnement

Pour la production, vous pouvez définir des variables dans GitHub Actions :

```yaml
env:
  VITE_API_URL: ${{ secrets.API_URL }}
  VITE_APP_ENV: production
```

Puis utilisez-les dans votre code :

```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

---

## 📝 Notes importantes

- Le déploiement est automatique sur push vers `main`
- Les tags `v*` déclenchent aussi un déploiement
- Le cache npm accélère les builds
- Les artifacts sont automatiquement nettoyés après déploiement

---

**Dernière mise à jour** : 2024-12-04
