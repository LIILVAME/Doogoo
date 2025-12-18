# Utilisation du MCP Supabase pour les Migrations

## ✅ Migrations Appliquées via MCP

Les migrations suivantes ont été appliquées avec succès en utilisant le MCP Supabase :

### 1. `add_missing_columns` (20250102000000)

**Objectif :** Compléter le schéma existant avec les colonnes manquantes pour correspondre au frontend TypeScript.

**Ajouts :**

- **properties** : `description`, `type`, `image`
- **tenants** : `user_id` (CRITIQUE pour RLS), `email`
- **payments** : `due_date`
- Mise à jour des contraintes CHECK pour `tenants.status` et `payments.amount`
- Création des index manquants

### 2. `add_triggers_and_rls_policies` (20250102000001)

**Objectif :** Ajouter les triggers et politiques RLS manquantes.

**Ajouts :**

- Fonction `handle_updated_at()` pour mettre à jour automatiquement `updated_at`
- Triggers `set_updated_at_*` sur toutes les tables
- Fonction `handle_new_user()` pour créer automatiquement un profil à l'inscription
- Trigger `on_auth_user_created` sur `auth.users`
- Politiques RLS pour la table `tenants` (SELECT, INSERT, UPDATE, DELETE)

## 📊 État Actuel du Schéma

### Tables Principales

#### ✅ `profiles`

- Toutes les colonnes présentes
- RLS activé
- Politiques RLS en place

#### ✅ `properties`

- Colonnes complètes : `description`, `type`, `image` ajoutées
- RLS activé
- Politiques RLS en place

#### ✅ `tenants`

- **Colonnes critiques ajoutées :** `user_id`, `email`
- RLS activé
- **Politiques RLS créées** (étaient manquantes)
- Contraintes CHECK mises à jour

#### ✅ `payments`

- Colonne `due_date` ajoutée
- RLS activé
- Politiques RLS en place
- Contrainte CHECK `amount > 0` mise à jour

## 🔐 Sécurité (RLS)

Toutes les tables ont maintenant des politiques RLS complètes :

- **profiles** : 4 politiques (SELECT, INSERT, UPDATE, DELETE)
- **properties** : 4 politiques (SELECT, INSERT, UPDATE, DELETE)
- **tenants** : 4 politiques (SELECT, INSERT, UPDATE, DELETE) ✅ **Ajoutées**
- **payments** : 4 politiques (SELECT, INSERT, UPDATE, DELETE)

Toutes les politiques utilisent `auth.uid() = user_id` pour garantir l'isolation des données entre utilisateurs.

## 🔄 Triggers

### Triggers `updated_at`

- `set_updated_at_profiles`
- `set_updated_at_properties`
- `set_updated_at_tenants`
- `set_updated_at_payments`

Tous mettent à jour automatiquement `updated_at` lors des modifications.

### Trigger `on_auth_user_created`

Crée automatiquement un profil dans `public.profiles` lorsqu'un nouvel utilisateur s'inscrit via `auth.users`.

## 📝 Commandes MCP Utilisées

```javascript
// Liste des tables
call_mcp_tool('user-supabase', 'list_tables', {})

// Liste des migrations
call_mcp_tool('user-supabase', 'list_migrations', {})

// Application d'une migration
call_mcp_tool('user-supabase', 'apply_migration', {
  name: 'add_missing_columns',
  query: '-- SQL migration...'
})

// Exécution de SQL direct
call_mcp_tool('user-supabase', 'execute_sql', {
  query: 'SELECT ...'
})
```

## ⚠️ Notes Importantes

1. **Migration des données existantes** : La colonne `user_id` dans `tenants` a été peuplée automatiquement depuis `properties.user_id` pour les données existantes.

2. **Contraintes CHECK** : Les contraintes existantes ont été mises à jour pour correspondre aux interfaces TypeScript :
   - `tenants.status` : ajout de `'pending'` et `'paid'`
   - `payments.amount` : changement de `>= 0` à `> 0`

3. **Index** : Tous les index nécessaires ont été créés pour optimiser les requêtes RLS et les jointures.

4. **RLS pour tenants** : C'était critique d'ajouter `user_id` et les politiques RLS pour `tenants`, car sans cela, les données des locataires n'étaient pas protégées.

## 🚀 Prochaines Étapes

Le schéma est maintenant complet et aligné avec le frontend TypeScript. Vous pouvez :

1. Tester les requêtes depuis le frontend
2. Vérifier que les politiques RLS fonctionnent correctement
3. Générer les types TypeScript avec `generate_typescript_types` si nécessaire
