# ✅ Checklist de release v0.1.0

Cette checklist vous guide pour préparer et publier la première release de Vylo.

## 📋 Préparation

### Code et fonctionnalités

- [x] Toutes les fonctionnalités principales implémentées
- [x] Landing page complète
- [x] Dashboard fonctionnel
- [x] Données mockées en place
- [x] Design responsive vérifié
- [x] Navigation fonctionnelle

### Tests

- [ ] Tests unitaires passent (si configurés)
- [ ] Build production réussi : `npm run build`
- [ ] Pas d'erreurs console en développement
- [ ] Navigation testée sur Chrome, Firefox, Safari
- [ ] Responsive testé sur mobile, tablette, desktop

### Documentation

- [x] README complet et à jour
- [x] CHANGELOG.md avec v0.1.0
- [x] CONTRIBUTING.md créé
- [x] CODE_OF_CONDUCT.md créé
- [x] Documentation technique dans `docs/`
- [ ] Screenshots ajoutés (optionnel pour v0.1.0)

### Configuration

- [x] `.gitignore` complet
- [x] `package.json` avec métadonnées correctes
- [x] `vite.config.js` configuré pour GitHub Pages
- [x] Workflows GitHub Actions créés
- [ ] Base path dans `vite.config.js` adapté à votre repo

---

## 🚀 Étapes de release

### 1. Préparer le code

```bash
# S'assurer d'être sur main
git checkout main
git pull origin main

# Vérifier que tout fonctionne
npm install
npm run build
npm run preview  # Tester le build
```

### 2. Mettre à jour les versions

- [ ] Vérifier `package.json` : `"version": "0.1.0"`
- [ ] Vérifier `CHANGELOG.md` : Entrée `[0.1.0]` complète
- [ ] Vérifier `README.md` : Informations à jour

### 3. Commit final

```bash
# Commit des derniers changements
git add .
git commit -m "chore: préparation release v0.1.0"
git push origin main
```

### 4. Créer le tag

```bash
# Créer un tag annoté
git tag -a v0.1.0 -m "Release v0.1.0 - Version initiale

- Landing page complète
- Dashboard avec statistiques
- Liste des biens immobiliers
- Section paiements
- Aperçu sécurité
- Design responsive"

# Pousser le tag
git push origin v0.1.0
```

### 5. Créer la release sur GitHub

1. Aller sur GitHub → **Releases** → **Draft a new release**
2. **Tag** : Sélectionner `v0.1.0`
3. **Titre** : `v0.1.0 - Version initiale`
4. **Description** : Copier depuis `CHANGELOG.md`
5. Cocher **Set as the latest release**
6. Cliquer sur **Publish release**

### 6. Vérifier le déploiement

- [ ] GitHub Actions workflow déclenché automatiquement
- [ ] Build réussi dans l'onglet **Actions**
- [ ] Déploiement sur GitHub Pages réussi
- [ ] Application accessible sur `https://votre-username.github.io/vylo/`
- [ ] Toutes les routes fonctionnent (`/` et `/dashboard`)

---

## 🔍 Post-release

### Vérifications

- [ ] Badges CI/CD dans le README fonctionnent
- [ ] Lien "Démo Live" fonctionne
- [ ] Documentation accessible
- [ ] Aucune régression introduite

### Communication

- [ ] Annoncer la release (optionnel)
- [ ] Mettre à jour les issues liées
- [ ] Documenter les problèmes connus si nécessaire

---

## 📝 Notes importantes

### Configuration GitHub Pages

**⚠️ Action requise avant le premier déploiement** :

1. Aller dans **Settings** → **Pages**
2. **Source** : Sélectionner **GitHub Actions**
3. Sauvegarder

### Base path dans vite.config.js

**⚠️ Important** : Remplacez `/vylo/` par le nom exact de votre repository :

```javascript
const base =
  process.env.NODE_ENV === 'production'
    ? '/nom-de-votre-repo/' // ⚠️ À modifier
    : '/'
```

### 404.html

**⚠️ Important** : Mettez à jour le chemin dans `public/404.html` :

```javascript
const base = '/nom-de-votre-repo/' // ⚠️ À modifier
```

---

## 🐛 Problèmes courants

### Build échoue

- Vérifier les dépendances : `npm ci`
- Vérifier les erreurs dans les logs GitHub Actions
- Tester localement : `npm run build`

### Déploiement ne se déclenche pas

- Vérifier que GitHub Pages est activé avec "GitHub Actions"
- Vérifier que le workflow `.github/workflows/deploy.yml` existe
- Vérifier les permissions du repository

### Page blanche après déploiement

- Vérifier le base path dans `vite.config.js`
- Vérifier le base path dans `public/404.html`
- Vérifier les chemins des assets dans la console du navigateur

---

## ✅ Statut de la release

- **Version** : v0.1.0
- **Date prévue** : 2024-12-04
- **Statut** : 🟡 En préparation

---

**Une fois toutes les cases cochées, vous êtes prêt pour la release !** 🎉
