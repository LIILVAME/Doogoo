# Fetch FX Rates Edge Function

## Overview

This Supabase Edge Function fetches monthly historical exchange rates from the Open Exchange Rates API and stores them in the `exchange_rates` table.

## Features

- Fetches rates from Open Exchange Rates API (USD as base)
- Calculates cross rates for all currency pairs (EUR, USD, GBP, XOF)
- Upserts rates into database (prevents duplicates)
- Supports manual invocation for backfilling historical data
- Designed to run monthly via cron job

## Environment Variables

Set these in your Supabase project settings:

```bash
OPENEXCHANGERATES_API_KEY=your_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Usage

### Manual Invocation (for testing or backfilling)

```bash
# Fetch rates for last month (default)
curl -X POST https://your-project.supabase.co/functions/v1/fetch-fx-rates \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Fetch rates for specific month
curl -X POST https://your-project.supabase.co/functions/v1/fetch-fx-rates \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"month": "2024-01-01"}'
```

### Automated Cron Job

The function is scheduled to run monthly on the 1st at 2 AM via pg_cron:

```sql
SELECT cron.schedule(
  'fetch-monthly-fx-rates',
  '0 2 1 * *', -- At 02:00 on day-of-month 1
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/fetch-fx-rates',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);
```

## Response Format

### Success

```json
{
  "success": true,
  "month": "2024-01-01",
  "records_count": 12,
  "message": "Exchange rates for 2024-01-01 updated successfully"
}
```

### Error

```json
{
  "error": "API request failed: 401 Unauthorized"
}
```

## Deployment

```bash
# Deploy the function
supabase functions deploy fetch-fx-rates

# Set environment variables
supabase secrets set OPENEXCHANGERATES_API_KEY=your_key_here
```

## Testing

```bash
# Test locally with Supabase CLI
supabase functions serve fetch-fx-rates

# Invoke locally
curl -X POST http://localhost:54321/functions/v1/fetch-fx-rates \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## Backfilling Historical Data

To populate rates for the last 12 months:

```bash
# Bash script to backfill
for i in {1..12}; do
  month=$(date -d "$i months ago" +%Y-%m-01)
  curl -X POST https://your-project.supabase.co/functions/v1/fetch-fx-rates \
    -H "Authorization: Bearer YOUR_ANON_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"month\": \"$month\"}"
  sleep 2 # Rate limiting
done
```

## Rate Limits

Open Exchange Rates free tier:

- 1,000 requests/month
- Historical data requires paid plan ($12/month)

## Monitoring

Check function logs in Supabase Dashboard:

- Navigate to Edge Functions → fetch-fx-rates → Logs
- Monitor for API errors or database issues
