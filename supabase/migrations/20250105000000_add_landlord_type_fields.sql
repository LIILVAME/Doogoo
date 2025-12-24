-- ============================================
-- MIGRATION : Ajout des champs type de bailleur pour contrats Alur
-- ============================================
-- Cette migration ajoute les colonnes nécessaires pour distinguer
-- un bailleur particulier d'une société dans les contrats de bail
-- ============================================

DO $$ 
BEGIN
  -- ============================================
  -- 1. TYPE DE BAILLEUR (Particulier ou Société)
  -- ============================================
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'landlord_type'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN landlord_type TEXT;
    
    -- Migre les données existantes : Si company renseigné, type = 'company', sinon 'individual'
    UPDATE public.profiles 
    SET landlord_type = CASE 
      WHEN company IS NOT NULL AND company != '' AND company != 'null' THEN 'company'
      ELSE 'individual'
    END
    WHERE landlord_type IS NULL;
    
    -- Ajoute la contrainte CHECK après migration des données
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_landlord_type_check 
    CHECK (landlord_type IS NULL OR landlord_type IN ('individual', 'company'));
    
    -- Valeur par défaut pour les nouveaux profils
    ALTER TABLE public.profiles 
    ALTER COLUMN landlord_type SET DEFAULT 'individual';
  END IF;

  -- ============================================
  -- 2. CAPITAL SOCIAL (pour les sociétés)
  -- ============================================
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'capital_social'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN capital_social TEXT;
  END IF;

  -- ============================================
  -- 3. FORME JURIDIQUE (optionnel, pour précision)
  -- ============================================
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'legal_form'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN legal_form TEXT;
  END IF;

END $$;

-- ============================================
-- COMMENTAIRES POUR DOCUMENTATION
-- ============================================

COMMENT ON COLUMN public.profiles.landlord_type IS 'Type de bailleur: "individual" (particulier) ou "company" (société)';
COMMENT ON COLUMN public.profiles.capital_social IS 'Capital social de la société (ex: "10 000 €")';
COMMENT ON COLUMN public.profiles.legal_form IS 'Forme juridique (ex: "SCI", "SARL", "SAS", "SA")';

-- ============================================
-- FIN DE LA MIGRATION
-- ============================================
