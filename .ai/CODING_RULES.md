# 📐 RÈGLES DE CODAGE - DOOGOO

> **Généré automatiquement** via introspection codebase  
> **Dernière mise à jour** : 2025-01-31  
> **Objectif** : Figer les conventions et éviter les erreurs récurrentes

---

## 🏷️ CONVENTIONS DE NOMMAGE

### Base de données (PostgreSQL) : `snake_case`

**Règle** : Toutes les colonnes de la base de données utilisent `snake_case`

**Exemples** :
- ✅ `surface_m2`
- ✅ `heating_type`
- ✅ `charges_amount`
- ✅ `entry_date`
- ✅ `user_id`
- ❌ `surfaceM2`
- ❌ `heatingType`
- ❌ `entryDate`

### Frontend (JavaScript/TypeScript) : `camelCase`

**Règle** : Tous les noms de variables, propriétés et fonctions utilisent `camelCase`

**Exemples** :
- ✅ `surface`
- ✅ `heatingType`
- ✅ `chargesAmount`
- ✅ `entryDate`
- ✅ `fetchProperties`
- ❌ `surface_m2`
- ❌ `heating_type`
- ❌ `fetch_properties`

### Composants Vue : `PascalCase`

**Règle** : Tous les noms de composants utilisent `PascalCase`

**Exemples** :
- ✅ `PropertyCard.vue`
- ✅ `StatsGrid.vue`
- ✅ `NetworkErrorModal.vue`
- ❌ `propertyCard.vue`
- ❌ `stats-grid.vue`

### Fichiers : `camelCase` pour JS/TS, `PascalCase` pour Vue

**Règle** :
- Fichiers `.js` / `.ts` : `camelCase` (ex: `propertiesStore.ts`, `apiErrorHandler.js`)
- Fichiers `.vue` : `PascalCase` (ex: `PropertyCard.vue`, `StatsGrid.vue`)

---

## 🏗️ STRUCTURE DES COMPOSANTS VUE

### Template standardisé

```vue
<template>
  <!-- Contenu HTML avec Tailwind CSS -->
</template>

<script setup>
// 1. Imports
import { ref, computed, onMounted } from 'vue'
import { usePropertiesStore } from '@/stores/propertiesStore'

// 2. Props
const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

// 3. Emits
defineEmits(['edit', 'delete'])

// 4. Composables / Stores
const propertiesStore = usePropertiesStore()

// 5. State (refs)
const loading = ref(false)

// 6. Computed
const statusText = computed(() => {
  return props.property.status === 'occupied' ? 'Occupé' : 'Libre'
})

// 7. Methods
const handleEdit = () => {
  // Logique
}

// 8. Lifecycle hooks
onMounted(() => {
  // Initialisation
})
</script>

<style scoped>
/* Styles spécifiques si nécessaire (éviter si possible avec Tailwind) */
</style>
```

### Règles de structure

1. **Toujours utiliser `<script setup>`** (Composition API)
2. **Ordre des imports** :
   - Vue core (ref, computed, etc.)
   - Composables
   - Stores
   - Composants
   - Utils
3. **Pas de logique métier dans les composants** : Tout doit aller dans les Stores
4. **Tailwind CSS uniquement** : Éviter les styles `<style scoped>` sauf cas exceptionnels

---

## 🎨 STYLING : Tailwind CSS uniquement

### Règle d'or

**Ne jamais utiliser de styles CSS custom si Tailwind peut le faire.**

**Exemples** :
```vue
<!-- ✅ BON -->
<div class="flex items-center gap-4 p-6 bg-indigo-500 rounded-lg">
  <span class="text-white font-bold">Titre</span>
</div>

<!-- ❌ MAUVAIS -->
<div class="custom-container">
  <span class="custom-title">Titre</span>
</div>
<style scoped>
.custom-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #6366f1;
  border-radius: 0.5rem;
}
.custom-title {
  color: white;
  font-weight: bold;
}
</style>
```

### Palette de couleurs projet

