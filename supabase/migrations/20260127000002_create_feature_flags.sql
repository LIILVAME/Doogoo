-- ============================================
-- MIGRATION: FEATURE FLAGS SYSTEM
-- ============================================
-- This migration creates a feature flags table for gradual rollout
-- and A/B testing of new features
-- ============================================

-- Create feature_flags table
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_name VARCHAR(100) NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT false,
  rollout_percentage INTEGER NOT NULL DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  allowed_users TEXT[] DEFAULT '{}',
  allowed_organizations TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_feature_flags_name ON public.feature_flags(flag_name);
CREATE INDEX idx_feature_flags_enabled ON public.feature_flags(enabled);

-- Add RLS policies
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Everyone can read feature flags
CREATE POLICY "Feature flags are readable by everyone"
  ON public.feature_flags
  FOR SELECT
  USING (true);

-- Only service role can modify feature flags
CREATE POLICY "Feature flags are modifiable by service role only"
  ON public.feature_flags
  FOR ALL
  USING (auth.role() = 'service_role');

-- Insert initial feature flags
INSERT INTO public.feature_flags (flag_name, enabled, rollout_percentage, metadata) VALUES
  ('multi_currency', false, 0, '{"description": "Multi-currency support for properties", "owner": "engineering", "jira_ticket": "DOOGOO-123"}'),
  ('advanced_analytics', false, 0, '{"description": "Advanced analytics dashboard", "owner": "product"}'),
  ('ai_insights', false, 0, '{"description": "AI-powered property insights", "owner": "data_science"}')
ON CONFLICT (flag_name) DO NOTHING;

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_feature_flag_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_feature_flags_timestamp
  BEFORE UPDATE ON public.feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION update_feature_flag_timestamp();

-- Add comment
COMMENT ON TABLE public.feature_flags IS 
'Feature flags for gradual rollout and A/B testing. Managed via admin dashboard or API.';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- View all feature flags
-- SELECT * FROM public.feature_flags ORDER BY created_at DESC;

-- Check multi-currency flag
-- SELECT * FROM public.feature_flags WHERE flag_name = 'multi_currency';

-- ============================================
-- ROLLBACK INSTRUCTIONS
-- ============================================

-- To remove feature flags:
-- DROP TABLE IF EXISTS public.feature_flags CASCADE;
-- DROP FUNCTION IF EXISTS update_feature_flag_timestamp() CASCADE;

-- ============================================
-- END OF MIGRATION
-- ============================================
