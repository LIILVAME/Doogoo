# 🏗️ ARCHITECTURE DOOGOO - FLUX DE DONNÉES & PATTERNS

> **Généré automatiquement** via introspection codebase  
> **Dernière mise à jour** : 2025-01-31  
> **Stack** : Vue 3.4+ (Composition API), Pinia 3+, Supabase, Tailwind CSS 3.4+

---

## 🔄 FLUX DE DONNÉES PRINCIPAL

### Exemple concret : `PropertyCard.vue` affiche une propriété

```
┌─────────────────────────────────────────────────────────────────┐
│  1. SUPABASE (Base de données PostgreSQL)                       │
│     Table: properties                                           │
│     Colonnes: id, name, surface_m2, rooms, heating_type, ...    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ (SELECT avec Supabase client)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. API LAYER (src/api/properties.js)                          │
│     Fonctions: getProperties(), createProperty(), ...           │
│     Rôle:                                                       │
│     - Conversion snake_case → camelCase                         │
│     - Gestion d'erreurs (withErrorHandling)                     │
│     - Timeout et retry logic                                    │
│                                                                 │
│     Exemple mapping:                                            │
│     DB: surface_m2 → Frontend: surface                          │
│     DB: rooms → Frontend: pieces                                │
│     DB: heating_type → Frontend: heatingType                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ (Return { success, data, error })
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. STORE (src/stores/propertiesStore.ts)                      │
│     Pinia Store avec Composition API                            │
│     Actions: fetchProperties(), addProperty(), updateProperty() │
│     State: properties (Ref<PropertyData[]>)                     │
│                                                                 │
│     Rôle:                                                       │
│     - Cache des données en mémoire                              │
│     - Optimistic UI updates                                     │
│     - Realtime subscriptions (Supabase Realtime)                │
│     - Transformation des données API → Format Frontend          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ (Reactive state: properties.value)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. COMPONENT (src/components/properties/PropertyCard.vue)     │
│     Vue 3 Component avec <script setup>                         │
│     Props: property (PropertyData)                              │
│                                                                 │
│     Rôle:                                                       │
│     - Affichage uniquement (présentation)                       │
│     - Émission d'événements (edit, delete)                      │
│     - Pas de logique métier                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Flux inverse (Création/Modification)

```
Component (PropertyModal.vue)
  ↓ (emit ou call direct)
Store Action (addProperty() / updateProperty())
  ↓ (prepare data avec mapping Frontend → Backend)
API Layer (createProperty() / updateProperty())
  ↓ (withErrorHandling, retry, circuit breaker)
Supabase (INSERT / UPDATE)
  ↓ (Realtime event)
Store (Realtime subscription update)
  ↓ (Reactive update)
Component (Re-render automatique)
```

---

## 📂 STRUCTURE DES RÉPERTOIRES

```
src/
├── api/                    # ⚠️ POINT D'ENTRÉE UNIQUE pour Supabase
│   ├── properties.js       # API properties (getProperties, createProperty, ...)
│   ├── tenants.js          # API tenants
│   ├── payments.js         # API payments
│   ├── alerts.js           # API alerts
│   └── index.js            # Barrel export
│
├── stores/                 # Pinia stores (état global)
│   ├── propertiesStore.ts  # Store properties (avec Realtime)
│   ├── tenantsStore.ts     # Store tenants
│   ├── paymentsStore.ts    # Store payments
│   ├── alertsStore.js      # Store alerts
│   └── ...
│
├── components/
│   ├── common/             # Composants UI réutilisables
│   │   ├── Toast.vue
│   │   ├── EmptyState.vue
│   │   └── ...
│   ├── shared/             # Composants partagés métier
│   │   └── StatsGrid.vue   # ⚠️ COMPOSANT OBLIGATOIRE pour les KPI
│   ├── properties/
│   │   ├── PropertyCard.vue
│   │   ├── PropertyModal.vue
│   │   └── ...
│   └── ui/
│       └── NetworkErrorModal.vue  # ⚠️ Circuit breaker UX
│
├── pages/                  # Pages/routes
│   ├── BiensPage.vue       # Liste des biens
│   ├── DashboardPage.vue   # Dashboard principal
│   └── ...
│
├── utils/                  # Helpers techniques
│   ├── apiErrorHandler.js  # ⚠️ Gestion d'erreur centralisée
│   ├── sanitizeLogs.js     # ⚠️ Sécurité des logs
│   ├── circuitBreaker.js   # Circuit breaker pattern
│   └── formatters.js       # Formatters (currency, date, ...)
│
└── lib/
    └── supabaseClient.js   # Client Supabase (ne JAMAIS importer directement dans .vue)