| Usage | Couleur | Classe Tailwind |
|-------|---------|----------------|
| Primary | Indigo | `indigo-500`, `indigo-600`, `bg-indigo-500/10` |
| Success | Emerald | `emerald-500`, `emerald-600` |
| Warning | Amber | `amber-500`, `amber-600` |
| Danger | Red | `red-500`, `red-600` |

---

## 🧩 COMPOSANTS UI : StatsGrid obligatoire pour les KPI

### ⚠️ RÈGLE CRITIQUE

**Ne jamais créer de carte KPI sans utiliser `StatsGrid`.**

**Motif** :
- Cohérence visuelle garantie
- Responsive design automatique
- Accessibilité intégrée
- Animations standardisées

**Exemple correct** :
```vue
<template>
  <StatsGrid :stats="stats" />
</template>

<script setup>
import StatsGrid from '@/components/shared/StatsGrid.vue'
import { Building2, Users } from 'lucide-vue-next'

const stats = [
  {
    label: 'Total Biens',
    value: '12',
    icon: Building2,
    glowColor: 'bg-violet-500/10',
    iconBgColor: 'bg-violet-500/10',
    iconColor: 'text-violet-200'
  }
]
</script>
```

**Exemple incorrect** :
```vue
<!-- ❌ NE PAS FAIRE -->
<template>
  <div class="grid grid-cols-4 gap-4">
    <div class="p-4 bg-gray-800 rounded">
      <p>Total Biens</p>
      <p class="text-2xl font-bold">12</p>
    </div>
  </div>
</template>
```

---

## 🔄 ARCHITECTURE EN COUCHES

### Règle d'or : Pas de saut de couche

**Flux autorisé** :
```
Component → Store → API → Supabase
```

**Flux interdit** :
```
Component → Supabase  ❌
Component → API (sans Store)  ❌ (sauf cas exceptionnels)
Store → Supabase (direct)  ❌
```

### Imports Supabase

**❌ JAMAIS** :
```vue
<script setup>
// ❌ NE PAS IMPORTER supabaseClient DANS UN .vue
import { supabase } from '@/lib/supabaseClient'
</script>
```

**✅ TOUJOURS** :
```javascript
// ✅ Utiliser l'API layer
import { getProperties } from '@/api/properties'

// Ou via le store
import { usePropertiesStore } from '@/stores/propertiesStore'
const store = usePropertiesStore()
await store.fetchProperties()
```

---

## 🔀 MAPPING FRONTEND ↔ BACKEND

### Règle : Conversion automatique dans l'API layer

**Ne jamais faire le mapping manuellement dans un composant ou store.**

**Mappings critiques** (gérés dans `src/api/properties.js`) :

| Frontend (camelCase) | Backend (snake_case) | Fichier |
|---------------------|---------------------|---------|
| `surface` | `surface_m2` | `api/properties.js` |
| `pieces` | `rooms` | `api/properties.js` |
| `heatingType` | `heating_type` | `api/properties.js` |
| `chargesAmount` | `charges_amount` | `api/properties.js` |
| `entryDate` | `entry_date` | `api/tenants.js` |
| `exitDate` | `exit_date` | `api/tenants.js` |

**Exemple correct** :
```typescript
// ✅ Dans le store (propertiesStore.ts)
const addProperty = async (data: CreatePropertyData) => {
  // data.surface est en camelCase (Frontend)
  await propertiesApi.createProperty(data, userId)
  // L'API layer convertit automatiquement surface → surface_m2
}
```

**Exemple incorrect** :
```javascript
// ❌ NE PAS FAIRE dans un composant
const submit = async () => {
  const dbData = {
    surface_m2: form.surface,  // ❌ Mapping manuel
    rooms: form.pieces,         // ❌ Mapping manuel
    heating_type: form.heatingType  // ❌ Mapping manuel
  }
  await supabase.from('properties').insert(dbData)  // ❌ Accès direct
}
```

---

## 🛡️ GESTION D'ERREURS

### Règle : Toujours utiliser `withErrorHandling`

