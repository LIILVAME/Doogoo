# 🔒 Audit Row Level Security (RLS) Supabase

**Date** : 2025-11-02  
**Statut** : ⚠️ À valider

---

## 📋 Tables concernées

### 1. `properties`

**Politique RLS attendue :**

```sql
-- Permet aux utilisateurs de lire uniquement leurs propres biens
CREATE POLICY "Users can read own properties"
ON properties FOR SELECT
USING (auth.uid() = user_id);

-- Permet aux utilisateurs de créer leurs propres biens
CREATE POLICY "Users can create own properties"
ON properties FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Permet aux utilisateurs de mettre à jour leurs propres biens
CREATE POLICY "Users can update own properties"
ON properties FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permet aux utilisateurs de supprimer leurs propres biens
CREATE POLICY "Users can delete own properties"
ON properties FOR DELETE
USING (auth.uid() = user_id);
```

**Vérification :**

```sql
-- Dans Supabase SQL Editor
SELECT * FROM pg_policies
WHERE tablename = 'properties';
```

---

### 2. `payments`

**Politique RLS attendue :**

```sql
-- Permet aux utilisateurs de lire uniquement leurs propres paiements
CREATE POLICY "Users can read own payments"
ON payments FOR SELECT
USING (auth.uid() = user_id);

-- Permet aux utilisateurs de créer leurs propres paiements
CREATE POLICY "Users can create own payments"
ON payments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Permet aux utilisateurs de mettre à jour leurs propres paiements
CREATE POLICY "Users can update own payments"
ON payments FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permet aux utilisateurs de supprimer leurs propres paiements
CREATE POLICY "Users can delete own payments"
ON payments FOR DELETE
USING (auth.uid() = user_id);
```

---

### 3. `tenants`

**Politique RLS attendue :**

```sql
-- Permet aux utilisateurs de lire les locataires de leurs biens
CREATE POLICY "Users can read tenants of own properties"
ON tenants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = tenants.property_id
    AND properties.user_id = auth.uid()
  )
);

-- Permet aux utilisateurs de créer des locataires pour leurs biens
CREATE POLICY "Users can create tenants for own properties"
ON tenants FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = tenants.property_id
    AND properties.user_id = auth.uid()
  )
);

-- Permet aux utilisateurs de mettre à jour les locataires de leurs biens
CREATE POLICY "Users can update tenants of own properties"
ON tenants FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = tenants.property_id
    AND properties.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = tenants.property_id
    AND properties.user_id = auth.uid()
  )
);

-- Permet aux utilisateurs de supprimer les locataires de leurs biens
CREATE POLICY "Users can delete tenants of own properties"
ON tenants FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = tenants.property_id
    AND properties.user_id = auth.uid()
  )
);
```

---

## 🔍 Vérifications à effectuer

### 1. RLS activé sur toutes les tables

```sql
-- Vérifier que RLS est activé
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('properties', 'payments', 'tenants', 'profiles');
```

**Attendu :** `rowsecurity = true` pour toutes les tables.

---

### 2. Politiques présentes

```sql
-- Lister toutes les politiques
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Attendu :** Au moins 4 politiques par table (SELECT, INSERT, UPDATE, DELETE).

---

### 3. Test d'isolation

**Test 1 : Utilisateur A ne peut pas lire les données de l'utilisateur B**

1. Créer 2 comptes utilisateurs (A et B)
2. Utilisateur A crée un bien
3. Utilisateur B tente de lire les biens de A
4. **Attendu :** Liste vide (pas d'erreur, juste pas de résultats)

**Test 2 : Utilisateur A ne peut pas modifier les données de l'utilisateur B**

1. Utilisateur B crée un bien
2. Utilisateur A tente de modifier ce bien
3. **Attendu :** Erreur "permission denied" ou 0 rows affected

---

## ⚠️ Problèmes potentiels

### 1. RLS désactivé

**Symptôme :**

- Tous les utilisateurs peuvent voir toutes les données
- Pas d'isolation entre utilisateurs

**Solution :**

```sql
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
```

---

### 2. Politiques manquantes

**Symptôme :**

- Erreur "permission denied" sur certaines opérations
- Insert/Update/Delete ne fonctionnent pas

**Solution :**
Créer les politiques manquantes (voir sections ci-dessus).

---

### 3. `auth.uid()` retourne null

**Symptôme :**

- Politiques RLS fonctionnent mais `auth.uid() = user_id` échoue
- Les utilisateurs authentifiés ne peuvent pas accéder à leurs propres données

**Solution :**
Vérifier que :

1. La session Supabase est bien créée après login
2. `user_id` dans les tables correspond à `auth.uid()`
3. Le trigger `set_user_id()` est actif (si utilisé)

---

## 🧪 Script de test

Créer `scripts/test-supabase-rls.js` :

```js
/**
 * Test les politiques RLS Supabase
 */
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

// Test 1 : Lecture après authentification
async function testRead() {
  const { data, error } = await supabase.from('properties').select('*')

  if (error) {
    console.error('❌ Erreur lecture:', error)
    return false
  }

  console.log('✅ Lecture OK:', data.length, 'biens')
  return true
}

// Test 2 : Isolation (nécessite 2 utilisateurs)
// À implémenter selon besoins

testRead()
```

---

## ✅ Checklist finale

- [ ] RLS activé sur toutes les tables (`properties`, `payments`, `tenants`, `profiles`)
- [ ] Politiques SELECT présentes pour toutes les tables
- [ ] Politiques INSERT présentes pour toutes les tables
- [ ] Politiques UPDATE présentes pour toutes les tables
- [ ] Politiques DELETE présentes pour toutes les tables
- [ ] Test d'isolation effectué (utilisateur A ne peut pas voir/modifier données de B)
- [ ] Test de lecture effectué (utilisateur authentifié peut lire ses propres données)

---

## 🔗 Références

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase RLS Policies](https://supabase.com/docs/guides/database/postgres/row-level-security)
