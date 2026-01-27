# Multi-Currency Migration

## Overview

This migration adds multi-currency support to the Doogoo platform, enabling:

- Per-property currency assignment (EUR, USD, GBP, XOF)
- Historical exchange rate tracking for accurate portfolio aggregation
- Backward compatibility with existing data (defaults to EUR)

## Files

- `20260127000000_add_multi_currency_support.sql` - Main migration

## Changes

### 1. Properties Table

- **Added**: `currency VARCHAR(3)` column with CHECK constraint
- **Default**: EUR for all existing properties
- **Index**: `idx_properties_currency` for filtering

### 2. Exchange Rates Table (NEW)

- **Purpose**: Store monthly historical FX rates
- **Columns**:
  - `base_currency`, `target_currency` (VARCHAR(3))
  - `rate` (NUMERIC(12,6)) - High precision for FX rates
  - `month_year` (DATE) - First day of month
- **Constraints**:
  - Unique per currency pair per month
  - Prevents same-currency conversions (EUR->EUR)
- **RLS**: Read-only for users, write-only via Edge Functions

### 3. Seed Data

- Current exchange rates for January 2026 (approximate)
- Will be updated monthly by Edge Function

## Testing

### Verify Migration

```sql
-- Check currency column
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'properties' AND column_name = 'currency';

-- Check exchange_rates table
SELECT * FROM public.exchange_rates ORDER BY base_currency, target_currency;

-- Check existing properties
SELECT currency, COUNT(*) as count
FROM public.properties
GROUP BY currency;
```

### Expected Results

- All existing properties should have `currency = 'EUR'`
- `exchange_rates` table should have 12 rows (4 currencies × 3 conversions each)

## Rollback

```sql
DROP TABLE IF EXISTS public.exchange_rates CASCADE;
ALTER TABLE public.properties DROP COLUMN IF EXISTS currency;
DROP INDEX IF EXISTS idx_properties_currency;
```

## Next Steps

1. Deploy migration to staging
2. Verify data integrity
3. Create Edge Function for FX rate updates (Phase 2)
4. Update TypeScript types and API services (Phase 3)
