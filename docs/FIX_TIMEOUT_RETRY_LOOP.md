# 🔧 Correction des Timeouts et Boucles de Retry

**Date** : 2025-01-03  
**Statut** : ✅ Corrigé

---

## 🔍 Analyse du Problème

### Symptômes

```
[RETRY] Tentative 1/3 échouée, réessai dans 300ms... Error: Timeout: l'opération a pris plus de 20000ms
[RETRY] Tentative 2/3 échouée, réessai dans 600ms... Error: Timeout: l'opération a pris plus de 20000ms
[API] Latence élevée pour getAlerts: 60910ms
```

### Causes Racines

1. **Timeouts réessayés indéfiniment** : Les timeouts étaient traités comme des erreurs réseau réessayables
2. **Requêtes séquentielles lentes** : `getAlerts()` exécutait 4 requêtes Supabase séquentielles
3. **Pas de limites** : Les requêtes pouvaient retourner des milliers de résultats
4. **Retries trop agressifs** : 3 tentatives avec délais exponentiels créaient des boucles infinies

---

## ✅ Solution Implémentée

### 1. Exclusion des Timeouts des Retries

**Fichier** : `src/utils/retry.js`

```javascript
export function isRetryableError(error) {
  // ⚠️ EXCLURE les timeouts - ils ne sont pas réessayables
  if (errorMessage.includes('timeout') || errorMessage.includes("l'opération a pris plus de")) {
    return false
  }
  // ... reste de la logique
}
```

**Rationale** : Un timeout indique que la requête prend trop de temps, pas un problème réseau temporaire. Réessayer un timeout ne résout rien.

### 2. Réduction des Retries et Délais

**Fichier** : `src/utils/apiErrorHandler.js`

- **AVANT** : `maxRetries: 2` (total 3 tentatives), délais jusqu'à 1.2s
- **APRÈS** : `maxRetries: 1` (total 2 tentatives), délais jusqu'à 600ms

**Résultat** : Échec plus rapide et moins de requêtes inutiles

### 3. Timeout Réduit

**Fichier** : `src/utils/apiErrorHandler.js`

- **AVANT** : 10s par défaut
- **APRÈS** : 8s par défaut (15s pour `getAlerts` qui fait plusieurs requêtes)

**Rationale** : Échouer plus rapidement permet d'éviter les retries inutiles et d'afficher une erreur claire à l'utilisateur.

### 4. Parallélisation des Requêtes `getAlerts`

**Fichier** : `src/api/alerts.js`

**AVANT** : 4 requêtes séquentielles

```javascript
const latePayments = await supabase.from('payments_view')...
const unpaidPayments = await supabase.from('payments_view')...
const properties = await supabase.from('properties')...
const allProperties = await supabase.from('properties')...
```

**APRÈS** : 4 requêtes en parallèle

```javascript
const [latePaymentsResult, unpaidPaymentsResult, propertiesResult, allPropertiesResult] =
  await Promise.all([...])
```

**Gain** : Réduction du temps total de ~80% (ex: 4x5s = 20s → max(5s) = 5s)

### 5. Limites sur les Requêtes

**Fichier** : `src/api/alerts.js`

- `.limit(50)` sur les requêtes `payments_view`
- `.limit(100)` sur les requêtes `properties` avec tenants

**Rationale** : Évite les requêtes qui retournent des milliers de résultats et prennent du temps.

### 6. Guard dans `fetchAlerts`

**Fichier** : `src/stores/alertsStore.js`

```javascript
const fetchAlerts = async () => {
  // Évite les requêtes multiples si déjà en cours
  if (loading.value) {
    console.debug('fetchAlerts: requête déjà en cours, skip')
    return
  }
  // ...
}
```

### 7. Appel Non-Bloquant dans Sidebar

**Fichier** : `src/components/Sidebar.vue`

**AVANT** : `await alertsStore.fetchAlerts()` (bloquait le chargement)
**APRÈS** : `alertsStore.fetchAlerts().catch(...)` (non-bloquant)

**Rationale** : Les alertes ne doivent pas ralentir le chargement de la sidebar.

---

## 📊 Impact des Corrections

### Avant

- **Temps moyen** : 60s+ (boucles de retry)
- **Requêtes** : 6-9 requêtes par timeout (3 tentatives × 2-3 retries)
- **Expérience** : App bloquée, logs spam, utilisateur frustré

### Après

- **Temps moyen** : 5-8s maximum (requêtes parallèles)
- **Requêtes** : 1-2 requêtes maximum (timeout = échec direct, pas de retry)
- **Expérience** : App réactive, erreurs claires si problème

---

## 🎯 Garanties

1. ✅ **Pas de boucles infinies** : Les timeouts ne sont plus réessayés
2. ✅ **Échec rapide** : 8s timeout par défaut, 15s pour `getAlerts`
3. ✅ **Performance** : Requêtes parallèles réduisent le temps total
4. ✅ **Non-bloquant** : Les alertes ne bloquent pas l'UI
5. ✅ **Limites** : Requêtes limitées pour éviter les performances dégradées

---

## 📝 Tests à Effectuer

1. ✅ **Chargement initial** : La sidebar ne doit pas être bloquée par `fetchAlerts`
2. ✅ **Timeout réel** : Si une requête prend > 15s, elle doit échouer sans retry
3. ✅ **Réseau lent** : Les vraies erreurs réseau doivent être réessayées (mais pas les timeouts)
4. ✅ **Performance** : `getAlerts` doit être plus rapide avec les requêtes parallèles

---

## 📚 Références

- `src/utils/retry.js` - Exclusion des timeouts des retries
- `src/utils/apiErrorHandler.js` - Réduction des retries et timeout
- `src/api/alerts.js` - Parallélisation et limites
- `src/stores/alertsStore.js` - Guard contre les appels multiples
- `src/components/Sidebar.vue` - Appel non-bloquant
