# 🚀 Intégration Vercel + GitHub Actions

## Configuration actuelle

**Status :** ✅ GitHub connecté à Vercel via l'interface Vercel

Cela signifie que :

- Chaque push sur `main` déclenche **automatiquement** un déploiement Vercel
- Les previews sont créées pour chaque PR
- Vercel gère les builds et déploiements automatiquement

---

## Workflow complet

### 1️⃣ GitHub Actions (CI/CD)

Le workflow `.github/workflows/ci.yml` s'exécute sur chaque push/PR :

1. **Lint & Type Check** → Valide le code
2. **Tests unitaires** → Vérifie les tests
3. **i18n & Build** → Compile les traductions et build l'app
4. **Lighthouse Audit** → Analyse performance (optionnel)
5. **Auto-Release** → Crée tag + changelog (uniquement sur `main`)

### 2️⃣ Vercel (Déploiement)

Vercel écoute automatiquement les événements GitHub :

- **Push sur `main`** → Déploiement production (`https://doogoo.vercel.app`)
- **Pull Request** → Preview URL générée automatiquement
- **Push sur `develop`** → Preview staging (si configuré)

---

## Variables d'environnement Vercel

Assurez-vous que ces variables sont configurées dans Vercel Dashboard :

**Obligatoires :**

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

**Optionnelles :**

```
VITE_GA4_MEASUREMENT_ID
VITE_PLAUSIBLE_DOMAIN
VITE_ENABLE_ANALYTICS
VITE_APP_NAME
VITE_ADMIN_EMAIL
```

### Configuration dans Vercel

1. Aller dans **Project Settings** → **Environment Variables**
2. Ajouter chaque variable pour :
   - **Production** : `main` branch
   - **Preview** : Toutes les branches (optionnel)
   - **Development** : `develop` branch (optionnel)

---

## Processus de release

### Release normale

```bash
# 1. Développement sur feature branch
git checkout -b feature/new-feature
# ... développements ...

# 2. Tests locaux
npm run lint:check
npm run test:unit
npm run build

# 3. Commit avec convention
git commit -m "feat(property): add new feature"
git push origin feature/new-feature

# 4. Pull Request
# → GitHub Actions vérifie le code
# → Vercel crée une preview URL

# 5. Merge vers main
# → GitHub Actions exécute CI/CD complète
# → Auto-release (si commits suivent convention)
# → Vercel déploie automatiquement en production
```

### Hotfix

```bash
# 1. Créer branch hotfix depuis main
git checkout main
git pull
git checkout -b hotfix/fix-critical-bug

# 2. Corriger le bug
# ... corrections ...

# 3. Commit
git commit -m "fix(payments): handle undefined error"
git push origin hotfix/fix-critical-bug

# 4. Merge vers main
# → Patch version auto-créée (0.2.2 → 0.2.3)
# → Vercel déploie immédiatement
```

---

## Vérification du bon fonctionnement

### Checklist

- [ ] **GitHub Actions** : Vérifier que le workflow s'exécute sur chaque push
  - Aller dans `Actions` tab sur GitHub
  - Vérifier que les jobs passent au vert ✅

- [ ] **Vercel Dashboard** : Vérifier les déploiements
  - Aller sur `https://vercel.com/dashboard`
  - Voir les déploiements récents
  - Vérifier les logs de build

- [ ] **Preview URLs** : Tester les previews sur PR
  - Créer une PR de test
  - Vérifier qu'une preview URL est générée
  - Tester l'application sur la preview

- [ ] **Production** : Vérifier le déploiement automatique
  - Merge une PR vers `main`
  - Attendre quelques secondes
  - Vérifier que `https://doogoo.vercel.app` est mis à jour

---

## Dépannage

### Build échoue dans Vercel

1. Vérifier les **Environment Variables** dans Vercel Dashboard
2. Vérifier les **logs de build** dans Vercel
3. Tester en local : `npm run build`

### GitHub Actions échoue

1. Vérifier les **secrets GitHub** (si utilisés)
2. Vérifier les **logs du workflow** dans `Actions` tab
3. Tester localement :
   ```bash
   npm run lint:check
   npm run test:unit
   npm run build
   ```

### Release ne se crée pas automatiquement

1. Vérifier que les commits suivent la **convention** (feat:, fix:, etc.)
2. Vérifier que le push est sur `main` branch`
3. Vérifier les logs du job `release` dans GitHub Actions

---

## Améliorations futures

- [ ] Configurer **RenovateBot** pour mises à jour automatiques de dépendances
- [ ] Ajouter **Playwright** pour tests E2E automatisés
- [ ] Configurer **Sentry** pour monitoring erreurs production
- [ ] Ajouter **Slack/Discord notifications** pour déploiements

---

**Résultat :**

Doogoo a maintenant un pipeline **complètement automatisé** :

- ✅ Code validé avant merge (GitHub Actions)
- ✅ Build automatique et déploiement (Vercel)
- ✅ Versioning automatique (standard-version)
- ✅ Changelog auto-généré
- ✅ Previews pour chaque PR

Tout est connecté et fonctionnel ! 🎉
