-- ============================================
-- SCHEMA SQL POUR DOOGOO - GESTION LOCATIVE
-- ============================================
-- Ce script crée les tables, les politiques RLS et les triggers
-- pour une application de gestion locative avec Supabase
-- ============================================

-- ============================================
-- 1. TABLE PROFILES
-- ============================================
-- Table publique liée à auth.users pour stocker les informations du profil utilisateur

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  company TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- ============================================
-- 2. TABLE PROPERTIES
-- ============================================
-- Table pour stocker les biens immobiliers

CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  rent NUMERIC(10, 2) NOT NULL CHECK (rent >= 0),
  status TEXT NOT NULL CHECK (status IN ('occupied', 'vacant')),
  surface NUMERIC(10, 2),
  pieces INTEGER,
  description TEXT,
  type TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON public.properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);

-- ============================================
-- 3. TABLE TENANTS
-- ============================================
-- Table pour stocker les locataires
-- Note: Le user_id est nécessaire pour simplifier les politiques RLS

CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  entry_date DATE NOT NULL,
  exit_date DATE,
  rent NUMERIC(10, 2) NOT NULL CHECK (rent >= 0),
  status TEXT NOT NULL CHECK (status IN ('on_time', 'late', 'pending', 'paid')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  -- Contrainte: exit_date doit être postérieure à entry_date
  CONSTRAINT check_exit_after_entry CHECK (exit_date IS NULL OR exit_date >= entry_date)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_tenants_user_id ON public.tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_tenants_property_id ON public.tenants(property_id);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON public.tenants(status);

-- ============================================
-- 4. TABLE PAYMENTS
-- ============================================
-- Table pour stocker les paiements de loyer

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL CHECK (status IN ('paid', 'pending', 'late')),
  due_date DATE,
  date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_property_id ON public.payments(property_id);
CREATE INDEX IF NOT EXISTS idx_payments_tenant_id ON public.payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON public.payments(due_date);

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. POLITIQUES RLS POUR PROFILES
-- ============================================

-- Permet à l'utilisateur de lire son propre profil
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Permet à l'utilisateur de créer son propre profil
CREATE POLICY "Users can create own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Permet à l'utilisateur de modifier son propre profil
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Permet à l'utilisateur de supprimer son propre profil
CREATE POLICY "Users can delete own profile"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 7. POLITIQUES RLS POUR PROPERTIES
-- ============================================

-- Permet à l'utilisateur de lire ses propres propriétés
CREATE POLICY "Users can view own properties"
  ON public.properties
  FOR SELECT
  USING (auth.uid() = user_id);

-- Permet à l'utilisateur de créer ses propres propriétés
CREATE POLICY "Users can create own properties"
  ON public.properties
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Permet à l'utilisateur de modifier ses propres propriétés
CREATE POLICY "Users can update own properties"
  ON public.properties
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Permet à l'utilisateur de supprimer ses propres propriétés
CREATE POLICY "Users can delete own properties"
  ON public.properties
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 8. POLITIQUES RLS POUR TENANTS
-- ============================================

-- Permet à l'utilisateur de lire ses propres locataires
CREATE POLICY "Users can view own tenants"
  ON public.tenants
  FOR SELECT
  USING (auth.uid() = user_id);

-- Permet à l'utilisateur de créer ses propres locataires
CREATE POLICY "Users can create own tenants"
  ON public.tenants
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Permet à l'utilisateur de modifier ses propres locataires
CREATE POLICY "Users can update own tenants"
  ON public.tenants
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Permet à l'utilisateur de supprimer ses propres locataires
CREATE POLICY "Users can delete own tenants"
  ON public.tenants
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 9. POLITIQUES RLS POUR PAYMENTS
-- ============================================

-- Permet à l'utilisateur de lire ses propres paiements
CREATE POLICY "Users can view own payments"
  ON public.payments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Permet à l'utilisateur de créer ses propres paiements
CREATE POLICY "Users can create own payments"
  ON public.payments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Permet à l'utilisateur de modifier ses propres paiements
CREATE POLICY "Users can update own payments"
  ON public.payments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Permet à l'utilisateur de supprimer ses propres paiements
CREATE POLICY "Users can delete own payments"
  ON public.payments
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 10. TRIGGERS POUR UPDATED_AT
-- ============================================
-- Fonction pour mettre à jour automatiquement updated_at

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Applique le trigger sur toutes les tables avec updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_properties
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_tenants
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_payments
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 11. TRIGGER POUR CRÉER AUTOMATIQUEMENT UN PROFIL
-- ============================================
-- Crée automatiquement une entrée dans profiles lorsqu'un nouvel utilisateur s'inscrit

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, full_name, phone)
  VALUES (
    NEW.id,
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger qui se déclenche après l'insertion d'un nouvel utilisateur dans auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FIN DU SCRIPT
-- ============================================
-- Notes importantes:
-- - Toutes les tables utilisent user_id pour RLS, ce qui simplifie la sécurité
-- - Les contraintes CHECK garantissent l'intégrité des données (montants >= 0, statuts valides)
-- - Les index améliorent les performances des requêtes fréquentes
-- - Le trigger handle_new_user() crée automatiquement un profil à l'inscription
-- - Les triggers handle_updated_at() mettent à jour automatiquement updated_at
