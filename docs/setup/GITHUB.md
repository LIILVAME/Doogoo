# 🚀 Guide de configuration GitHub

Ce guide vous accompagne dans la configuration complète de votre repository GitHub pour Vylo.

## 📋 Prérequis

- Compte GitHub
- Git installé localement
- Node.js 18+ installé

---

## 🔧 Configuration initiale

### 1. Créer le repository sur GitHub

1. Aller sur [GitHub](https://github.com/new)
2. **Repository name** : `vylo` (ou votre nom préféré)
3. **Description** : "Plateforme web de monitoring de biens immobiliers"
4. **Visibilité** : Public (recommandé) ou Private
5. Ne pas initialiser avec README, .gitignore ou licence (déjà présents)
6. Cliquer sur **Create repository**

### 2. Configurer le repository local

```bash
# Dans le dossier Vylo
git init
git add .
git commit -m "chore: initial commit - version 0.1.0"

# Ajouter le remote (remplacez votre-username)
git remote add origin https://github.com/votre-username/vylo.git

# Pousser vers GitHub
git branch -M main
git push -u origin main
```

### 3. Mettre à jour les configurations

**⚠️ IMPORTANT** : Remplacez `votre-username` et `vylo` par vos valeurs réelles dans :

#### `vite.config.js`

```javascript
const base =
  process.env.NODE_ENV === 'production'
    ? '/mon-nom-de-repo/' // ⚠️ À modifier
    : '/'
```

#### `public/404.html`

```javascript
const base = '/mon-nom-de-repo/' // ⚠️ À modifier
```

#### `README.md`

- Remplacer tous les `votre-username/vylo` par votre repo
- Mettre à jour les liens de badges CI/CD
- Mettre à jour le lien "Démo Live"

---

## 🔄 Configuration GitHub Pages

### 1. Activer GitHub Pages

1. Aller dans **Settings** → **Pages**
2. **Source** : Sélectionner **GitHub Actions**
3. Cliquer sur **Save**

### 2. Vérifier les workflows

Les workflows suivants doivent exister :

- `.github/workflows/deploy.yml` : Déploiement automatique
- `.github/workflows/ci.yml` : Tests et linting

### 3. Première activation

Après le premier push, le workflow se déclenchera automatiquement.

Vérifier dans **Actions** → le workflow devrait apparaître.

---

## 🏷️ Créer la première release

### 1. Préparer le tag

```bash
# S'assurer d'être à jour
git pull origin main

# Créer le tag
git tag -a v0.1.0 -m "Release v0.1.0 - Version initiale"

# Pousser le tag
git push origin v0.1.0
```

### 2. Créer la release sur GitHub

1. **Releases** → **Draft a new release**
2. **Tag** : `v0.1.0`
3. **Titre** : `v0.1.0 - Version initiale`
4. **Description** : Copier depuis `CHANGELOG.md`
5. **Publish release**

### 3. Vérifier le déploiement

- L'application sera disponible sur : `https://votre-username.github.io/vylo/`
- Vérifier que toutes les routes fonctionnent
- Tester sur mobile et desktop

---

## 🔐 Configuration de sécurité

### 1. Secrets (si nécessaire)

Pour les variables d'environnement :

1. **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**
3. Ajouter vos secrets (ex: `API_URL`, `API_KEY`)

### 2. Branch protection (optionnel)

Pour protéger la branche `main` :

1. **Settings** → **Branches**
2. **Add rule** pour `main`
3. Cocher :
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date

---

## 📊 Badges et métriques

### Badges dans le README

Les badges suivants seront automatiquement mis à jour :

- ✅ **CI** : Statut des tests
- ✅ **Deploy** : Statut du déploiement
- ✅ **GitHub Pages** : Lien vers la démo

### Vérification

Après le premier push, vérifier que les badges fonctionnent dans le README.

---

## 📝 Templates GitHub

Les templates suivants sont déjà configurés :

- ✅ **Pull Request** : `.github/PULL_REQUEST_TEMPLATE.md`
- ✅ **Bug Report** : `.github/ISSUE_TEMPLATE/bug_report.md`
- ✅ **Feature Request** : `.github/ISSUE_TEMPLATE/feature_request.md`

Ils apparaîtront automatiquement lors de la création d'une PR ou d'une issue.

---

## ✅ Checklist finale

Avant de considérer la configuration comme complète :

- [ ] Repository créé sur GitHub
- [ ] Code poussé vers GitHub
- [ ] Base path mis à jour dans `vite.config.js`
- [ ] Base path mis à jour dans `public/404.html`
- [ ] README mis à jour avec vos liens
- [ ] GitHub Pages activé avec "GitHub Actions"
- [ ] Premier workflow exécuté avec succès
- [ ] Tag v0.1.0 créé et release publiée
- [ ] Application accessible sur GitHub Pages
- [ ] Badges CI/CD fonctionnent dans le README

---

## 🐛 Dépannage

### Workflow ne se déclenche pas

- Vérifier que GitHub Pages est configuré avec "GitHub Actions"
- Vérifier que les fichiers `.github/workflows/*.yml` existent
- Vérifier les permissions du repository

### Badges ne fonctionnent pas

- Attendre quelques minutes après le premier workflow
- Vérifier l'URL du badge (nom du workflow exact)
- Vérifier que le workflow s'est exécuté au moins une fois

### Déploiement échoue

- Vérifier les logs dans **Actions**
- Vérifier que `npm run build` fonctionne localement
- Vérifier les permissions GitHub Pages

---

## 📚 Ressources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**Une fois toutes les étapes complétées, votre projet est prêt pour la production !** 🎉
