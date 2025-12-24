-- ============================================
-- MIGRATION : Configuration du Cron Job pour génération automatique des loyers
-- ============================================
-- Configure pg_cron pour exécuter generate-monthly-rents chaque 1er du mois
-- ============================================
-- NOTE: Cette migration nécessite que l'extension pg_cron soit activée
-- et que l'Edge Function generate-monthly-rents soit déployée
-- ============================================

-- Vérifie que pg_cron est disponible
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
  ) THEN
    RAISE WARNING 'Extension pg_cron non trouvée. Activez-la d''abord via: CREATE EXTENSION IF NOT EXISTS pg_cron;';
  END IF;
END $$;

-- Supprime le cron job s'il existe déjà (pour permettre la réexécution)
SELECT cron.unschedule('generate-monthly-rents') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'generate-monthly-rents'
);

-- Crée le cron job pour exécuter la fonction chaque 1er du mois à 00:00 UTC
-- Format cron: minute hour day month day_of_week
-- '0 0 1 * *' = 1er de chaque mois à 00:00 UTC
SELECT cron.schedule(
  'generate-monthly-rents',           -- Nom du job
  '0 0 1 * *',                        -- Schedule: 1er de chaque mois à 00:00 UTC
  $$
  SELECT
    net.http_post(
      url := current_setting('app.settings.supabase_url') || '/functions/v1/generate-monthly-rents',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := '{}'::jsonb
    ) AS request_id;
  $$
);

-- Alternative si les settings ne sont pas configurés :
-- Remplacez YOUR_PROJECT_REF et utilisez directement l'URL
-- SELECT cron.schedule(
--   'generate-monthly-rents',
--   '0 0 1 * *',
--   $$
--   SELECT
--     net.http_post(
--       url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/generate-monthly-rents',
--       headers := jsonb_build_object(
--         'Content-Type', 'application/json',
--         'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
--       ),
--       body := '{}'::jsonb
--     ) AS request_id;
--   $$
-- );

-- Commentaire pour documentation
COMMENT ON EXTENSION pg_cron IS 
'Extension PostgreSQL pour planifier des tâches récurrentes. 
Utilisée pour exécuter automatiquement generate-monthly-rents chaque 1er du mois.';

-- ============================================
-- FIN DE LA MIGRATION
-- ============================================
-- Pour vérifier que le cron job est actif :
-- SELECT * FROM cron.job WHERE jobname = 'generate-monthly-rents';
-- 
-- Pour voir l'historique d'exécution :
-- SELECT * FROM cron.job_run_details WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'generate-monthly-rents');
-- ============================================
