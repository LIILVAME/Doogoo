# 🔒 Sécurisation de la table Payments pour l'automatisation

## 📋 Résumé

Cette migration sécurise la table `payments` pour éviter les doublons lors de la génération automatique des loyers mensuels.

## ✅ Actions réalisées

### 1. Contrainte d'unicité

**Migration** : `20250201000000_add_payments_unique_constraint_for_automation.sql`

- ✅ Ajout de la colonne `period` (TEXT, format 'YYYY-MM')
- ✅ Index unique partiel `idx_payments_unique_monthly_rent` sur `(tenant_id, property_id, period)`
- ✅ Trigger automatique `trigger_set_payment_period` pour remplir `period` à partir de `due_date` ou `date`
- ✅ Remplissage automatique de `period` pour les données existantes

**Contrainte** :
```sql
CREATE UNIQUE INDEX idx_payments_unique_monthly_rent 
ON public.payments (tenant_id, property_id, period)
WHERE tenant_id IS NOT NULL 
  AND property_id IS NOT NULL
  AND period IS NOT NULL;
```

**Comportement** :
- ✅ Empêche la création de deux paiements pour le même locataire, le même bien et le même mois
- ✅ Ignore les paiements manuels sans `tenant_id` (pas de contrainte)
- ✅ Remplissage automatique via trigger lors des INSERT/UPDATE

### 2. Indexation (déjà en place)

Les index suivants existent déjà et sont optimaux pour les performances :

- ✅ `idx_payments_status` sur `status` - Pour les filtres par statut
- ✅ `idx_payments_due_date` sur `due_date` - Pour les requêtes par date d'échéance
- ✅ `idx_payments_user_id` sur `user_id` - Pour RLS et filtres utilisateur
- ✅ `idx_payments_tenant_id` sur `tenant_id` - Pour les jointures
- ✅ `idx_payments_property_id` sur `property_id` - Pour les jointures
- ✅ `idx_payments_date` sur `date` - Pour compatibilité avec l'ancien schéma

## 🔧 Impact sur l'Edge Function

L'Edge Function `generateMonthlyRents` a été mise à jour pour utiliser la colonne `period` :

**Avant** :
```typescript
.gte('due_date', monthStartStr)
.lte('due_date', monthEndStr)
```

**Après** :
```typescript
.eq('period', period) // Format 'YYYY-MM'
```

**Avantages** :
- ✅ Vérification plus rapide (index unique)
- ✅ Plus simple et plus fiable
- ✅ Protection au niveau base de données (même si l'Edge Function échoue)

## 🧪 Tests recommandés

1. **Test de contrainte** :
   ```sql
   -- Doit échouer (doublon)
   INSERT INTO payments (tenant_id, property_id, period, amount, status, due_date, user_id)
   VALUES 
     ('tenant-1', 'property-1', '2025-02', 1000, 'pending', '2025-02-01', 'user-1'),
     ('tenant-1', 'property-1', '2025-02', 1000, 'pending', '2025-02-01', 'user-1');
   ```

2. **Test du trigger** :
   ```sql
   -- period doit être rempli automatiquement
   INSERT INTO payments (tenant_id, property_id, amount, status, due_date, user_id)
   VALUES ('tenant-1', 'property-1', 1000, 'pending', '2025-02-15', 'user-1');
   
   -- Vérifier que period = '2025-02'
   SELECT period FROM payments WHERE due_date = '2025-02-15';
   ```

## 📊 Performance

Avec ces index, les requêtes suivantes sont optimisées :

- ✅ Filtrage par statut : `WHERE status = 'pending'` → utilise `idx_payments_status`
- ✅ Filtrage par date : `WHERE due_date >= '2025-01-01'` → utilise `idx_payments_due_date`
- ✅ Vérification de doublons : `WHERE tenant_id = X AND property_id = Y AND period = '2025-02'` → utilise `idx_payments_unique_monthly_rent`
- ✅ Dashboard avec milliers de paiements : performances maintenues grâce aux index

## 🔐 Sécurité

- ✅ Contrainte au niveau base de données (impossible de contourner)
- ✅ Protection même si l'Edge Function a un bug
- ✅ RLS toujours actif (les utilisateurs ne voient que leurs paiements)

## 📝 Notes

- La colonne `period` est nullable pour les paiements manuels sans date
- Le trigger fonctionne sur INSERT et UPDATE de `due_date` ou `date`
- Les paiements existants ont été mis à jour automatiquement lors de la migration

---

**Date de migration** : 1er février 2025  
**Version** : v0.2.1
