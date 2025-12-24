# 📊 SCHEMA DE BASE DE DONNÉES - DOOGOO

> **Généré automatiquement** via introspection Supabase  
> **Dernière mise à jour** : 2025-01-31  
> **Schéma principal** : `public`

---

## 📋 LISTE DES TABLES

Le projet utilise **10 tables principales** dans le schéma `public` :

1. `properties` - Biens immobiliers
2. `tenants` - Locataires
3. `payments` - Paiements de loyers
4. `profiles` - Profils utilisateurs (bailleurs)
5. `alerts` - Système d'alertes centralisé
6. `alert_rules` - Règles métier pour génération d'alertes
7. `alert_history` - Historique des changements de statut des alertes
8. `resolved_alerts` - ⚠️ **DEPRECATED** (utiliser `alerts` avec `status='resolved'`)
9. `currency` - Devises (pas de RLS, table de référence)

---

## 🆕 CHAMPS RÉCEMMENT AJOUTÉS

### Table `properties`
- ✅ `zip` (text, nullable) - Code postal (ajouté via migration 20250102)
- ✅ `charges_amount` (numeric, nullable, default: 0) - Montant des charges (ajouté via migration)

### Table `profiles`
- ✅ `first_name`, `last_name` - Informations bailleur (Loi Alur)
- ✅ `address_line`, `postal_code`, `city` - Adresse structurée
- ✅ `siret`, `rcs` - Identifiants professionnels
- ✅ `iban`, `bic`, `bank_name` - Informations bancaires
- ✅ `signature_url` - Signature scannée (Storage)
- ✅ `landlord_type` - Type de bailleur (`'individual'` ou `'company'`)
- ✅ `capital_social`, `legal_form` - Informations société
- ✅ `preferences` (jsonb) - Préférences utilisateur (notifications, thème, devise, langue)

---

## 🏠 TABLE: `properties`

**RLS activé** : ✅ Oui

### Colonnes

| Colonne | Type | Nullable | Description | ⚠️ Mapping Critique |
|---------|------|----------|-------------|---------------------|
| `id` | `uuid` | ❌ | PK, auto-généré | - |
| `user_id` | `uuid` | ❌ | FK → `auth.users.id` | - |
| `name` | `text` | ❌ | Nom du bien | - |
| `address` | `text` | ✅ | Adresse complète | - |
| `city` | `text` | ❌ | Ville | - |
| `zip` | `text` | ✅ | Code postal | - |
| `rent` | `numeric` | ❌ | Loyer mensuel (≥ 0) | - |
| `status` | `text` | ❌ | `'vacant'` ou `'occupied'` | - |
| `surface_m2` | `numeric` | ✅ | **⚠️ DB: `surface_m2` → Frontend: `surface`** | 🔴 CRITIQUE |
| `rooms` | `integer` | ✅ | **⚠️ DB: `rooms` → Frontend: `pieces`** | 🔴 CRITIQUE |
| `description` | `text` | ✅ | Description libre | - |
| `type` | `text` | ✅ | Type de bien | - |
| `image` | `text` | ✅ | URL de l'image | **⚠️ DB: `image` → Frontend: `image` (mais parfois `image_url` en legacy)** |
| `heating_type` | `text` | ✅ | **⚠️ DB: `heating_type` → Frontend: `heatingType`** | 🔴 CRITIQUE |
| `charges_amount` | `numeric` | ✅ | **⚠️ DB: `charges_amount` → Frontend: `chargesAmount`** | 🔴 CRITIQUE |
| `image_url` | `text` | ✅ | Legacy (utiliser `image`) | ⚠️ Legacy |
| `created_at` | `timestamptz` | ✅ | Timestamp de création | - |
| `updated_at` | `timestamptz` | ✅ | Timestamp de mise à jour | - |

### Clés étrangères

- `properties_user_id_fkey` : `user_id` → `auth.users.id`
- Référencée par : `payments.property_id`, `tenants.property_id`

