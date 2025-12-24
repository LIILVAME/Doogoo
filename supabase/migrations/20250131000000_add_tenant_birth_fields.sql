-- Migration: Ajout des champs de naissance pour les locataires (Date et Lieu)
-- Date: 2025-01-31
-- Description: Ajoute birth_date et birth_place à la table tenants pour conformité Loi Alur

-- Ajoute la colonne birth_date (date de naissance)
ALTER TABLE public.tenants
ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Ajoute la colonne birth_place (lieu de naissance)
ALTER TABLE public.tenants
ADD COLUMN IF NOT EXISTS birth_place TEXT;

-- Commentaires pour documentation
COMMENT ON COLUMN public.tenants.birth_date IS 'Date de naissance du locataire (obligatoire pour conformité Loi Alur)';
COMMENT ON COLUMN public.tenants.birth_place IS 'Lieu de naissance du locataire (obligatoire pour conformité Loi Alur)';
