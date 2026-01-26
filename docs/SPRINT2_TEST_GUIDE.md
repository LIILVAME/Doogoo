# 🧪 GUIDE DE TEST - SPRINT 2

**Date** : Janvier 2025  
**Sprint** : Sprint 2 - Thème & Micro-interactions  
**URL Dev** : `http://localhost:5173` (ou port affiché dans le terminal)

---

## ✅ CHECKLIST DE TEST

### 1. 🎨 Toggle Thème Clair/Sombre

#### Test 1.1 : Accès à la section Thème

- [ ] Aller sur `/parametres`
- [ ] Vérifier que la section "Thème" apparaît dans la sidebar (desktop) ou le menu déroulant (mobile)
- [ ] Cliquer sur "Thème"
- [ ] Vérifier que 3 options s'affichent : **Clair**, **Sombre**, **Automatique (système)**

#### Test 1.2 : Changement de thème

- [ ] Cliquer sur "Clair"
  - [ ] Vérifier que l'interface passe en mode clair (fond clair, texte sombre)
  - [ ] Vérifier que la transition est fluide (0.3s)
  - [ ] Vérifier que l'option "Clair" est sélectionnée (checkmark visible)
- [ ] Cliquer sur "Sombre"
  - [ ] Vérifier que l'interface passe en mode sombre (fond sombre, texte clair)
  - [ ] Vérifier que la transition est fluide
  - [ ] Vérifier que l'option "Sombre" est sélectionnée

- [ ] Cliquer sur "Automatique (système)"
  - [ ] Vérifier que le thème suit les préférences système
  - [ ] Changer les préférences système (macOS : System Preferences > Appearance)
  - [ ] Vérifier que l'interface s'adapte automatiquement

#### Test 1.3 : Persistance

- [ ] Changer le thème
- [ ] Recharger la page (F5)
- [ ] Vérifier que le thème choisi est conservé

#### Test 1.4 : Application globale

- [ ] Changer le thème depuis `/parametres`
- [ ] Naviguer vers `/dashboard`, `/biens`, `/locataires`
- [ ] Vérifier que le thème est appliqué partout

---

### 2. 📳 Haptic Feedback (Mobile uniquement)

**Note** : Le haptic feedback fonctionne uniquement sur appareils mobiles avec support de l'API Vibration.

#### Test 2.1 : Boutons

- [ ] Sur mobile/tablette, cliquer sur un bouton (ex: "Ajouter un bien")
- [ ] Vérifier qu'une vibration légère se produit (20ms)

#### Test 2.2 : Cartes de propriétés

- [ ] Sur mobile, cliquer sur une carte de propriété
- [ ] Vérifier qu'une vibration légère se produit (10ms)
- [ ] Cliquer sur "Modifier" ou "Supprimer"
- [ ] Vérifier qu'une vibration moyenne se produit (20ms)

#### Test 2.3 : Toasts

- [ ] Sur mobile, déclencher une action (ex: supprimer un bien)
- [ ] Vérifier qu'une vibration se produit lors de la fermeture du toast

**Note** : Sur desktop, aucune vibration ne doit se produire (normal).

---

### 3. ✨ Animations Améliorées

#### Test 3.1 : Toasts

- [ ] Déclencher une action (ex: créer un bien)
- [ ] Vérifier que le toast apparaît avec une animation slide-in fluide
- [ ] Vérifier que le toast a un léger effet de scale (zoom) à l'apparition
- [ ] Vérifier que le toast supporte le dark mode (couleurs adaptées)

#### Test 3.2 : Transitions

- [ ] Naviguer entre les pages
- [ ] Vérifier que les transitions sont fluides
- [ ] Changer de section dans les paramètres
- [ ] Vérifier que la transition fade fonctionne

---

### 4. 💀 Skeleton Loaders

#### Test 4.1 : Shimmer Effect

- [ ] Aller sur une page avec chargement (ex: `/biens` si pas de données)
- [ ] Vérifier que les skeleton loaders affichent un effet shimmer (gradient animé)
- [ ] Vérifier que l'animation est fluide (1.5s)
- [ ] Changer le thème (clair/sombre)
- [ ] Vérifier que les skeleton loaders s'adaptent au thème

#### Test 4.2 : Pages avec skeletons

- [ ] `/biens` - Vérifier les skeletons lors du chargement initial
- [ ] `/locataires` - Vérifier les skeletons lors du chargement initial
- [ ] `/paiements` - Vérifier les skeletons lors du chargement initial
- [ ] `/dashboard` - Vérifier les skeletons lors du chargement initial

---

### 5. 🎯 Tests d'Accessibilité

#### Test 5.1 : Prefers-reduced-motion

- [ ] Activer "Réduire les animations" dans les préférences système (macOS : Accessibility > Display)
- [ ] Vérifier que les animations sont désactivées
- [ ] Vérifier que le haptic feedback est désactivé (si activé)

#### Test 5.2 : Navigation clavier

- [ ] Utiliser Tab pour naviguer dans les paramètres
- [ ] Vérifier que le focus est visible
- [ ] Vérifier que le thème s'applique correctement avec le focus

---

## 🐛 PROBLÈMES CONNUS / À VÉRIFIER

### Problème potentiel 1 : Thème ne s'applique pas immédiatement

**Symptôme** : Le thème ne change pas au clic  
**Solution** : Vérifier la console (F12) pour les logs `applyTheme`

### Problème potentiel 2 : Haptic feedback ne fonctionne pas

**Symptôme** : Pas de vibration sur mobile  
**Causes possibles** :

- L'appareil ne supporte pas l'API Vibration
- Les vibrations sont désactivées dans les paramètres système
- `prefers-reduced-motion` est activé

### Problème potentiel 3 : Skeleton shimmer non visible

**Symptôme** : Pas d'effet shimmer sur les skeletons  
**Solution** : Vérifier que les données ne sont pas déjà chargées (vider le cache)

---

## 📊 RÉSULTATS ATTENDUS

### Thème

- ✅ 3 options fonctionnelles (Light, Dark, System)
- ✅ Application immédiate du thème
- ✅ Persistance après rechargement
- ✅ Support `prefers-color-scheme`

### Haptic Feedback

- ✅ Vibration sur boutons (mobile)
- ✅ Vibration sur cartes (mobile)
- ✅ Vibration sur toasts (mobile)
- ✅ Respecte `prefers-reduced-motion`

### Animations

- ✅ Toasts avec animation fluide
- ✅ Transitions entre pages
- ✅ Support dark mode

### Skeleton Loaders

- ✅ Shimmer effect visible
- ✅ Support dark mode
- ✅ Animation fluide

---

## 🚀 COMMANDES UTILES

```bash
# Démarrer le serveur de développement
npm run dev

# Build de production
npm run build

# Vérifier les erreurs de lint
npm run lint
```

---

## 📝 NOTES DE TEST

**Environnement de test** :

- Navigateur : Chrome/Edge/Safari (dernière version)
- Mobile : iOS Safari / Chrome Android
- OS : macOS / Windows / Linux

**Données de test** :

- Utiliser un compte avec des données existantes
- Ou créer des données de test (biens, locataires, paiements)

---

**Bon test ! 🎉**