### 🔴 MAPPINGS CRITIQUES (Source d'erreurs fréquentes)

**Ces mappings sont gérés dans `src/api/properties.js` et `src/stores/propertiesStore.ts` :**

| Frontend (CamelCase) | Backend (snake_case) | Fichier de mapping |
|---------------------|---------------------|-------------------|
| `surface` | `surface_m2` | `api/properties.js` (lignes 115-116, 169-170) |
| `pieces` | `rooms` | `api/properties.js` (lignes 118-119, 172-173) |
| `heatingType` | `heating_type` | `api/properties.js` (lignes 121-122, 175-176) |
| `chargesAmount` | `charges_amount` | `api/properties.js` (lignes 124-125, 178-179) |
| `image` / `image_url` | `image` | `api/properties.js` (lignes 127-128, 181-182) |

**⚠️ RÈGLE D'OR :** Toujours utiliser les fonctions de l'API layer (`src/api/properties.js`) qui gèrent automatiquement ces conversions.

---

## 👥 TABLE: `tenants`

**RLS activé** : ✅ Oui

### Colonnes

| Colonne | Type | Nullable | Description | ⚠️ Mapping Critique |
|---------|------|----------|-------------|---------------------|
| `id` | `uuid` | ❌ | PK, auto-généré | - |
| `property_id` | `uuid` | ❌ | FK → `properties.id` | - |
| `user_id` | `uuid` | ❌ | FK → `auth.users.id` | - |
| `name` | `text` | ❌ | Nom du locataire | - |
| `email` | `text` | ✅ | Email du locataire | - |
| `entry_date` | `date` | ❌ | Date d'entrée | **⚠️ DB: `entry_date` → Frontend: `entryDate`** |
| `exit_date` | `date` | ✅ | Date de sortie | **⚠️ DB: `exit_date` → Frontend: `exitDate`** |
| `rent` | `numeric` | ❌ | Loyer (≥ 0) | - |
| `status` | `text` | ❌ | `'on_time'`, `'late'`, `'pending'`, `'paid'` (défaut: `'on_time'`) | - |
| `created_at` | `timestamptz` | ✅ | Timestamp de création | - |
| `updated_at` | `timestamptz` | ✅ | Timestamp de mise à jour | - |

### Clés étrangères

- `tenants_property_id_fkey` : `property_id` → `properties.id`
- `tenants_user_id_fkey` : `user_id` → `auth.users.id`
- Référencée par : `payments.tenant_id`

---

## 💰 TABLE: `payments`

**RLS activé** : ✅ Oui

### Colonnes

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| `id` | `uuid` | ❌ | PK, auto-généré |
| `user_id` | `uuid` | ❌ | FK → `auth.users.id` |
| `property_id` | `uuid` | ✅ | FK → `properties.id` |
| `tenant_id` | `uuid` | ✅ | FK → `tenants.id` |
| `currency_id` | `uuid` | ✅ | FK → `currency.id` |
| `amount` | `numeric` | ❌ | Montant (> 0) |
| `date` | `date` | ❌ | Date du paiement |
| `due_date` | `date` | ✅ | Date d'échéance |
| `status` | `text` | ❌ | `'paid'`, `'pending'`, `'late'` (défaut: `'pending'`) |
| `created_at` | `timestamptz` | ✅ | Timestamp de création |
| `updated_at` | `timestamptz` | ✅ | Timestamp de mise à jour |

### Clés étrangères

- `payments_user_id_fkey` : `user_id` → `auth.users.id`
- `payments_property_id_fkey` : `property_id` → `properties.id`
- `payments_tenant_id_fkey` : `tenant_id` → `tenants.id`
- `payments_currency_id_fkey` : `currency_id` → `currency.id`

---

## 👤 TABLE: `profiles`

**RLS activé** : ✅ Oui

