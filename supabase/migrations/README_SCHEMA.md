# Schéma de Base de Données Doogoo

## 📋 Vue d'ensemble

Ce document décrit le schéma SQL complet pour l'application Doogoo (Gestion Locative) sur Supabase.

## 🗂️ Structure des Tables

### 1. `profiles`

Table publique liée à `auth.users` pour stocker les informations du profil utilisateur.

**Colonnes :**

- `id` (UUID, PK) → Référence `auth.users(id)`
- `user_id` (UUID, UNIQUE) → Référence `auth.users(id)`
- `full_name` (TEXT, nullable) → Nom complet pour les quittances PDF
- `phone` (TEXT, nullable)
- `company` (TEXT, nullable)
- `avatar_url` (TEXT, nullable)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### 2. `properties`

Table pour stocker les biens immobiliers.

**Colonnes :**

- `id` (UUID, PK) → Généré automatiquement
- `user_id` (UUID, NOT NULL) → Référence `auth.users(id)` pour RLS
- `name` (TEXT, NOT NULL)
- `address` (TEXT, nullable)
- `city` (TEXT, NOT NULL)
- `rent` (NUMERIC(10,2), NOT NULL) → Loyer mensuel, >= 0
- `status` (TEXT, NOT NULL) → `'occupied'` ou `'vacant'`
- `surface` (NUMERIC(10,2), nullable) → Surface en m²
- `pieces` (INTEGER, nullable) → Nombre de pièces
- `description` (TEXT, nullable)
- `type` (TEXT, nullable) → Type de bien (Appartement, Maison, etc.)
- `image` (TEXT, nullable) → URL de l'image
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### 3. `tenants`

Table pour stocker les locataires.

**Colonnes :**

- `id` (UUID, PK) → Généré automatiquement
- `property_id` (UUID, nullable) → Référence `properties(id)`, ON DELETE SET NULL
- `user_id` (UUID, NOT NULL) → Référence `auth.users(id)` pour RLS
- `name` (TEXT, NOT NULL) → Nom complet du locataire (PII)
- `email` (TEXT, nullable)
- `entry_date` (DATE, NOT NULL) → Date d'entrée
- `exit_date` (DATE, nullable) → Date de sortie (doit être >= entry_date)
- `rent` (NUMERIC(10,2), NOT NULL) → Loyer du locataire, >= 0
- `status` (TEXT, NOT NULL) → `'on_time'`, `'late'`, `'pending'` ou `'paid'`
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### 4. `payments`

Table pour stocker les paiements de loyer.

**Colonnes :**

- `id` (UUID, PK) → Généré automatiquement
- `property_id` (UUID, NOT NULL) → Référence `properties(id)`, ON DELETE CASCADE
- `tenant_id` (UUID, nullable) → Référence `tenants(id)`, ON DELETE SET NULL
- `user_id` (UUID, NOT NULL) → Référence `auth.users(id)` pour RLS
- `amount` (NUMERIC(10,2), NOT NULL) → Montant payé, > 0
- `status` (TEXT, NOT NULL) → `'paid'`, `'pending'` ou `'late'`
- `due_date` (DATE, nullable) → Date d'échéance
- `date` (DATE, nullable) → Date de paiement effectif
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

## 🔒 Sécurité (Row Level Security)

**Toutes les tables ont RLS activé** avec des politiques qui permettent :

- **SELECT** : Lecture de ses propres données uniquement (`auth.uid() = user_id`)
- **INSERT** : Création de données avec son propre `user_id`
- **UPDATE** : Modification de ses propres données uniquement
- **DELETE** : Suppression de ses propres données uniquement

### Exception pour `profiles`

Pour la table `profiles`, l'utilisateur peut uniquement lire/modifier **son propre profil** (basé sur `user_id`).

## 🔄 Triggers Automatiques

### 1. `handle_new_user()`

**Déclenchement :** Après insertion dans `auth.users`

**Action :** Crée automatiquement une entrée dans `public.profiles` avec :

