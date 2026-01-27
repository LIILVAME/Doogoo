-- ============================================
-- MIGRATION: ADD MULTI-CURRENCY SUPPORT
-- ============================================
-- This migration adds currency support to properties and creates
-- an exchange_rates table for historical FX rate tracking
-- ============================================

-- ============================================
-- STEP 1: ADD CURRENCY COLUMN TO PROPERTIES
-- ============================================

-- Add currency column with default EUR for backward compatibility
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'EUR' NOT NULL
CHECK (currency IN ('EUR', 'USD', 'GBP', 'XOF'));

-- Create index for currency filtering
CREATE INDEX IF NOT EXISTS idx_properties_currency ON public.properties(currency);

-- Add comment for documentation
COMMENT ON COLUMN public.properties.currency IS 
'ISO 4217 currency code for this property. Determines the currency for rent and all related payments. Supported: EUR, USD, GBP, XOF.';

-- ============================================
-- STEP 2: CREATE EXCHANGE RATES TABLE
-- ============================================

-- Create table for storing monthly historical exchange rates
CREATE TABLE IF NOT EXISTS public.exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency VARCHAR(3) NOT NULL CHECK (base_currency IN ('EUR', 'USD', 'GBP', 'XOF')),
  target_currency VARCHAR(3) NOT NULL CHECK (target_currency IN ('EUR', 'USD', 'GBP', 'XOF')),
  rate NUMERIC(12, 6) NOT NULL CHECK (rate > 0),
  month_year DATE NOT NULL, -- First day of the month (e.g., 2024-01-01)
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Unique constraint: one rate per currency pair per month
  CONSTRAINT unique_fx_rate_per_month UNIQUE (base_currency, target_currency, month_year),
  
  -- Prevent same currency conversions (EUR->EUR should not exist)
  CONSTRAINT different_currencies CHECK (base_currency != target_currency)
);

-- Add table comment
COMMENT ON TABLE public.exchange_rates IS 
'Historical monthly exchange rates for multi-currency support. Rates are stored as base_currency -> target_currency conversions.';

-- ============================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Index for fast lookups by month (most recent first)
CREATE INDEX IF NOT EXISTS idx_exchange_rates_month ON public.exchange_rates(month_year DESC);

-- Index for fast lookups by currency pair
CREATE INDEX IF NOT EXISTS idx_exchange_rates_pair ON public.exchange_rates(base_currency, target_currency);

-- Composite index for the most common query pattern
CREATE INDEX IF NOT EXISTS idx_exchange_rates_lookup 
ON public.exchange_rates(base_currency, target_currency, month_year DESC);

-- ============================================
-- STEP 4: ENABLE ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on exchange_rates table
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can read FX rates
CREATE POLICY "All users can view exchange rates"
  ON public.exchange_rates
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Policy: Only system/service role can insert/update rates
-- (This will be handled via Edge Functions with service role key)
CREATE POLICY "Only system can insert exchange rates"
  ON public.exchange_rates
  FOR INSERT
  WITH CHECK (false); -- Deny all direct inserts from users

CREATE POLICY "Only system can update exchange rates"
  ON public.exchange_rates
  FOR UPDATE
  USING (false) -- Deny all direct updates from users
  WITH CHECK (false);

CREATE POLICY "Only system can delete exchange rates"
  ON public.exchange_rates
  FOR DELETE
  USING (false); -- Deny all direct deletes from users

-- ============================================
-- STEP 5: ADD UPDATED_AT TRIGGER
-- ============================================

-- Apply the existing updated_at trigger to exchange_rates
CREATE TRIGGER set_updated_at_exchange_rates
  BEFORE UPDATE ON public.exchange_rates
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- STEP 6: MIGRATE EXISTING DATA
-- ============================================

-- Set currency for existing properties based on user's preferences
-- If user has a currency preference in their profile, use it
-- Otherwise, default to EUR
UPDATE public.properties
SET currency = COALESCE(
  (
    SELECT preferences->>'currency' 
    FROM public.profiles 
    WHERE profiles.user_id = properties.user_id
  ),
  'EUR'
)
WHERE currency = 'EUR'; -- Only update properties that still have the default

-- ============================================
-- STEP 7: INSERT SEED DATA (CURRENT RATES)
-- ============================================

-- Insert current exchange rates as baseline (as of January 2026)
-- These will be updated monthly by the Edge Function
-- Rates are approximate and should be replaced by real API data

INSERT INTO public.exchange_rates (base_currency, target_currency, rate, month_year)
VALUES
  -- USD as base
  ('USD', 'EUR', 0.92, '2026-01-01'),
  ('USD', 'GBP', 0.79, '2026-01-01'),
  ('USD', 'XOF', 605.50, '2026-01-01'),
  
  -- EUR as base
  ('EUR', 'USD', 1.09, '2026-01-01'),
  ('EUR', 'GBP', 0.86, '2026-01-01'),
  ('EUR', 'XOF', 655.96, '2026-01-01'),
  
  -- GBP as base
  ('GBP', 'USD', 1.27, '2026-01-01'),
  ('GBP', 'EUR', 1.16, '2026-01-01'),
  ('GBP', 'XOF', 766.98, '2026-01-01'),
  
  -- XOF as base
  ('XOF', 'USD', 0.00165, '2026-01-01'),
  ('XOF', 'EUR', 0.00152, '2026-01-01'),
  ('XOF', 'GBP', 0.00130, '2026-01-01')
ON CONFLICT (base_currency, target_currency, month_year) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES (FOR TESTING)
-- ============================================

-- Verify currency column was added
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'properties' AND column_name = 'currency';

-- Verify exchange_rates table structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'exchange_rates' 
-- ORDER BY ordinal_position;

-- Verify seed data
-- SELECT base_currency, target_currency, rate, month_year 
-- FROM public.exchange_rates 
-- ORDER BY base_currency, target_currency;

-- Check existing properties currency distribution
-- SELECT currency, COUNT(*) as count 
-- FROM public.properties 
-- GROUP BY currency;

-- ============================================
-- ROLLBACK INSTRUCTIONS (IF NEEDED)
-- ============================================

-- To rollback this migration:
-- DROP TABLE IF EXISTS public.exchange_rates CASCADE;
-- ALTER TABLE public.properties DROP COLUMN IF EXISTS currency;
-- DROP INDEX IF EXISTS idx_properties_currency;

-- ============================================
-- END OF MIGRATION
-- ============================================
