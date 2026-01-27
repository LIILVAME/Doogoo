-- ============================================
-- MIGRATION: SETUP CRON JOB FOR FX RATES
-- ============================================
-- This migration sets up a monthly cron job to automatically
-- fetch exchange rates via the Edge Function
-- ============================================

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule monthly FX rate updates
-- Runs on the 1st of every month at 2:00 AM UTC
SELECT cron.schedule(
  'fetch-monthly-fx-rates',
  '0 2 1 * *', -- Cron expression: minute hour day month weekday
  $$
  SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/fetch-fx-rates',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- Add comment for documentation
COMMENT ON EXTENSION pg_cron IS 
'Cron-based job scheduler for PostgreSQL. Used to automatically fetch monthly exchange rates.';

-- ============================================
-- VERIFICATION
-- ============================================

-- View scheduled cron jobs
-- SELECT * FROM cron.job WHERE jobname = 'fetch-monthly-fx-rates';

-- View cron job run history
-- SELECT * FROM cron.job_run_details 
-- WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'fetch-monthly-fx-rates')
-- ORDER BY start_time DESC 
-- LIMIT 10;

-- ============================================
-- ROLLBACK INSTRUCTIONS
-- ============================================

-- To remove the cron job:
-- SELECT cron.unschedule('fetch-monthly-fx-rates');

-- ============================================
-- NOTES
-- ============================================

-- The cron job requires the following settings to be configured:
-- 1. app.settings.supabase_url - Your Supabase project URL
-- 2. app.settings.service_role_key - Service role key for authentication

-- To set these values:
-- ALTER DATABASE postgres SET app.settings.supabase_url = 'https://your-project.supabase.co';
-- ALTER DATABASE postgres SET app.settings.service_role_key = 'your-service-role-key';

-- Alternatively, you can hardcode the URL in the cron job SQL above
-- (not recommended for security reasons)

-- ============================================
-- END OF MIGRATION
-- ============================================
