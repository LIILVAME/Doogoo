# 🧪 Guide de Test PWA - Doogoo

Ce guide détaille comment tester manuellement toutes les fonctionnalités PWA de Doogoo.

---

## 📋 Prérequis

1. Build de production : `npm run build`
2. Serveur de preview : `npm run preview`
3. Navigateur moderne : Chrome/Edge (desktop ou mobile)

---

## 🧩 Test 1 : Vérification de l'Installabilité

### Sur Desktop (Chrome/Edge)

1. Ouvrir `http://localhost:4173`
2. Attendre le chargement complet
3. Vérifier dans la barre d'adresse :
   - Icône d'installation (➕) ou "Installer" visible
4. Cliquer sur "Installer Doogoo"
5. Confirmer l'installation
6. **Résultat attendu** : L'application s'ouvre en mode standalone (sans barre d'adresse)

### Sur Mobile (Android)

1. Ouvrir l'URL dans Chrome
2. Menu (⋮) > "Ajouter à l'écran d'accueil"
3. Confirmer
4. **Résultat attendu** : L'icône Doogoo apparaît sur l'écran d'accueil

---

## 🧩 Test 2 : Mode Offline

### Étape 1 : Préparer le cache

1. Ouvrir l'application en ligne
2. Ouvrir DevTools (F12)
3. Aller dans **Application** > **Service Workers**
4. Vérifier que le service worker est **Activated**
5. Naviguer dans l'application (Dashboard, Biens, etc.)
6. Attendre quelques secondes pour que le cache soit rempli

### Étape 2 : Tester hors ligne

1. Dans DevTools, aller dans **Network**
2. Cocher **Offline**
3. Recharger la page (F5)
4. **Résultat attendu** : La page se charge depuis le cache
5. Naviguer entre les pages
6. **Résultat attendu** : Navigation fonctionne

### Étape 3 : Vérifier les données en cache

1. Dans DevTools > **Application** > **Cache Storage**
2. Vérifier les caches :
   - `workbox-precache-*` : Assets statiques
   - `supabase-api-cache` : Données API Supabase
   - `google-fonts-*` : Polices Google

---

## 🧩 Test 3 : Mise à jour Automatique

### Simuler une mise à jour

1. Faire une modification dans le code (ex: changer un texte)
2. Rebuilder : `npm run build`
3. Redémarrer le serveur : `npm run preview`
4. Dans l'application installée, recharger la page
5. **Résultat attendu** : Nouvelle version se charge automatiquement

### Vérifier dans DevTools

1. **Application** > **Service Workers**
2. Vérifier "Update on reload" pour forcer les mises à jour
3. Observer les logs de console pour `onNeedRefresh()`

---

## 🧩 Test 4 : Validation du Manifest

### Vérification manuelle

1. Ouvrir `http://localhost:4173/manifest.webmanifest`
2. Vérifier la structure JSON
3. Tester avec [Web App Manifest Validator](https://manifest-validator.appspot.com/)

### Critères à vérifier

- ✅ `name` : Présent et descriptif
- ✅ `short_name` : Présent (max 12 caractères recommandé)
- ✅ `start_url` : `/` (point d'entrée)
- ✅ `display` : `standalone` ou `fullscreen`
- ✅ `theme_color` : `#22c55e` (vert Doogoo)
- ✅ `background_color` : `#ffffff`
- ✅ `icons` : Au moins une icône 192x192 et 512x512

---

## 🧩 Test 5 : Service Worker

### Vérification dans DevTools

1. **Application** > **Service Workers**
2. Vérifier :
   - **Status** : `activated and is running`
   - **Source** : `sw.js`
   - **Scope** : `/`

### Test de fonctionnement

1. Console du navigateur : `navigator.serviceWorker.controller`
2. **Résultat attendu** : Retourne l'objet ServiceWorkerRegistration
3. Console : `navigator.serviceWorker.getRegistrations()`
4. **Résultat attendu** : Tableau avec au moins un service worker

---

## 🧩 Test 6 : Stratégies de Cache

### Vérifier le cache des assets

1. Aller dans **Application** > **Cache Storage**
2. Vérifier `workbox-precache-*`
3. **Contenu attendu** :
   - `index.html`
   - Assets JS/CSS
   - Icônes PNG

### Tester le cache API Supabase

1. Faire une requête API (ex: charger les biens)
2. Passer en mode offline
3. Recharger la page
4. **Résultat attendu** : Les données en cache s'affichent

---

## 📊 Audit Lighthouse Complet

### Exécution

```bash
npm run audit:lighthouse
```

Cela va :

1. Lancer un build de production
2. Démarrer le serveur de preview
3. Exécuter Lighthouse
4. Générer un rapport HTML et JSON dans `docs/audits/`

### Scores à atteindre

- **Performance** : > 80 (objectif : > 90)
- **Accessibilité** : > 90
- **Bonnes pratiques** : > 90
- **SEO** : > 90
- **PWA** : **100** (critique)

### Critères PWA dans Lighthouse

1. ✅ **Installable** : Manifest valide + HTTPS + Service Worker
2. ✅ **Service Worker** : Actif et fonctionnel
3. ✅ **Manifest** : Présent et valide
4. ✅ **Offline** : Page accessible hors ligne
5. ✅ **HTTPS** : Requis en production

---

## 🐛 Dépannage

### Le service worker ne s'enregistre pas

- Vérifier que vous êtes en **production** (`npm run build` puis `npm run preview`)
- Vérifier la console pour les erreurs
- Vérifier que le fichier `sw.js` est accessible

### L'application ne fonctionne pas hors ligne

- Vérifier que le service worker est **activé** dans DevTools
- Vérifier que le cache est rempli avant de passer offline
- Vérifier les stratégies de cache dans `vite.config.js`

### L'icône d'installation n'apparaît pas

- Vérifier que le manifest est accessible
- Vérifier que toutes les icônes requises sont présentes
- Vérifier que vous êtes en HTTPS (ou localhost)

---

## ✅ Checklist Complète

Avant de considérer le PWA comme "production-ready" :

- [ ] Manifest valide et accessible
- [ ] Service Worker actif et fonctionnel
- [ ] Toutes les icônes présentes (8 tailles)
- [ ] Mode offline fonctionne
- [ ] Installation testée sur desktop
- [ ] Installation testée sur mobile
- [ ] Mise à jour automatique fonctionne
- [ ] Scores Lighthouse > 90
- [ ] Audit Lighthouse PWA = 100
- [ ] Testé en HTTPS (production)

---

**Dernière mise à jour** : 2025-11-01