### Colonnes principales

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| `id` | `uuid` | ❌ | PK = `user_id` |
| `user_id` | `uuid` | ❌ | FK → `auth.users.id` (UNIQUE) |
| `full_name` | `text` | ✅ | Nom complet |
| `first_name` | `text` | ✅ | Prénom (pour contrats Loi Alur) |
| `last_name` | `text` | ✅ | Nom (pour contrats Loi Alur) |
| `phone` | `text` | ✅ | Téléphone |
| `company` | `text` | ✅ | Société |
| `avatar_url` | `text` | ✅ | URL de l'avatar |
| `address` | `text` | ✅ | Adresse (legacy) |
| `address_line` | `text` | ✅ | Ligne d'adresse |
| `postal_code` | `text` | ✅ | Code postal |
| `city` | `text` | ✅ | Ville |
| `siret` | `text` | ✅ | Numéro SIRET |
| `rcs` | `text` | ✅ | Numéro RCS |
| `iban` | `text` | ✅ | IBAN bancaire |
| `bic` | `text` | ✅ | Code BIC |
| `bank_name` | `text` | ✅ | Nom de la banque |
| `signature_url` | `text` | ✅ | URL de la signature (Storage) |
| `landlord_type` | `text` | ✅ | `'individual'` ou `'company'` (défaut: `'individual'`) |
| `capital_social` | `text` | ✅ | Capital social |
| `legal_form` | `text` | ✅ | Forme juridique (SCI, SARL, SAS, SA) |
| `preferences` | `jsonb` | ✅ | Préférences utilisateur (notifications, thème, devise, langue) |
| `created_at` | `timestamptz` | ✅ | Timestamp de création |
| `updated_at` | `timestamptz` | ✅ | Timestamp de mise à jour |

### Clés étrangères

- `profiles_id_fkey` : `id` → `auth.users.id`
- `profiles_user_id_fkey` : `user_id` → `auth.users.id`

---

## 🚨 TABLE: `alerts`

**RLS activé** : ✅ Oui

### Colonnes

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| `id` | `uuid` | ❌ | PK, auto-généré |
| `user_id` | `uuid` | ❌ | FK → `auth.users.id` |
| `type` | `text` | ❌ | Type d'alerte (voir contraintes) |
| `status` | `text` | ❌ | `'active'`, `'resolved'`, `'dismissed'`, `'archived'` (défaut: `'active'`) |
| `severity` | `text` | ❌ | `'high'`, `'medium'`, `'low'` |
| `source_type` | `text` | ❌ | `'payment'`, `'property'`, `'tenant'`, `'portfolio'`, `'document'` |
| `source_id` | `uuid` | ✅ | ID de la source |
| `title` | `text` | ❌ | Titre de l'alerte |
| `message` | `text` | ❌ | Message de l'alerte |
| `metadata` | `jsonb` | ✅ | Métadonnées flexibles (daysLate, amount, occupancyRate, etc.) |
| `detected_at` | `timestamptz` | ❌ | Date de détection |
| `resolved_at` | `timestamptz` | ✅ | Date de résolution |
| `dismissed_at` | `timestamptz` | ✅ | Date de rejet |
| `archived_at` | `timestamptz` | ✅ | Date d'archivage |
| `expires_at` | `timestamptz` | ✅ | Date d'expiration |
| `action_url` | `text` | ✅ | URL d'action |
| `action_label` | `text` | ✅ | Libellé du bouton d'action |
| `created_at` | `timestamptz` | ❌ | Timestamp de création |
| `updated_at` | `timestamptz` | ❌ | Timestamp de mise à jour |

### Types d'alertes autorisés

- `'late_payment'`
- `'unpaid_after_days'`
- `'upcoming_lease_end'`
- `'low_occupancy'`
- `'maintenance_due'`
- `'document_expiring'`
- `'rent_increase_due'`

### Clés étrangères

- `alerts_user_id_fkey` : `user_id` → `auth.users.id`
- Référencée par : `alert_history.alert_id`

