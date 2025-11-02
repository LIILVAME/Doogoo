# 📱 Configuration PWA — Doogoo v0.2.2+

**Date** : 2025-01-28  
**Objectif** : Vérifier et documenter la configuration PWA

---

## ✅ Configuration actuelle

### 1. **Vite Plugin PWA** ✅

**Plugin** : `vite-plugin-pwa` v1.1.0

**Configuration** (`vite.config.js`) :

```js
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'robots.txt'],
  manifest: {
    /* ... */
  },
  workbox: {
    /* ... */
  }
})
```

---

### 2. **Manifest.json** ✅

**Propriétés** :

- ✅ `name` : "Doogoo - Smart Property Monitoring & Analytics"
- ✅ `short_name` : "Doogoo"
- ✅ `theme_color` : "#22c55e" (vert Doogoo)
- ✅ `background_color` : "#ffffff"
- ✅ `display` : "standalone"
- ✅ `orientation` : "portrait"
- ✅ `start_url` : "/"
- ✅ `scope` : "/"

---

### 3. **Icônes PWA** ✅

**Tailles générées** :

- ✅ 72x72
- ✅ 96x96
- ✅ 128x128
- ✅ 144x144
- ✅ 152x152
- ✅ 192x192
- ✅ 384x384
- ✅ 512x512

**Format** : PNG + SVG (si sharp installé)

**Génération** :

```bash
npm run pwa:icons
```

**Emplacement** : `/public/icons/`

---

### 4. **Service Worker** ✅

**Génération** : Automatique via Workbox

**Stratégies de cache** :

- ✅ **Google Fonts** : `CacheFirst` (1 an)
- ✅ **Supabase API** : `NetworkFirst` (24h)
- ✅ **Unsplash Images** : `CacheFirst` (7 jours)
- ✅ **Assets statiques** : Precaching automatique

**Configuration** :

- ✅ `cleanupOutdatedCaches: true`
- ✅ `skipWaiting: true`
- ✅ `clientsClaim: true`
- ✅ `navigateFallback: '/index.html'`

---

### 5. **Registration** ✅

**Fichier** : `src/main.js`

**Code** :

```js
import('virtual:pwa-register').then(({ registerSW }) => {
  registerSW({
    immediate: true
  })
})
```

**Type** : `autoUpdate` (mise à jour automatique en arrière-plan)

---

## 📋 Checklist PWA

### Manifest

- [x] Manifest.json valide
- [x] Toutes les icônes présentes (72x72 → 512x512)
- [x] Theme color défini
- [x] Start URL configuré
- [x] Display mode : standalone

### Service Worker

- [x] SW généré automatiquement
- [x] Strategies de cache configurées
- [x] Precaching activé
- [x] Navigation fallback configurée

### Icônes

- [x] Script de génération disponible (`pwa:icons`)
- [x] Toutes les tailles générées
- [x] Format PNG disponible

### Installation

- [x] App peut être installée sur mobile/desktop
- [x] Banner d'installation (géré par le navigateur)

---

## 🧪 Tests

### Chrome DevTools

1. Ouvrir DevTools → Application → Manifest
2. Vérifier que le manifest est valide
3. Vérifier que toutes les icônes sont chargées

### Lighthouse

```bash
npm run audit:lighthouse
```

**Objectifs PWA** :

- ✅ Installable
- ✅ Service Worker actif
- ✅ Manifest valide
- ✅ Thème couleur configuré

### Manuel

1. Ouvrir l'app dans Chrome mobile
2. Menu → "Installer l'application"
3. Vérifier que l'app s'ouvre en standalone
4. Vérifier que le SW est actif (DevTools → Application → Service Workers)

---

## 🔄 Mises à jour PWA

### Auto-Update

- **Type** : `autoUpdate`
- **Comportement** : Le SW se met à jour automatiquement en arrière-plan
- **Notif utilisateur** : Optionnelle (gérée par le navigateur)

### Skip Waiting

- **Activé** : `skipWaiting: true`
- **Effet** : Nouveau SW active immédiatement sans attendre la fermeture des onglets

---

## 📝 Notes

- Le SW est généré automatiquement lors du build
- Les icônes doivent être générées avec `npm run pwa:icons`
- Le manifest est inclus dans `index.html` automatiquement
- La registration se fait automatiquement au chargement de l'app

---

**Statut** : ✅ PWA complètement configurée  
**Prochaine étape** : Test Lighthouse pour valider les scores PWA