```

---

## 🎯 PATTERNS CLÉS

### 1. API Error Handler (`src/utils/apiErrorHandler.js`)

**Rôle** : Gestion centralisée des erreurs API

**Utilisation** :
```javascript
import { withErrorHandling } from '@/utils/apiErrorHandler'

export async function getProperties(userId) {
  return withErrorHandling(
    async () => {
      const { data, error } = await supabase.from('properties').select('*')
      return { data, error }
    },
    'getProperties',
    { timeout: 10000 }
  )
}
```

**Fonctionnalités** :
- ✅ Timeout automatique (8s par défaut)
- ✅ Retry logic pour erreurs réseau
- ✅ Circuit breaker intégré
- ✅ Messages d'erreur conviviaux
- ✅ Intégration Sentry (si configuré)
- ✅ Déclenchement du modal d'erreur réseau

**Fichiers impactés** : Tous les fichiers `src/api/*.js`

---

### 2. Network Error Modal (`src/components/ui/NetworkErrorModal.vue`)

**Rôle** : Circuit breaker UX - Modal affiché lors d'erreurs réseau/timeout

**Déclenchement** :
- Automatique via `apiErrorHandler.js` (ligne 86-96)
- Via `errorStore.triggerNetworkError(message, context)`

**Comportement** :
- ✅ Affichage automatique en cas d'erreur réseau
- ✅ Bouton "Réessayer" qui recharge la page
- ✅ Vérification de connexion avant retry
- ✅ Auto-dismiss si connexion rétablie

**Intégration** :
```vue
<!-- Dans App.vue ou layout principal -->
<NetworkErrorModal />
```

---

### 3. StatsGrid Component (`src/components/shared/StatsGrid.vue`)

**Rôle** : ⚠️ **COMPOSANT OBLIGATOIRE** pour afficher des KPI/cartes statistiques

**Utilisation** :
```vue
<template>
  <StatsGrid :stats="stats" />
</template>

<script setup>
import StatsGrid from '@/components/shared/StatsGrid.vue'

const stats = [
  {
    label: 'Total Biens',
    value: '12',
    icon: Building2,
    glowColor: 'bg-violet-500/10',
    iconBgColor: 'bg-violet-500/10',
    iconColor: 'text-violet-200'
  },
  // ...
]
</script>
```

**⚠️ RÈGLE D'OR** : Ne jamais créer de carte KPI sans utiliser `StatsGrid`. Cela garantit :
- ✅ Cohérence visuelle
- ✅ Responsive design
- ✅ Accessibilité
- ✅ Animations standardisées

**Fichiers utilisant StatsGrid** :
- `src/pages/DashboardPage.vue`
- `src/pages/BiensPage.vue`

---

### 4. Mapping Frontend ↔ Backend

**Problème** : La DB utilise `snake_case`, le Frontend utilise `camelCase`

**Solution** : Conversion automatique dans `src/api/properties.js`

**Exemples de mappings** :
```javascript
// Backend → Frontend (dans propertiesStore.ts, transformPropertyData)
DB: surface_m2      → Frontend: surface
DB: rooms           → Frontend: pieces
DB: heating_type    → Frontend: heatingType
DB: charges_amount  → Frontend: chargesAmount
DB: image           → Frontend: image (ou image_url en legacy)

// Frontend → Backend (dans api/properties.js, createProperty/updateProperty)
Frontend: surface      → DB: surface_m2
Frontend: pieces       → DB: rooms
Frontend: heatingType  → DB: heating_type
Frontend: chargesAmount → DB: charges_amount
```

**⚠️ NE JAMAIS** :
- ❌ Importer `supabaseClient` directement dans un `.vue`
- ❌ Faire le mapping manuellement dans un composant
- ❌ Utiliser les noms de colonnes DB dans les composants

**✅ TOUJOURS** :
- ✅ Utiliser les fonctions de l'API layer (`src/api/`)
- ✅ Laisser le store gérer les transformations
- ✅ Utiliser les types TypeScript (`PropertyData`, `CreatePropertyData`)

---

### 5. Realtime Subscriptions (Supabase Realtime)

**Implémentation** : `src/stores/propertiesStore.ts` (lignes 788-940)

**Pattern** :
```typescript
const initRealtime = () => {
  const channel = supabase
    .channel('public:properties')
    .on('postgres_changes', {
      event: '*',  // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'properties',
      filter: `user_id=eq.${userId}`
    }, async (payload) => {
      // Handle INSERT/UPDATE/DELETE
      // Recharger via API pour avoir les relations (tenants)
    })
    .subscribe()
}
```

**Avantages** :
- ✅ Synchronisation automatique entre onglets
- ✅ Pas de polling nécessaire
- ✅ Updates en temps réel

**Gestion d'erreurs** :
- Reconnexion automatique après 5s si erreur
- Cleanup automatique si utilisateur déconnecté

---

### 6. Optimistic UI Updates

**Implémentation** : `src/stores/propertiesStore.ts` (addProperty, updateProperty, removeProperty)

**Pattern** :
```typescript
const addProperty = async (data) => {
  // 1. Optimistic update (ajoute immédiatement à la liste)
  const optimistic = { id: 'temp-xxx', ...data }
  properties.value.unshift(optimistic)
  
  // 2. Appel API
  const result = await propertiesApi.createProperty(data, userId)
  
  // 3. Si succès : remplace le temp par le vrai
  // Si échec : revert l'optimistic update
}
```

**Avantages** :
- ✅ UX fluide (pas d'attente)
- ✅ Revert automatique en cas d'erreur

---

## 📚 STACK TECHNIQUE

### Dependencies principales (package.json)

| Package | Version | Usage |
|---------|---------|-------|
| `vue` | `^3.4.21` | Framework principal |
| `pinia` | `^3.0.3` | State management |
| `@supabase/supabase-js` | `^2.78.0` | Backend (DB, Auth, Realtime) |
| `vue-router` | `^4.3.0` | Routing |
| `tailwindcss` | `^3.4.3` | Styling (utility-first) |
| `@vueuse/core` | `^14.0.0` | Composables utilitaires |
| `zod` | `^4.1.12` | Validation de schémas |
| `pinia-plugin-persistedstate` | `^4.5.0` | Persistance localStorage |
| `lucide-vue-next` | `^0.554.0` | Icônes |
| `apexcharts` | `^5.3.5` | Graphiques |

### DevDependencies principales

| Package | Version | Usage |
|---------|---------|-------|
| `vite` | `^7.2.4` | Build tool |
| `typescript` | `^5.9.3` | Type checking (cible refactor) |
| `vitest` | `^4.0.6` | Testing |
| `@vue/test-utils` | `^2.4.6` | Testing Vue components |
| `eslint` | `^9.39.0` | Linting |

---

## 🔒 SÉCURITÉ

### Logs sécurisés (`src/utils/sanitizeLogs.js`)

**Règle** : Ne jamais logger de données utilisateur brutes (adresses, noms, emails, etc.)

**Utilisation** :
```javascript
import { sanitizeObject } from '@/utils/sanitizeLogs'

console.error('Erreur:', sanitizeObject(errorObj, ['message']))
```

### Row Level Security (RLS)

Toutes les tables (sauf `currency`) ont RLS activé. Les politiques garantissent :
- ✅ Accès uniquement aux données de l'utilisateur connecté
- ✅ Filtrage automatique par `user_id`
- ✅ Protection contre les accès non autorisés

---

## 🎨 DESIGN SYSTEM

### Palette de couleurs (Tailwind)

| Couleur | Usage | Classes |
|---------|-------|---------|
| Primary | Actions principales | `indigo-500` (#6366f1) |
| Success | Succès, confirmations | `emerald-500` (#10b981) |
| Warning | Avertissements | `amber-500` (#f59e0b) |
| Danger | Erreurs, suppressions | `red-500` (#ef4444) |

### Composants UI réutilisables

- `Button.vue` - Boutons standardisés
- `Toast.vue` - Notifications toast
- `EmptyState.vue` - États vides
- `SkeletonLoader.vue` - Loading states
- `StatsGrid.vue` - Cartes KPI (⚠️ obligatoire)

---

## 📝 NOTES IMPORTANTES

1. **Architecture en couches** :
   - Component → Store → API → Supabase
   - Jamais de saut de couche (ex: Component → Supabase)

2. **Gestion d'erreurs** :
   - Toujours utiliser `withErrorHandling` dans l'API layer
   - Les composants ne gèrent pas les erreurs directement

3. **Performance** :
   - Cache de 5s pour éviter les requêtes multiples (`FETCH_CACHE_MS`)
   - Optimistic UI pour les opérations d'écriture
   - Realtime pour éviter le polling

4. **TypeScript** :
   - Migration progressive en cours (stores en `.ts`, API en `.js`)
   - Types définis dans `src/types/api.d.ts`
