# 📅 Configuration du Cron Job pour la génération automatique des loyers

## 🎯 Objectif

Exécuter automatiquement la fonction `generate-monthly-rents` chaque 1er du mois à 00:00 UTC pour générer les paiements mensuels de tous les locataires actifs.

## 📋 Prérequis

- ✅ Edge Function `generate-monthly-rents` déployée
- ✅ Contrainte d'unicité `idx_payments_unique_monthly_rent` active
- ✅ Trigger `trigger_set_payment_period` fonctionnel
- ✅ Accès à Supabase Dashboard ou CLI

## 🚀 Déploiement de l'Edge Function

### Option 1 : Via Supabase CLI (Recommandé)

```bash
# 1. Se connecter à votre projet Supabase (si pas déjà fait)
supabase link --project-ref YOUR_PROJECT_REF

# 2. Déployer la fonction
supabase functions deploy generate-monthly-rents

# 3. Vérifier le déploiement
supabase functions list

# 4. Tester la fonction manuellement
supabase functions invoke generate-monthly-rents \
  --method POST \
  --headers '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'
```

**Note** : Remplacez `YOUR_PROJECT_REF` par votre référence de projet (visible dans l'URL Supabase Dashboard).

### Option 2 : Via Supabase Dashboard

1. Aller dans **Edge Functions** > **Create a new function**
2. Nom : `generate-monthly-rents`
3. Copier le contenu de `supabase/functions/generate-monthly-rents/index.ts`
4. Cliquer sur **Deploy**
5. Vérifier que la fonction apparaît dans la liste

## ⏰ Configuration du Cron Job

### Prérequis

1. **Activer l'extension pg_cron** (si pas déjà fait) :
   ```sql
   CREATE EXTENSION IF NOT EXISTS pg_cron;
   ```

2. **Activer l'extension pg_net** (pour les requêtes HTTP) :
   ```sql
   CREATE EXTENSION IF NOT EXISTS pg_net;
   ```

### Option 1 : Via Migration SQL (Recommandé)

La migration `20250201000001_setup_cron_job_monthly_rents.sql` configure automatiquement le cron job.

```bash
# Appliquer la migration
supabase db push

# Ou via Dashboard : Database > Migrations > Run migration
```

### Option 2 : Via Supabase Dashboard

1. Aller dans **Database** > **Cron Jobs**
2. Cliquer sur **Create a new cron job**
3. Configuration :
   - **Name** : `generate_monthly_rents`
   - **Schedule** : `0 0 1 * *` (1er de chaque mois à 00:00 UTC)
   - **Function** : `generate-monthly-rents`
   - **Method** : `POST`
   - **Headers** : 
     ```json
     {
       "Content-Type": "application/json",
       "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"
     }
     ```

### Option 3 : Via SQL manuel

```sql
-- 1. Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Créer le cron job
SELECT cron.schedule(
  'generate-monthly-rents',           -- Nom du job
  '0 0 1 * *',                        -- Schedule: 1er de chaque mois à 00:00 UTC
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/generate-monthly-rents',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
      ),
      body := '{}'::jsonb
    ) AS request_id;
  $$
);
```

**Note** : 
- Remplacez `YOUR_PROJECT_REF` par votre référence de projet Supabase
- Remplacez `YOUR_SERVICE_ROLE_KEY` par votre Service Role Key (visible dans Settings > API)

## 📊 Format du Schedule (Cron)

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *
```

**Exemples** :
- `0 0 1 * *` : 1er de chaque mois à 00:00 UTC
- `0 2 1 * *` : 1er de chaque mois à 02:00 UTC
- `0 0 1,15 * *` : 1er et 15 de chaque mois à 00:00 UTC

## 🔍 Vérification

### Tester manuellement la fonction

```bash
# Via Supabase CLI
supabase functions invoke generate-monthly-rents

# Via curl
curl -X POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/generate-monthly-rents' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json'
```

### Vérifier les logs

```bash
# Via Supabase CLI
supabase functions logs generate-monthly-rents

# Via Dashboard
# Edge Functions > generate-monthly-rents > Logs
```

### Vérifier les paiements générés

```sql
-- Voir les paiements générés ce mois
SELECT 
  p.id,
  p.period,
  p.amount,
  p.status,
  p.due_date,
  t.name as tenant_name,
  pr.name as property_name,
  p.created_at
FROM payments p
JOIN tenants t ON p.tenant_id = t.id
JOIN properties pr ON p.property_id = pr.id
WHERE p.period = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
  AND p.status = 'pending'
ORDER BY p.created_at DESC;
```

### Vérifier le cron job

```sql
-- Voir tous les cron jobs actifs
SELECT 
  jobid,
  jobname,
  schedule,
  active,
  command
FROM cron.job
WHERE jobname = 'generate-monthly-rents';

-- Voir l'historique d'exécution
SELECT 
  jobid,
  runid,
  job_pid,
  database,
  username,
  command,
  status,
  return_message,
  start_time,
  end_time
FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'generate-monthly-rents')
ORDER BY start_time DESC
LIMIT 10;
```

## 🛡️ Sécurité

### Protection contre les doublons

La fonction utilise plusieurs mécanismes pour éviter les doublons :

1. **Vérification préalable** : Vérifie l'existence d'un paiement avec `period` avant insertion
2. **Contrainte d'unicité** : Index unique `idx_payments_unique_monthly_rent` sur `(tenant_id, property_id, period)`
3. **Gestion d'erreur** : Capture l'erreur `23505` (violation de contrainte unique) et la traite comme un skip

### Service Role Key

⚠️ **Important** : La fonction utilise `SUPABASE_SERVICE_ROLE_KEY` pour avoir accès à tous les utilisateurs. Cette clé doit rester secrète et ne jamais être exposée côté client.

## 📈 Monitoring

### Métriques à surveiller

- Nombre de paiements générés par mois
- Nombre d'erreurs
- Temps d'exécution
- Utilisateurs traités

### Alertes recommandées

- Erreur lors de l'exécution du cron
- Aucun paiement généré alors qu'il devrait y en avoir
- Taux d'erreur > 5%

## 🔧 Dépannage

### La fonction ne s'exécute pas

1. Vérifier que le cron job est actif dans le Dashboard
2. Vérifier les logs pour voir les erreurs
3. Tester manuellement la fonction

### Des doublons sont créés

1. Vérifier que la contrainte d'unicité existe : `\d payments` dans psql
2. Vérifier que le trigger `trigger_set_payment_period` fonctionne
3. Vérifier que la colonne `period` est bien remplie

### Erreur "permission denied"

1. Vérifier que la fonction utilise `SUPABASE_SERVICE_ROLE_KEY`
2. Vérifier les politiques RLS (elles ne s'appliquent pas avec service role)

## 📝 Notes

- La fonction traite **tous les utilisateurs** du système
- Les paiements sont créés avec le statut `'pending'`
- La `due_date` est toujours le 1er du mois en cours
- La colonne `period` est remplie automatiquement par le trigger

---

**Date de création** : 1er février 2025  
**Version** : v0.2.1
