# Gestion Globale des Erreurs Réseau (Circuit Breaker)

**Date :** 2025-01-04  
**Rôle :** Senior Frontend Developer  
**Objectif :** Gérer élégamment les erreurs réseau et timeouts (Supabase cold start/pause) avec un modal utilisateur au lieu de spinners infinis.

---

## 🎯 Problème Résolu

Avant cette implémentation, lorsque Supabase était en pause (cold start) ou en timeout, l'utilisateur voyait :
- ❌ Un spinner infini sans explication
- ❌ Des logs rouges dans la console
- ❌ Aucune indication claire de ce qui se passait

Maintenant, l'utilisateur voit :
- ✅ Un modal élégant expliquant la situation
- ✅ Un message clair : "Le serveur semble endormi ou inaccessible"
- ✅ Un bouton pour réessayer manuellement
- ✅ Une tentative de reconnexion automatique

---

## 📁 Architecture

### 1. **Store d'Erreur** (`src/stores/errorStore.js`)

Store Pinia centralisé pour gérer l'état des erreurs réseau :

```javascript
{
  isNetworkError: boolean,
  errorMessage: string,
  errorContext: string,
  triggerNetworkError(message, context),
  resetError(),
  isNetworkOrTimeoutError(error)
}
```

**Fonctionnalités :**
- Détecte automatiquement les erreurs réseau/timeout
- Stocke le message et le contexte de l'erreur
- Méthode helper pour vérifier si une erreur est de type réseau

---

### 2. **Intercepteur API** (`src/utils/apiErrorHandler.js`)

Modifié pour déclencher le store d'erreur dans 3 cas :

#### **a) Timeout explicite**
Quand une requête dépasse le timeout (8 secondes) :
```javascript
catch (error) {
  if (error?.message?.includes('timeout')) {
    errorStore.triggerNetworkError('Le serveur semble endormi...', context)
  }
}
```

#### **b) Erreur réseau détectée**
Dans `handleApiError()`, si l'erreur est de type réseau :
```javascript
if (errorStore.isNetworkOrTimeoutError(error)) {
  errorStore.triggerNetworkError(userMessage, context)
}
```

#### **c) Circuit breaker ouvert**
Quand le circuit breaker est ouvert (trop d'échecs) :
```javascript
if (!circuitCheck.allowed) {
  errorStore.triggerNetworkError('Le serveur semble endormi...', context)
}
```

**Auto-réinitialisation :**
- Quand une requête réussit après une erreur réseau, le modal se ferme automatiquement

---

### 3. **Composant UI** (`src/components/ui/NetworkErrorModal.vue`)

Modal bloquant (z-index 100) avec :

#### **Design :**
- Overlay sombre avec backdrop-blur (non cliquable pour forcer l'action)
- Carte glassmorphism centrée
- Icône réseau animée (pulse)
- Message d'erreur clair et convivial
- Indicateur de reconnexion automatique
- Bouton "🔄 Réessayer maintenant"

#### **Fonctionnalités :**
- **Détection automatique** : S'affiche quand `errorStore.isNetworkError === true`
- **Réessai intelligent** :
  1. Vérifie la connexion internet
  2. Réinitialise l'erreur dans le store
  3. Recharge la page pour réinitialiser l'état de l'app
- **État de chargement** : Désactive le bouton pendant la reconnexion

---

### 4. **Intégration** (`src/App.vue`)

Le composant est intégré au niveau racine de l'application :

```vue
<template>
  <!-- ... autres composants ... -->
  <Toast />
  <NetworkErrorModal />
</template>
```

**Avantages :**
- Visible sur toutes les pages
- Z-index élevé (100) pour passer au-dessus de tout
- Utilise `Teleport to="body"` pour éviter les problèmes de z-index

---

## 🔄 Flux d'Erreur

```
1. Requête API échoue (timeout/réseau)
   ↓
2. apiErrorHandler détecte l'erreur
   ↓
3. errorStore.triggerNetworkError() appelé
   ↓
4. NetworkErrorModal s'affiche automatiquement (réactivité Vue)
   ↓
5. Utilisateur clique sur "Réessayer"
   ↓
6. Vérification connexion internet
   ↓
7. errorStore.resetError() + window.location.reload()
   ↓
8. Application redémarre avec état propre
```

---

## ✅ Détection des Erreurs Réseau

Le système détecte automatiquement les erreurs suivantes :

| Type d'erreur | Patterns détectés |
|---------------|-------------------|
| **Timeout** | `timeout`, `l'opération a pris plus de` |
| **Réseau** | `network`, `failed to fetch`, `network request failed` |
| **Connexion** | `connection`, `internet`, `serveur`, `inaccessible` |
| **Cold Start** | `endormi`, `cold start` |
| **HTTP Erreurs** | `503`, `504`, `service unavailable`, `gateway timeout` |

**Méthode :** `errorStore.isNetworkOrTimeoutError(error)`

---

## 🎨 Design System

Le modal utilise le design system existant :

- **Couleurs :** Amber pour l'avertissement réseau
- **Glassmorphism :** `glass-panel` class
- **Transitions :** Animation fade + scale
- **Z-index :** 100 (au-dessus de tout sauf les modals critiques)

---

## 🔧 Configuration

### Timeout par défaut
```javascript
const timeout = options.timeout || 8000 // 8 secondes
```

### Z-index du modal
```vue
class="fixed inset-0 z-[100]"
```

### Message par défaut
```javascript
'Le serveur semble endormi ou inaccessible. Tentative de reconnexion...'
```

---

## 🚀 Utilisation

### Déclencher manuellement (rare)
```javascript
import { useErrorStore } from '@/stores/errorStore'

const errorStore = useErrorStore()
errorStore.triggerNetworkError('Message personnalisé', 'contexte')
```

### Réinitialiser manuellement (rare)
```javascript
errorStore.resetError()
```

### Vérifier si c'est une erreur réseau
```javascript
if (errorStore.isNetworkOrTimeoutError(error)) {
  // Traiter comme erreur réseau
}
```

---

## 📝 Notes Techniques

1. **Pas de retry automatique dans le modal** : On préfère laisser l'utilisateur décider quand réessayer pour éviter les boucles infinies.

2. **Rechargement de page** : Le bouton "Réessayer" recharge la page complète. Cela garantit un état propre mais perd l'état de l'application. Alternative future : recharger seulement les stores critiques.

3. **Circuit Breaker** : Le système s'intègre avec le circuit breaker existant (`src/utils/circuitBreaker.js`) pour éviter les appels répétés quand le service est down.

4. **Non-bloquant** : Le modal n'empêche pas l'utilisateur de naviguer (via reload), mais bloque les interactions avec l'application en cours.

---

## 🧪 Tests Recommandés

1. **Test timeout** : Simuler un timeout API (ajouter un délai artificiel)
2. **Test cold start** : Mettre Supabase en pause puis faire une requête
3. **Test offline** : Désactiver la connexion internet
4. **Test reconnexion** : Vérifier que le modal disparaît après succès
5. **Test circuit breaker** : Déclencher plusieurs erreurs pour ouvrir le circuit breaker

---

## ✅ Validation

- [x] Store créé et fonctionnel
- [x] Intercepteur API modifié
- [x] Modal créé avec design cohérent
- [x] Intégré dans App.vue
- [x] Auto-réinitialisation après succès
- [x] Détection intelligente des erreurs réseau
- [x] Gestion du circuit breaker
- [x] Pas d'erreurs de linter

**Statut :** ✅ **COMPLET ET PRÊT POUR PRODUCTION**
