# 🚀 Optimisations de Performance API

**Date** : 2025-01-22  
**Statut** : ✅ Implémenté

---

## 🔍 Problèmes Identifiés

### Symptômes
- Timeouts fréquents sur `getProperties` et `getPayments` (>12s)
- Requêtes lentes avec jointures complexes
- Double timeout (store + API)
- Pas de limite sur les résultats

### Causes Racines
1. **Jointures trop lourdes** : `tenants (*)` récupère TOUS les champs
2. **Pas de limite** : Toutes les données chargées d'un coup
3. **Double timeout** : 10s dans le store + 12s dans l'API = confusion
4. **Sélection excessive** : `*` au lieu de champs spécifiques

---

## ✅ Optimisations Implémentées

### 1. Optimisation `getProperties`

**Fichier** : `src/api/properties.js`

**AVANT** :
```javascript
.select(`
  *,
  tenants (*)  // ❌ Récupère TOUS les champs
`)
.timeout: 12000
```

**APRÈS** :
```javascript
.select(`
  *,
  tenants (
    id,
    name,
    entry_date,
    exit_date,
    rent,
    status
  )  // ✅ Seulement les champs nécessaires
`)
.limit(1000)  // ✅ Limite pour éviter les requêtes trop lourdes
.timeout: 10000  // ✅ Réduit de 12s à 10s
```

**Gain estimé** : **30-40% plus rapide** (moins de données transférées)

---

### 2. Optimisation `getPayments`

**Fichier** : `src/api/payments.js`

**AVANT** :
```javascript
.select(`
  *,  // ❌ Tous les champs de payments_view
  properties (...),
  tenants (...)
`)
.timeout: 12000
```

**APRÈS** :
```javascript
.select(`
  id,
  property_id,
  tenant_id,
  amount,
  due_date,
  status,
  created_at,
  updated_at,  // ✅ Seulement les champs nécessaires
  properties (...),
  tenants (...)
`)
.limit(1000)  // ✅ Limite pour éviter les requêtes trop lourdes
.timeout: 10000  // ✅ Réduit de 12s à 10s
```

**Gain estimé** : **25-35% plus rapide** (moins de colonnes inutiles)

---

### 3. Suppression du Double Timeout

**Fichiers** : `src/stores/propertiesStore.ts`, `src/stores/paymentsStore.ts`

**AVANT** :
```typescript
// ❌ Double timeout : 10s dans le store + 12s dans l'API
const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject(...), 10000)
})
const result = await Promise.race([apiPromise, timeoutPromise])
```

**APRÈS** :
```typescript
// ✅ Un seul timeout géré par withErrorHandling (10s)
const result = await propertiesApi.getProperties(authStore.user.id)
```

**Gain** : Code plus simple, timeout unique et cohérent

---

### 4. Optimisation `getPropertyById`

**Fichier** : `src/api/properties.js`

Même optimisation que `getProperties` : sélection limitée des champs `tenants`.

---

## 📊 Résultats Attendus

| Requête | Avant | Après | Gain |
|---------|-------|-------|------|
| `getProperties` | 12s timeout | 10s timeout | 30-40% plus rapide |
| `getPayments` | 12s timeout | 10s timeout | 25-35% plus rapide |
| Double timeout | Confusion | Unifié | Code plus clair |

---

## 🔧 Recommandations Supplémentaires

### Index de Base de Données

Pour améliorer encore les performances, ajouter ces index dans Supabase :

```sql
-- Index pour properties
CREATE INDEX IF NOT EXISTS idx_properties_user_id_created_at 
ON properties(user_id, created_at DESC);

-- Index pour payments_view (si la vue le permet)
CREATE INDEX IF NOT EXISTS idx_payments_user_id_due_date 
ON payments(user_id, due_date DESC);

-- Index pour tenants
CREATE INDEX IF NOT EXISTS idx_tenants_property_id 
ON tenants(property_id);
```

### Pagination (Futur)

Pour les utilisateurs avec beaucoup de données (>1000), implémenter la pagination :

```javascript
// Exemple futur
export async function getProperties(userId, options = {}) {
  const { page = 1, limit = 50 } = options
  
  return withErrorHandling(
    async () => {
      const from = (page - 1) * limit
      const to = from + limit - 1
      
      const { data, error } = await supabase
        .from('properties')
        .select(...)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to)  // ✅ Pagination
        
      return { data, error, hasMore: data.length === limit }
    },
    'getProperties',
    { timeout: 8000 }  // ✅ Encore plus rapide avec pagination
  )
}
```

### Cache Agressif

Le cache existe déjà dans les stores, mais on peut l'améliorer :

- **Cache localStorage** : Persister les données localement
- **Cache TTL** : Invalider après X minutes
- **Cache par utilisateur** : Séparer les caches par userId

---

## 🎯 Prochaines Étapes

1. ✅ **Optimisations implémentées** (fait)
2. ⏳ **Monitorer les performances** en production
3. ⏳ **Ajouter les index DB** si nécessaire
4. ⏳ **Implémenter la pagination** si >1000 résultats
5. ⏳ **Améliorer le cache** si timeouts persistent

---

## 📝 Notes

- Les timeouts peuvent aussi être causés par :
  - Projet Supabase en pause (plan gratuit)
  - Latence réseau élevée
  - Problèmes de connexion
- Les optimisations réduisent la charge mais ne résolvent pas les problèmes réseau
- Si les timeouts persistent, vérifier le statut du projet Supabase
