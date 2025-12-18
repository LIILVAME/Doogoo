-- ============================================
-- MIGRATION : Ajout des colonnes manquantes
-- ============================================
-- Cette migration complète le schéma existant avec les colonnes
-- nécessaires pour correspondre au frontend TypeScript
-- ============================================

-- ============================================
-- 1. PROPERTIES : Ajout description, type, image
-- ============================================
-- Les colonnes surface_m2 et rooms existent déjà, on les garde
-- On ajoute les colonnes manquantes pour le frontend

DO $$ 
BEGIN
  -- Ajout de description si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'properties' 
    AND column_name = 'description'
  ) THEN
    ALTER TABLE public.properties ADD COLUMN description TEXT;
  END IF;

  -- Ajout de type si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'properties' 
    AND column_name = 'type'
  ) THEN
    ALTER TABLE public.properties ADD COLUMN type TEXT;
  END IF;

  -- Ajout de image si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'properties' 
    AND column_name = 'image'
  ) THEN
    ALTER TABLE public.properties ADD COLUMN image TEXT;
  END IF;
END $$;

-- ============================================
-- 2. TENANTS : Ajout user_id et email (CRITIQUE pour RLS)
-- ============================================

DO $$ 
BEGIN
  -- Ajout de user_id si elle n'existe pas (nécessaire pour RLS)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tenants' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.tenants ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    
    -- Popule user_id depuis properties pour les données existantes
    UPDATE public.tenants t
    SET user_id = p.user_id
    FROM public.properties p
    WHERE t.property_id = p.id AND t.user_id IS NULL;
    
    -- Rend user_id NOT NULL après avoir peuplé les données existantes
    ALTER TABLE public.tenants ALTER COLUMN user_id SET NOT NULL;
    
    -- Crée un index pour améliorer les performances RLS
    CREATE INDEX IF NOT EXISTS idx_tenants_user_id ON public.tenants(user_id);
  END IF;

  -- Ajout de email si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tenants' 
    AND column_name = 'email'
  ) THEN
    ALTER TABLE public.tenants ADD COLUMN email TEXT;
  END IF;
END $$;

-- ============================================
-- 3. PAYMENTS : Ajout due_date
-- ============================================

DO $$ 
BEGIN
  -- Ajout de due_date si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'payments' 
    AND column_name = 'due_date'
  ) THEN
    ALTER TABLE public.payments ADD COLUMN due_date DATE;
    
    -- Pour les données existantes, on peut copier date vers due_date
    UPDATE public.payments 
    SET due_date = date 
    WHERE due_date IS NULL AND date IS NOT NULL;
    
    -- Crée un index pour améliorer les performances des requêtes
    CREATE INDEX IF NOT EXISTS idx_payments_due_date ON public.payments(due_date);
  END IF;
END $$;

-- ============================================
-- 4. Mise à jour de la contrainte CHECK pour tenants.status
-- ============================================
-- Le schéma actuel n'a que 'on_time' et 'late', on ajoute 'pending' et 'paid'

DO $$
BEGIN
  -- Supprime l'ancienne contrainte si elle existe
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname LIKE '%tenants_status%' 
    AND conrelid = 'public.tenants'::regclass
  ) THEN
    ALTER TABLE public.tenants DROP CONSTRAINT IF EXISTS tenants_status_check;
  END IF;
  
  -- Ajoute la nouvelle contrainte avec tous les statuts
  ALTER TABLE public.tenants 
  ADD CONSTRAINT tenants_status_check 
  CHECK (status IN ('on_time', 'late', 'pending', 'paid'));
END $$;

-- ============================================
-- 5. Ajout de la contrainte check_exit_after_entry pour tenants
-- ============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'check_exit_after_entry' 
    AND conrelid = 'public.tenants'::regclass
  ) THEN
    ALTER TABLE public.tenants 
    ADD CONSTRAINT check_exit_after_entry 
    CHECK (exit_date IS NULL OR exit_date >= entry_date);
  END IF;
END $$;

-- ============================================
-- 6. Mise à jour de la contrainte CHECK pour payments.amount
-- ============================================
-- Le schéma actuel a amount >= 0, on veut amount > 0

DO $$
BEGIN
  -- Supprime l'ancienne contrainte si elle existe
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname LIKE '%payments_amount%' 
    AND conrelid = 'public.payments'::regclass
  ) THEN
    ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_amount_check;
  END IF;
  
  -- Ajoute la nouvelle contrainte avec amount > 0
  ALTER TABLE public.payments 
  ADD CONSTRAINT payments_amount_positive 
  CHECK (amount > 0);
END $$;

-- ============================================
-- 7. Vérification et création des index manquants
-- ============================================

CREATE INDEX IF NOT EXISTS idx_properties_user_id ON public.properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_tenants_property_id ON public.tenants(property_id);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON public.tenants(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_property_id ON public.payments(property_id);
CREATE INDEX IF NOT EXISTS idx_payments_tenant_id ON public.payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- ============================================
-- FIN DE LA MIGRATION
-- ============================================