**Dans l'API layer** (`src/api/*.js`) :
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

**Dans les composants** :
```vue
<script setup>
// ❌ NE PAS gérer les erreurs manuellement
const handleSubmit = async () => {
  try {
    await store.addProperty(data)
  } catch (error) {
    // ❌ Éviter ce pattern, l'API layer le fait déjà
    console.error(error)
  }
}

// ✅ Laisser l'API layer et le store gérer
const handleSubmit = async () => {
  await store.addProperty(data)
  // Le store affiche automatiquement un toast en cas d'erreur
}
</script>
```

---

## 📝 LOGS SÉCURISÉS

### Règle : Ne jamais logger de données utilisateur brutes

**❌ MAUVAIS** :
```javascript
console.log('Property data:', property)  // ❌ Peut contenir des adresses, noms
console.error('Error:', error)  // ❌ Peut contenir des données sensibles
```

**✅ BON** :
```javascript
import { sanitizeObject } from '@/utils/sanitizeLogs'

console.error('Error:', sanitizeObject(error, ['message']))
console.debug('Property updated:', sanitizeObject(property, ['id', 'name']))
```

**Données sensibles à ne jamais logger** :
- Adresses complètes
- Noms de locataires
- Emails
- Numéros de téléphone
- IBAN / BIC
- Tout ce qui est PII (Personally Identifiable Information)

---

## ✅ VALIDATION : Zod pour les formulaires

### Règle : Toujours valider les inputs avant envoi au backend

**Exemple** :
```typescript
import { z } from 'zod'

const propertySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  city: z.string().min(1, 'La ville est requise'),
  rent: z.number().positive('Le loyer doit être positif'),
  surface: z.number().nonnegative().optional()
})

const validateProperty = (data: unknown) => {
  return propertySchema.safeParse(data)
}
```

---

## 🧪 TESTING

### Règles de tests

1. **Tests unitaires** : Vitest + Vue Test Utils
2. **Tests de composants** : Tester le comportement, pas l'implémentation
3. **Tests de stores** : Tester les actions et les computed
4. **Mock Supabase** : Toujours mocker les appels API dans les tests

---

## 📦 IMPORTS

### Ordre recommandé

```javascript
// 1. Vue core
import { ref, computed, onMounted } from 'vue'

// 2. Router / Pinia
import { useRoute, useRouter } from 'vue-router'
import { usePropertiesStore } from '@/stores/propertiesStore'

// 3. Composables
import { useI18n } from '@/composables/useLingui'

// 4. Composants
import PropertyCard from '@/components/properties/PropertyCard.vue'
import StatsGrid from '@/components/shared/StatsGrid.vue'

// 5. Utils
import { formatCurrency } from '@/utils/formatters'

// 6. Types
import type { PropertyData } from '@/types/api'

// 7. Icônes / Assets
import { Building2, Users } from 'lucide-vue-next'
```

### Barrel exports

**Utiliser les barrel exports** (`src/api/index.js`) :
```javascript
// ✅ BON
import { propertiesApi, tenantsApi } from '@/api'

// ❌ MAUVAIS (mais acceptable si nécessaire)
import { getProperties } from '@/api/properties'
```

---

## 🚨 RÈGLES CRITIQUES (À RESPECTER ABSOLUMENT)

1. **Ne jamais modifier le style d'une carte KPI sans utiliser `StatsGrid`**
2. **Ne jamais importer `supabaseClient` dans un fichier `.vue`**
3. **Ne jamais faire le mapping DB ↔ Frontend manuellement**
4. **Toujours utiliser `withErrorHandling` dans l'API layer**
5. **Toujours utiliser `sanitizeObject` pour les logs contenant des données utilisateur**
6. **Ne jamais sauter de couche dans l'architecture (Component → Store → API → Supabase)**

---

## 📚 RESSOURCES

- **Schema DB** : Voir `.ai/SCHEMA.md`
- **Architecture** : Voir `.ai/ARCHITECTURE.md`
- **Project Rules** : Voir `.cursor/rules/multiapp.mdc`
