-- ============================================
-- MIGRATION : Contrainte d'unicité pour l'automatisation des paiements
-- ============================================
-- Évite de générer deux fois le loyer du même mois pour le même locataire
-- ============================================

-- 1️⃣ Ajout d'une colonne `period` (format 'YYYY-MM') pour identifier la période mensuelle
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS period TEXT;

-- 2️⃣ Remplissage de la colonne `period` pour les données existantes
-- Utilise due_date si disponible, sinon date
UPDATE public.payments
SET period = TO_CHAR(COALESCE(due_date, date), 'YYYY-MM')
WHERE period IS NULL 
  AND (due_date IS NOT NULL OR date IS NOT NULL);

-- 3️⃣ Création d'un index unique partiel pour éviter les doublons
-- L'index ignore les lignes où tenant_id est NULL (paiements manuels sans locataire)
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_unique_monthly_rent 
ON public.payments (tenant_id, property_id, period)
WHERE tenant_id IS NOT NULL 
  AND property_id IS NOT NULL
  AND period IS NOT NULL;

-- 4️⃣ Création d'un trigger pour remplir automatiquement `period` lors des INSERT/UPDATE
CREATE OR REPLACE FUNCTION public.set_payment_period()
RETURNS TRIGGER AS $$
BEGIN
  -- Remplit period à partir de due_date ou date
  IF NEW.due_date IS NOT NULL THEN
    NEW.period := TO_CHAR(NEW.due_date, 'YYYY-MM');
  ELSIF NEW.date IS NOT NULL THEN
    NEW.period := TO_CHAR(NEW.date, 'YYYY-MM');
  ELSE
    NEW.period := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Supprime le trigger s'il existe déjà
DROP TRIGGER IF EXISTS trigger_set_payment_period ON public.payments;

-- Crée le trigger
CREATE TRIGGER trigger_set_payment_period
  BEFORE INSERT OR UPDATE OF due_date, date ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.set_payment_period();

-- 5️⃣ Commentaire pour documentation
COMMENT ON COLUMN public.payments.period IS 
'Période mensuelle au format YYYY-MM, utilisée pour éviter les doublons lors de la génération automatique des loyers. 
Remplie automatiquement à partir de due_date ou date.';

COMMENT ON INDEX idx_payments_unique_monthly_rent IS 
'Contrainte d''unicité pour éviter les doublons lors de la génération automatique des loyers mensuels. 
Garantit qu''un locataire ne peut avoir qu''un seul paiement par mois pour un bien donné.';

-- 6️⃣ Vérification des index existants (status et due_date sont déjà indexés)
-- Les index suivants existent déjà :
-- - idx_payments_status (sur status) ✅
-- - idx_payments_due_date (sur due_date) ✅
-- Aucune action supplémentaire nécessaire pour ces index.

-- ============================================
-- FIN DE LA MIGRATION
-- ============================================
