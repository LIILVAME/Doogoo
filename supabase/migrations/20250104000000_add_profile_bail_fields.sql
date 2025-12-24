-- ============================================
-- MIGRATION : Ajout des champs nécessaires pour les contrats de bail (Loi Alur)
-- ============================================
-- Cette migration ajoute les colonnes nécessaires dans la table profiles
-- pour générer des contrats de location légaux conformes à la Loi Alur
-- ============================================

DO $$ 
BEGIN
  -- ============================================
  -- 1. IDENTITÉ : Séparation prénom/nom
  -- ============================================
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'first_name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN first_name TEXT;
    
    -- Extrait le prénom depuis full_name si disponible
    UPDATE public.profiles 
    SET first_name = SPLIT_PART(full_name, ' ', 1)
    WHERE first_name IS NULL AND full_name IS NOT NULL AND full_name != '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'last_name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN last_name TEXT;
    
    -- Extrait le nom depuis full_name si disponible (tout sauf le premier mot)
    UPDATE public.profiles 
    SET last_name = SUBSTRING(full_name FROM POSITION(' ' IN full_name) + 1)
    WHERE last_name IS NULL 
      AND full_name IS NOT NULL 
      AND full_name != '' 
      AND POSITION(' ' IN full_name) > 0;
  END IF;

  -- ============================================
  -- 2. ADRESSE : Structuration complète
  -- ============================================
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'address_line'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN address_line TEXT;
    
    -- Copie address vers address_line si address existe mais address_line est null
    UPDATE public.profiles 
    SET address_line = address
    WHERE address_line IS NULL AND address IS NOT NULL AND address != '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'postal_code'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN postal_code TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'city'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN city TEXT;
  END IF;

  -- ============================================
  -- 3. INFORMATIONS JURIDIQUES
  -- ============================================
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'siret'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN siret TEXT;
    
    -- Crée un index pour les recherches par SIRET (optionnel mais utile)
    CREATE INDEX IF NOT EXISTS idx_profiles_siret ON public.profiles(siret) WHERE siret IS NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'rcs'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN rcs TEXT;
  END IF;

  -- ============================================
  -- 4. INFORMATIONS BANCAIRES (pour les loyers)
  -- ============================================
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'iban'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN iban TEXT;
    
    -- Note: IBAN est sensible, mais on n'active pas de chiffrement spécial ici
    -- (Supabase peut gérer le chiffrement au niveau de l'application si nécessaire)
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'bic'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN bic TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'bank_name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN bank_name TEXT;
  END IF;

  -- ============================================
  -- 5. SIGNATURE (URL vers image uploadée)
  -- ============================================
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'signature_url'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN signature_url TEXT;
  END IF;

END $$;

-- ============================================
-- COMMENTAIRES POUR DOCUMENTATION
-- ============================================

COMMENT ON COLUMN public.profiles.first_name IS 'Prénom du bailleur (pour contrats Loi Alur)';
COMMENT ON COLUMN public.profiles.last_name IS 'Nom du bailleur (pour contrats Loi Alur)';
COMMENT ON COLUMN public.profiles.address_line IS 'Ligne d''adresse (numéro et rue)';
COMMENT ON COLUMN public.profiles.postal_code IS 'Code postal';
COMMENT ON COLUMN public.profiles.city IS 'Ville';
COMMENT ON COLUMN public.profiles.siret IS 'Numéro SIRET (optionnel, pour professionnels)';
COMMENT ON COLUMN public.profiles.rcs IS 'Numéro RCS (optionnel, pour professionnels)';
COMMENT ON COLUMN public.profiles.iban IS 'IBAN bancaire (pour encaissement des loyers)';
COMMENT ON COLUMN public.profiles.bic IS 'Code BIC bancaire';
COMMENT ON COLUMN public.profiles.bank_name IS 'Nom de la banque';
COMMENT ON COLUMN public.profiles.signature_url IS 'URL de la signature scannée/tampon (Storage)';

-- ============================================
-- FIN DE LA MIGRATION
-- ============================================