- `id` et `user_id` = `auth.users.id`
- `full_name` depuis `raw_user_meta_data->>'full_name'` ou `raw_user_meta_data->>'name'`
- `phone` depuis `raw_user_meta_data->>'phone'`

**Note :** Utilise `ON CONFLICT DO NOTHING` pour éviter les erreurs si le profil existe déjà.

### 2. `handle_updated_at()`

**Déclenchement :** Avant UPDATE sur toutes les tables

**Action :** Met à jour automatiquement `updated_at` à `NOW()`

**Tables concernées :**

- `profiles`
- `properties`
- `tenants`
- `payments`

## 📊 Index Créés

Pour améliorer les performances, des index ont été créés sur :

### `profiles`

- `idx_profiles_user_id` sur `user_id`

### `properties`

- `idx_properties_user_id` sur `user_id`
- `idx_properties_status` sur `status`

### `tenants`

- `idx_tenants_user_id` sur `user_id`
- `idx_tenants_property_id` sur `property_id`
- `idx_tenants_status` sur `status`

### `payments`

- `idx_payments_user_id` sur `user_id`
- `idx_payments_property_id` sur `property_id`
- `idx_payments_tenant_id` sur `tenant_id`
- `idx_payments_status` sur `status`
- `idx_payments_due_date` sur `due_date`

## ✅ Contraintes d'Intégrité

1. **Montants >= 0 :** `rent` et `amount` doivent être >= 0 (CHECK)
2. **Montants > 0 :** `amount` dans payments doit être > 0 (CHECK)
3. **Statuts valides :** CHECK constraints sur tous les champs `status`
4. **Dates cohérentes :** `exit_date >= entry_date` pour tenants (CHECK)
5. **Clés étrangères :** Toutes les relations sont protégées par FOREIGN KEY

## 🚀 Installation

### Étape 1 : Ouvrir l'éditeur SQL Supabase

1. Connectez-vous à votre projet Supabase
2. Allez dans **SQL Editor**

### Étape 2 : Exécuter le script

1. Copiez le contenu de `20250101000000_initial_schema.sql`
2. Collez-le dans l'éditeur SQL
3. Cliquez sur **Run** (ou `Cmd+Enter` / `Ctrl+Enter`)

### Étape 3 : Vérification

Vérifiez que toutes les tables, politiques et triggers ont été créés :

```sql
-- Vérifier les tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Vérifier les politiques RLS
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Vérifier les triggers
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE event_object_schema = 'public'
ORDER BY event_object_table;
```

## 🔍 Correspondance avec le Frontend

Ce schéma correspond exactement aux interfaces TypeScript définies dans :

- `src/stores/propertiesStore.ts` → `PropertyData`, `PropertyApiData`
- `src/stores/tenantsStore.ts` → `TenantData`
- `src/stores/paymentsStore.ts` → `PaymentData`, `PaymentApiData`
- `src/types/api.d.ts` → `UserProfile`

## ⚠️ Notes Importantes

1. **Nomenclature :** Le code utilise `user_id` partout (pas `owner_id`) pour simplifier les politiques RLS
2. **Cascade :** La suppression d'un utilisateur (`auth.users`) supprime automatiquement toutes ses données (CASCADE)
3. **Soft Delete :** Les tenants et payments peuvent avoir `property_id` ou `tenant_id` à NULL si le bien/locataire est supprimé (SET NULL)
4. **Données sensibles :** Les champs PII (nom, email, téléphone) ne doivent jamais être loggés en clair (voir `src/utils/sanitizeLogs.js`)

## 📝 Prochaines Étapes (Optionnel)

Pour améliorer le schéma, vous pourriez ajouter :

1. **Vues matérialisées** pour les statistiques (occupation, revenus)
2. **Fonctions SQL** pour calculer automatiquement les statuts (late, pending)
3. **Partitionnement** pour la table `payments` si elle devient très volumineuse
4. **Full-text search** sur les champs texte (name, description, address)
