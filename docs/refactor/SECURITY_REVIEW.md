# 🔐 Audit de Sécurité — Doogoo v0.2.2+

**Date** : 2025-01-28  
**Objectif** : Vérifier et documenter la sécurité de l'application

---

## ✅ Supabase RLS Policies

### 1. **Table `properties`** ✅

**RLS Activé** : ✅

**Policies** :

- ✅ **SELECT** : `auth.uid() = user_id`
- ✅ **INSERT** : `auth.uid() = user_id` (with_check)
- ✅ **UPDATE** : `auth.uid() = user_id` (qual + with_check)
- ✅ **DELETE** : `auth.uid() = user_id`

**Sécurité** : ✅ Les utilisateurs ne peuvent voir/modifier que leurs propres biens

---

### 2. **Table `tenants`** ✅

**RLS Activé** : ✅

**Policies** :

- ✅ **SELECT** : `EXISTS (SELECT 1 FROM properties WHERE properties.id = tenants.property_id AND properties.user_id = auth.uid())`
- ✅ **INSERT** : Vérification via `properties.user_id = auth.uid()` (with_check)
- ✅ **UPDATE** : Vérification via `properties.user_id = auth.uid()` (qual + with_check)
- ✅ **DELETE** : Vérification via `properties.user_id = auth.uid()` (qual)

**Sécurité** : ✅ Les utilisateurs ne peuvent gérer que les locataires de leurs propres biens

---

### 3. **Table `payments`** ✅

**RLS Activé** : ✅

**Policies** :

- ✅ **SELECT** : `auth.uid() = user_id`
- ✅ **INSERT** : `auth.uid() = user_id` (with_check)
- ✅ **UPDATE** : `auth.uid() = user_id` (qual + with_check)
- ✅ **DELETE** : `auth.uid() = user_id`

**Sécurité** : ✅ Les utilisateurs ne peuvent voir/modifier que leurs propres paiements

---

### 4. **Table `profiles`** ✅

**RLS Activé** : ✅

**Policies** :

- ✅ **SELECT** : `auth.uid() = user_id`
- ✅ **INSERT** : `auth.uid() = user_id` (with_check)
- ✅ **UPDATE** : `auth.uid() = user_id` (qual + with_check)
- ✅ **DELETE** : `auth.uid() = user_id`

**Sécurité** : ✅ Les utilisateurs ne peuvent voir/modifier que leur propre profil

---

## 📋 Résumé RLS

| Table        | RLS Activé | SELECT | INSERT | UPDATE | DELETE | Sécurité |
| ------------ | ---------- | ------ | ------ | ------ | ------ | -------- |
| `properties` | ✅         | ✅     | ✅     | ✅     | ✅     | ✅       |
| `tenants`    | ✅         | ✅     | ✅     | ✅     | ✅     | ✅       |
| `payments`   | ✅         | ✅     | ✅     | ✅     | ✅     | ✅       |
| `profiles`   | ✅         | ✅     | ✅     | ✅     | ✅     | ✅       |

**Conclusion** : ✅ **Toutes les tables sont correctement sécurisées avec RLS**

---

## ⚠️ Informations sensibles dans les logs

### Analyse des logs

**Fichiers à vérifier** :

- `src/stores/authStore.js` : Logs de session utilisateur
- `src/pages/LoginPage.vue` : Logs OAuth
- `src/App.vue` : Logs USER_UPDATED avec données utilisateur
- `src/components/dev/TestSupabase.vue` : Logs de clés API (partiellement masqués)

**À corriger** :

- [ ] Masquer `user.id` et `user.email` dans les logs
- [ ] Masquer tokens OAuth complets
- [ ] Vérifier que les clés API sont toujours masquées

---

## 🔒 Headers de sécurité

### À implémenter (Vercel)

1. **Content Security Policy (CSP)**

   ```
   Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://*.supabase.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co;
   ```

2. **X-Frame-Options**

   ```
   X-Frame-Options: DENY
   ```

3. **X-Content-Type-Options**

   ```
   X-Content-Type-Options: nosniff
   ```

4. **Strict-Transport-Security (HSTS)**

   ```
   Strict-Transport-Security: max-age=31536000; includeSubDomains
   ```

5. **Referrer-Policy**
   ```
   Referrer-Policy: strict-origin-when-cross-origin
   ```

---

## 📝 Checklist sécurité

### Backend (Supabase)

- [x] RLS activé sur toutes les tables
- [x] Policies vérifiant `auth.uid()`
- [x] Foreign keys avec CASCADE approprié
- [x] Pas de service role key exposé côté client

### Frontend

- [ ] Masquer infos sensibles dans les logs
- [ ] Vérifier qu'aucune clé API n'est exposée
- [ ] Headers sécurité configurés (Vercel)
- [ ] CSP configuré

### Déploiement

- [x] Variables d'environnement sécurisées
- [x] HTTPS activé (Vercel)
- [ ] Headers sécurité configurés
- [ ] Pas de secrets dans le code source

---

**Statut** : ✅ **RLS correctement configuré**  
**Prochaine action** : Masquer infos sensibles dans logs et configurer headers Vercel
