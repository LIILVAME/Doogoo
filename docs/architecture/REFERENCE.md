# 🏗️ Architecture Reference - Doogoo

**Version** : 1.0.0  
**Date** : 2025-01-28  
**Objectif** : Document de référence technique pour maintenir la cohérence architecturale

> **Note** : Ce document est la **Source of Truth** pour tous les développements futurs (IA ou développeurs humains). Il doit être respecté strictement pour garantir la cohérence du codebase.

---

## 📋 Table des matières

1. [Domain Models (Source of Truth)](#-domain-models-source-of-truth)
2. [The "Doogoo Store" Pattern](#-the-doogoo-store-pattern)
3. [Security & Data Guidelines](#️-security--data-guidelines)
4. [API Layer Pattern](#-api-layer-pattern)
5. [Realtime Subscription Pattern](#-realtime-subscription-pattern)
6. [Best Practices](#-best-practices)

---

## 1. 🧬 Domain Models (Source of Truth)

### Property (Bien Immobilier)

**Interface TypeScript** : `src/stores/propertiesStore.ts` → `PropertyData`

```typescript
interface PropertyData {
  id: string // UUID
  name: string // Nom du bien (ex: "Appartement Paris 15e")
  address?: string // Adresse complète (optionnel)
  city: string // Ville (obligatoire)
  status: 'occupied' | 'vacant' // Statut d'occupation
  rent: number // Loyer mensuel (toujours number, pas string)
  tenant: PropertyTenant | null // Locataire associé (null si vacant)
  surface: number // Surface en m² (0 si non renseigné)
  pieces: number // Nombre de pièces (0 si non renseigné)
  description: string // Description (chaîne vide si non renseigné)
  type: string // Type de bien (ex: "apartment", "house", "studio")
  image: string // URL de l'image (default: Unsplash)
}
```

**Locataire associé** : `PropertyTenant`

```typescript
interface PropertyTenant {
  id: string // UUID du locataire
  name: string // Nom complet du locataire
  entryDate: string // Date d'entrée (ISO format)
  exitDate: string | null // Date de sortie (null si toujours présent)
  rent: number // Loyer du locataire (number)
  status: 'on_time' | 'late' | 'pending' | 'paid' // Statut de paiement
}
```

**Relations** :

- `Property.tenant` → `PropertyTenant` (relation 1-1, nullable)
- `Property.id` → Utilisé comme `Payment.propertyId` et `Tenant.propertyId`

---

### Payment (Paiement)

**Interface TypeScript** : `src/stores/paymentsStore.ts` → `PaymentData`

```typescript
interface PaymentData {
  id: string // UUID
  propertyId: string // FK vers Property.id
  property: string // Nom de la propriété (dénormalisé pour affichage)
  tenant: string // Nom du locataire (dénormalisé pour affichage)
  amount: number // Montant (toujours number, pas string)
  dueDate: string // Date d'échéance (ISO format)
  status: 'paid' | 'pending' | 'late' // Statut du paiement
}
```

**Statuts possibles** :

- `'paid'` : Paiement effectué
- `'pending'` : En attente de paiement
- `'late'` : Paiement en retard

**Relations** :

- `Payment.propertyId` → `Property.id` (FK)
- `Payment` peut avoir un `tenant_id` optionnel (FK vers `Tenant.id`)

**Constantes** : Définies dans `src/utils/constants.js` → `TRANSACTION_STATUS`

```javascript
TRANSACTION_STATUS = {
  PAID: 'paid',
  LATE: 'late',
  PENDING: 'pending'
}
```

---

### Relations entre entités

```
Property (1) ──────< (N) Tenant
    │
    │ (1)
    │
    │
    └───────< (N) Payment
```

**Règles métier** :

- Un `Property` peut avoir **0 ou 1** `Tenant` (status `occupied` ou `vacant`)
- Un `Property` peut avoir **0 à N** `Payment` (historique des paiements)
- Un `Payment` est **toujours** lié à un `Property` (obligatoire)
- Un `Payment` peut être lié à un `Tenant` (optionnel, mais recommandé si bien occupé)

---

## 2. 🏗️ The "Doogoo Store" Pattern

### Structure Standard d'un Store

**Obligatoire** : Tous les stores doivent suivre cette structure exacte.

#### Imports Standards

```typescript
import { defineStore } from 'pinia'
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from './authStore'
import { useToastStore } from './toastStore'
import { useStoreLoader } from '@/composables/useStoreLoader'
import { sanitizeObject } from '@/utils/sanitizeLogs'
import type { RealtimeChannel } from '@supabase/supabase-js'
// API layer spécifique
import { myEntityApi } from '@/api'
```

#### Structure du Store

```typescript
export const useMyEntityStore = defineStore(
  'myEntity',
  () => {
    // ===== STATE =====
    const entities: Ref<MyEntityData[]> = ref([])
    const loading: Ref<boolean> = ref(false)
    const error: Ref<string | null> = ref(null)

    // Surveillance automatique du loading
    const { cleanup: _cleanupLoader } = useStoreLoader(loading, 'MyEntityStore')

    // Realtime (si applicable)
    let realtimeChannel: RealtimeChannel | null = null
    let isRealtimeInitialized = false
    let isRealtimeActive = false
    let lastFetchTime = 0
    const FETCH_CACHE_MS = 5000

    // ===== HELPER FUNCTIONS =====
    /**
     * Transforme les données de l'API vers le format du store
     */
    const transformEntityData = (data: EntityApiData): MyEntityData => {
      // Transformation avec validation des types
      return { ... }
    }

    // ===== ACTIONS =====
    /**
     * Récupère toutes les entités
     */
    const fetchEntities = async (force = false): Promise<void> => { ... }

    /**
     * Ajoute une nouvelle entité
     */
    const addEntity = async (data: CreateEntityData): Promise<MyEntityData> => { ... }

    /**
     * Met à jour une entité
     */
    const updateEntity = async (id: string, updates: UpdateEntityData): Promise<MyEntityData> => { ... }

    /**
     * Supprime une entité
     */
    const removeEntity = async (id: string): Promise<void> => { ... }

    // ===== REALTIME (si applicable) =====
    const initRealtime = (): void => { ... }
    const stopRealtime = (): void => { ... }

    // ===== COMPUTED GETTERS =====
    const filteredEntities: ComputedRef<MyEntityData[]> = computed(() => { ... })
    const totalCount: ComputedRef<number> = computed(() => entities.value.length)

    // ===== RESET =====
    const reset = (): void => {
      entities.value = []
      loading.value = false
      error.value = null
      lastFetchTime = 0
      stopRealtime()
    }

    return {
      // State
      entities,
      loading,
      error,
      // Actions
      fetchEntities,
      addEntity,
      updateEntity,
      removeEntity,
      initRealtime,
      stopRealtime,
      reset,
      // Getters
      filteredEntities,
      totalCount
    }
  },
  {
    // Persistence (optionnel)
    persist: {
      key: 'vylo-myEntity',
      paths: ['entities'], // Seulement les données, jamais loading/error
      storage: localStorage
    }
  }
)
```

### Règles Obligatoires

#### 1. Typage Strict

- ✅ **State** : Toujours typé avec `Ref<MyType[]>` ou `Ref<MyType>`
- ✅ **Getters** : Toujours typé avec `ComputedRef<ReturnType>`
- ✅ **Actions** : Types explicites pour paramètres et retours (`Promise<MyType>`)
- ❌ **JAMAIS** : `any`, `unknown` sans cast explicite

#### 2. API Layer Obligatoire

- ✅ **Toujours** : Utiliser `src/api/myEntityApi.js` ou `.ts`
- ❌ **JAMAIS** : Appel direct à `supabase.from()` dans un store
- ✅ **Pattern** : `const result = await myEntityApi.getEntities(userId)`

**Pourquoi ?**

- Gestion d'erreurs centralisée
- Retry logic et circuit breaker
- Transformation des données cohérente

#### 3. Gestion du Loading

- ✅ **Initialisation** : `loading.value = false` par défaut
- ✅ **useStoreLoader** : Toujours utiliser ce composable pour éviter les blocages
- ✅ **Timeout** : Toujours implémenter un timeout (10 secondes) dans `fetch*`
- ✅ **Cache** : Cache de 5 secondes pour éviter les requêtes multiples

```typescript
// Pattern standard pour fetchEntities
const fetchEntities = async (force = false): Promise<void> => {
  const authStore = useAuthStore()
  if (!authStore.user) {
    loading.value = false
    return
  }

  // Évite les requêtes multiples
  if (loading.value && !force) return

  // Cache de 5 secondes
  const now = Date.now()
  if (!force && now - lastFetchTime < FETCH_CACHE_MS && entities.value.length > 0) {
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  try {
    // Timeout de sécurité
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout: ...')), 10000)
    })

    const result = await Promise.race([apiPromise, timeoutPromise])
    // ...
  } catch (err) {
    // Log sécurisé + gestion erreur
  } finally {
    loading.value = false
  }
}
```

#### 4. Optimistic UI

- ✅ **Pattern** : Sauvegarder l'ancien état, appliquer les changements, revert si erreur
- ✅ **Rollback** : Toujours prévoir le rollback en cas d'erreur API

```typescript
// Pattern standard pour addEntity
const oldEntities = [...entities.value]
entities.value.unshift(optimisticEntity)

try {
  const result = await myEntityApi.createEntity(data, userId)
  if (!result.success) {
    // Revert
    entities.value = oldEntities
    throw new Error(result.message)
  }
  // Remplacer par les vraies données
  const index = entities.value.findIndex(e => e.id === optimisticEntity.id)
  if (index !== -1) {
    entities.value[index] = transformEntityData(result.data)
  }
} catch (err) {
  entities.value = oldEntities
  throw err
}
```

#### 5. Transformation des Données

- ✅ **Fonction dédiée** : Toujours créer `transformEntityData()` pour mapper API → Store
- ✅ **Validation** : Convertir les types (string → number pour les montants)
- ✅ **Valeurs par défaut** : Gérer les `null`/`undefined` avec des valeurs par défaut

```typescript
const transformEntityData = (data: EntityApiData): MyEntityData => {
  return {
    id: data.id,
    amount: Number(data.amount), // Toujours convertir en number
    status: data.status,
    // Valeurs par défaut pour champs optionnels
    description: data.description || '',
    // Relations transformées
    property: data.properties?.name || 'N/A'
  }
}
```

---

## 3. 🛡️ Security & Data Guidelines

### Logs & PII (Personally Identifiable Information)

#### Règles Strictes

1. **JAMAIS logger** :
   - ❌ Mots de passe
   - ❌ Tokens d'accès (`access_token`, `refresh_token`)
   - ❌ Emails complets (utiliser `sanitizeObject` ou `maskEmail`)
   - ❌ Numéros de téléphone complets
   - ❌ Adresses complètes (peuvent être considérées comme PII)
   - ❌ Montants financiers en détail (préférer des plages ou valeurs masquées)

2. **Toujours utiliser `sanitizeObject()`** :

   ```typescript
   import { sanitizeObject } from '@/utils/sanitizeLogs'

   // ❌ MAUVAIS
   console.error('Erreur:', err)
   console.log('User:', user)

   // ✅ BON
   console.error('Erreur:', sanitizeObject(err, ['message']))
   // Pour user, utiliser sanitizeUser() si disponible
   ```

3. **Logs en Production** :
   - ✅ Logs DEV uniquement : Envelopper dans `if (import.meta.env.DEV) { ... }`
   - ✅ Messages génériques : Préférer "Erreur lors du chargement" plutôt que les détails
   - ✅ Stack traces : Limiter à 200 caractères si nécessaire

**Exemple** :

```typescript
catch (err) {
  const errorObj = err as Error
  // Log sécurisé : ne pas exposer les détails sensibles
  console.error('Erreur lors du chargement:', sanitizeObject(errorObj, ['message']))
  error.value = errorObj.message || 'Erreur lors de la récupération'
}
```

### Données Financières

#### Règles Strictes

1. **Types** :
   - ✅ **TOUJOURS** : `number` pour les montants (`amount`, `rent`)
   - ❌ **JAMAIS** : `string` pour les montants (même si l'API retourne une string)

2. **Conversion** :

   ```typescript
   // ✅ BON
   amount: Number(data.amount)
   rent: Number(propertyData.rent || 0)

   // ❌ MAUVAIS
   amount: data.amount // Si c'est une string
   ```

3. **Validation** :
   - Toujours vérifier que le montant est un nombre valide
   - Utiliser `|| 0` comme fallback pour éviter `NaN`

4. **Logs de Montants** :
   - ❌ Ne pas logger les montants en détail dans les erreurs
   - ✅ Utiliser `formatCurrency()` pour l'affichage utilisateur uniquement

**Exemple** :

```typescript
// ❌ MAUVAIS - Expose le montant dans les logs
console.error('Paiement échoué:', { amount: payment.amount, ... })

// ✅ BON - Montant masqué
console.error('Paiement échoué (montant masqué pour sécurité)')
// Ou utiliser formatCurrency uniquement pour les toasts utilisateur
toast.info(`Nouveau paiement : ${formatCurrency(payment.amount)}`)
```

### Noms et Adresses

- ✅ **Noms de propriétés** : Peuvent être loggés (ex: "Appartement Paris")
- ⚠️ **Adresses complètes** : Éviter dans les logs (considérées comme PII)
- ⚠️ **Noms de locataires** : Éviter dans les logs d'erreur (PII)

**Exemple** :

```typescript
// ✅ OK - Nom de propriété (non sensible)
toast.info(`Nouveau bien : ${property.name}`)

// ⚠️ ATTENTION - Adresse complète
// Ne pas logger: property.address (PII potentiel)

// ❌ MAUVAIS - Nom de locataire dans erreur
console.error('Erreur locataire:', tenant.name) // ❌

// ✅ BON
console.error('Erreur locataire:', sanitizeObject({ id: tenant.id }, ['id']))
```

---

## 4. 📡 API Layer Pattern

### Structure Obligatoire

Tous les appels Supabase doivent passer par `src/api/myEntityApi.js` ou `.ts`.

#### Structure Standard

```typescript
// src/api/myEntity.ts
import { supabase } from '@/lib/supabaseClient'
import { withErrorHandling } from '@/utils/apiErrorHandler'

/**
 * Récupère toutes les entités d'un utilisateur
 */
export async function getEntities(userId: string): Promise<ApiResponse<EntityApiData[]>> {
  if (!userId) {
    return { success: false, message: 'User ID requis' }
  }

  return withErrorHandling(
    async () => {
      const { data, error } = await supabase
        .from('entities')
        .select('*, relations(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      return { data, error }
    },
    'getEntities',
    { timeout: 12000 }
  )
}
```

#### Réponse Standardisée

Toutes les fonctions API retournent :

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: Error
}
```

#### Avantages

- ✅ Gestion d'erreurs centralisée (`withErrorHandling`)
- ✅ Retry logic automatique
- ✅ Circuit breaker
- ✅ Timeout configurable
- ✅ Logs sécurisés automatiques

---

## 5. 🔄 Realtime Subscription Pattern

### Structure Standard pour Realtime

```typescript
const initRealtime = (): void => {
  const authStore = useAuthStore()
  if (!authStore.user) {
    if (import.meta.env.DEV) {
      console.warn('⚠️ Cannot init Realtime: user not authenticated')
    }
    return
  }

  // Évite d'initialiser plusieurs fois
  if (isRealtimeInitialized && realtimeChannel && isRealtimeActive) {
    return
  }

  // Nettoyage si channel inactif
  if (realtimeChannel && !isRealtimeActive) {
    try {
      supabase.removeChannel(realtimeChannel)
    } catch {
      // Ignore les erreurs de nettoyage
    }
    realtimeChannel = null
    isRealtimeInitialized = false
  }

  isRealtimeInitialized = true
  isRealtimeActive = true

  realtimeChannel = supabase
    .channel('public:my_entities')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'my_entities',
        filter: `user_id=eq.${authStore.user.id}`
      },
      async payload => {
        // Vérifie que Realtime est toujours actif
        if (!isRealtimeActive || !entities.value) return

        const { eventType, new: rowNew, old: rowOld } = payload

        if (eventType === 'INSERT') {
          // Charge les données complètes via l'API (pour avoir les relations)
          const result = await myEntityApi.getEntityById(rowNew.id, authStore.user.id)
          if (result.success && result.data) {
            const newEntity = transformEntityData(result.data)
            if (!entities.value.find(e => e.id === newEntity.id)) {
              entities.value.unshift(newEntity)
            }
          }
        }

        if (eventType === 'UPDATE') {
          // Recharge via l'API pour avoir les relations à jour
          const result = await myEntityApi.getEntityById(rowNew.id, authStore.user.id)
          if (result.success && result.data) {
            const updatedEntity = transformEntityData(result.data)
            const index = entities.value.findIndex(e => e.id === updatedEntity.id)
            if (index !== -1) {
              entities.value[index] = updatedEntity
            }
          }
        }

        if (eventType === 'DELETE') {
          entities.value = entities.value.filter(e => e.id !== rowOld.id)
        }
      }
    )
    .subscribe(status => {
      if (status === 'SUBSCRIBED') {
        if (import.meta.env.DEV) {
          console.log('✅ Realtime subscribed to my_entities')
        }
      } else if (status === 'CHANNEL_ERROR') {
        console.error('❌ Realtime error for my_entities')
        isRealtimeInitialized = false
        isRealtimeActive = false
        realtimeChannel = null
      } else if (status === 'CLOSED') {
        if (import.meta.env.DEV) {
          console.log('🔌 Realtime channel closed for my_entities')
        }
        isRealtimeInitialized = false
        isRealtimeActive = false
        realtimeChannel = null
      }
    })
}

const stopRealtime = (): void => {
  isRealtimeActive = false
  if (realtimeChannel) {
    try {
      supabase.removeChannel(realtimeChannel)
    } catch {
      if (import.meta.env.DEV) {
        console.warn('Error removing Realtime channel (non blocking)')
      }
    }
    realtimeChannel = null
    isRealtimeInitialized = false
  }
}
```

### Règles Realtime

1. **Vérification d'authentification** : Toujours vérifier `authStore.user` avant d'initialiser
2. **Flag `isRealtimeActive`** : Désactiver avant cleanup pour éviter les callbacks pendant le nettoyage
3. **Rechargement via API** : Pour INSERT/UPDATE, toujours recharger via l'API pour avoir les relations complètes
4. **Gestion d'erreurs** : Ne pas bloquer l'application si Realtime échoue (optionnel)
5. **Nettoyage** : Toujours appeler `stopRealtime()` dans `reset()` et lors de la déconnexion

---

## 6. ✅ Best Practices

### Code Quality

1. **TypeScript Strict** :
   - Toujours activer `strict: true` dans `tsconfig.json`
   - Utiliser `as` uniquement quand nécessaire, avec commentaire explicatif

2. **Noms de Variables** :
   - State : `entities`, `payments`, `properties` (pluriel)
   - Actions : `fetchEntities`, `addEntity`, `updateEntity`, `removeEntity`
   - Getters : `filteredEntities`, `totalEntities` (descriptifs)

3. **Documentation** :
   - JSDoc pour toutes les fonctions publiques
   - Commentaires pour la logique complexe
   - Types explicites plutôt que commentaires

### Performance

1. **Cache** : Cache de 5 secondes pour éviter les requêtes multiples
2. **Lazy Loading** : Relations chargées uniquement quand nécessaire
3. **Pagination** : À implémenter pour les grandes listes (futur)

### Tests

1. **Tests Unitaires** : Tous les stores doivent avoir des tests
2. **Mocking** : Toujours mocker l'API layer, jamais Supabase directement
3. **Coverage** : Objectif 70%+ pour les stores critiques (payments, properties)

---

## 📚 Références

- **Stores de référence** :
  - `src/stores/paymentsStore.ts` (logique financière)
  - `src/stores/propertiesStore.ts` (logique immobilière + Realtime)

- **API Layer de référence** :
  - `src/api/payments.js`
  - `src/api/properties.js`

- **Utilitaires de sécurité** :
  - `src/utils/sanitizeLogs.js`

- **Types de base** :
  - `src/types/api.d.ts`

---

**Dernière mise à jour** : 2025-01-28  
**Version du document** : 1.0.0  
**Maintenu par** : Lead Architecture Team
