-- ============================================
-- MIGRATION : Ajout de la colonne preferences
-- ============================================
-- Cette migration ajoute une colonne JSONB pour stocker
-- les préférences utilisateur (notifications, thème, etc.)
-- ============================================

-- Ajout de la colonne preferences (JSONB) si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'preferences'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN preferences JSONB DEFAULT '{}'::jsonb;
    
    -- Crée un index GIN pour améliorer les performances des requêtes JSONB
    CREATE INDEX IF NOT EXISTS idx_profiles_preferences 
    ON public.profiles USING GIN (preferences);
    
    -- Commentaire pour documentation
    COMMENT ON COLUMN public.profiles.preferences IS 
    'Préférences utilisateur stockées en JSONB (notifications, thème, devise, langue, etc.)';
  END IF;
END $$;

-- ============================================
-- FIN DE LA MIGRATION
-- ============================================