---

## ⚙️ TABLE: `alert_rules`

**RLS activé** : ✅ Oui

### Colonnes

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| `id` | `uuid` | ❌ | PK, auto-généré |
| `user_id` | `uuid` | ✅ | FK → `auth.users.id` |
| `alert_type` | `text` | ❌ | Type d'alerte (voir `alerts.type`) |
| `condition_type` | `text` | ❌ | `'days_overdue'`, `'days_until'`, `'occupancy_rate'`, `'amount_threshold'`, `'date_range'` |
| `condition_value` | `jsonb` | ❌ | Valeur de la condition |
| `severity` | `text` | ❌ | `'high'`, `'medium'`, `'low'` |
| `is_active` | `boolean` | ❌ | Règle active (défaut: `true`) |
| `created_at` | `timestamptz` | ❌ | Timestamp de création |
| `updated_at` | `timestamptz` | ❌ | Timestamp de mise à jour |

---

## 📜 TABLE: `alert_history`

**RLS activé** : ✅ Oui

Historique des changements de statut des alertes.

### Colonnes

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| `id` | `uuid` | ❌ | PK, auto-généré |
| `alert_id` | `uuid` | ❌ | FK → `alerts.id` |
| `user_id` | `uuid` | ❌ | FK → `auth.users.id` |
| `old_status` | `text` | ✅ | Ancien statut |
| `new_status` | `text` | ❌ | Nouveau statut |
| `changed_by` | `text` | ❌ | `'user'`, `'system'`, `'auto'` |
| `reason` | `text` | ✅ | Raison du changement |
| `metadata` | `jsonb` | ✅ | Métadonnées |
| `created_at` | `timestamptz` | ❌ | Timestamp de création |

---

## 💱 TABLE: `currency`

**RLS activé** : ❌ Non (table de référence)

### Colonnes

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| `id` | `uuid` | ❌ | PK, auto-généré |
| `name_long` | `text` | ❌ | Nom complet (UNIQUE) |
| `name_short` | `bpchar` | ❌ | Code ISO (UNIQUE) |
| `symbol` | `text` | ❌ | Symbole monétaire |
| `decimal_digits` | `integer` | ❌ | Nombre de décimales (défaut: 2) |
| `rounding` | `integer` | ❌ | Arrondi (défaut: 0) |
| `is_active` | `boolean` | ❌ | Devise active (défaut: `true`) |
| `created_at` | `timestamptz` | ✅ | Timestamp de création |
| `updated_at` | `timestamptz` | ✅ | Timestamp de mise à jour |

### Clés étrangères

- Référencée par : `payments.currency_id`

---

## ⚠️ TABLE: `resolved_alerts` (DEPRECATED)

**Status** : ⚠️ **DEPRECATED**  
**Migration** : Utiliser `alerts` avec `status='resolved'`  
**Suppression prévue** : Après validation de la migration

---

## 🔐 ROW LEVEL SECURITY (RLS)

Toutes les tables sauf `currency` ont RLS activé. Les politiques garantissent que :
- Les utilisateurs ne voient que **leurs propres données** (filtrage par `user_id`)
- Les opérations CRUD respectent les permissions utilisateur

---

## 📝 NOTES IMPORTANTES

1. **Conventions de nommage** :
   - **Backend (DB)** : `snake_case` (ex: `surface_m2`, `heating_type`)
   - **Frontend (JS/TS)** : `camelCase` (ex: `surface`, `heatingType`)

2. **Mappings critiques** : Toujours passer par l'API layer (`src/api/`) qui gère automatiquement les conversions.

3. **Timestamps** : `created_at` et `updated_at` sont auto-gérés par des triggers PostgreSQL (vérifier les migrations).

4. **Relations** : Les propriétés peuvent avoir plusieurs locataires (historique), mais l'UI affiche généralement le locataire actif (sans `exit_date`).
