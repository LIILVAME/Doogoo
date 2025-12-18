import { computed, type ComputedRef } from 'vue'
import { usePropertiesStore } from '@/stores/propertiesStore'
import { usePaymentsStore } from '@/stores/paymentsStore'
import { useTenantsStore } from '@/stores/tenantsStore'
import { TRANSACTION_STATUS } from '@/utils/constants'
import type { PaymentData } from '@/stores/paymentsStore'
import type { PropertyData } from '@/stores/propertiesStore'
import type { TenantData } from '@/stores/tenantsStore'

/**
 * Interface pour les métriques financières
 */
export interface FinancialMetrics {
  totalRevenue: number // Revenu total du mois courant (paiements 'paid')
  pendingRevenue: number // Revenu en attente (paiements 'pending' + 'late')
  totalPendingAmount: number // Total des montants en attente
}

/**
 * Interface pour les métriques immobilières
 */
export interface PropertyMetrics {
  occupancyRate: number // Taux d'occupation en pourcentage (0-100)
  vacantProperties: PropertyData[] // Liste des biens vacants
  vacantPropertiesCount: number // Nombre de biens vacants
}

/**
 * Interface pour les alertes
 */
export interface DashboardAlerts {
  latePayments: PaymentData[] // Liste des paiements en retard
  latePaymentsCount: number // Nombre de paiements en retard
  expiringLeases: TenantData[] // Locataires dont le bail expire dans < 30 jours
  expiringLeasesCount: number // Nombre de baux expirant
  hasAlerts: boolean // Indique s'il y a des alertes
}

/**
 * Interface complète des métriques du Dashboard
 */
export interface DashboardMetrics {
  financial: FinancialMetrics
  property: PropertyMetrics
  alerts: DashboardAlerts
}

/**
 * Composable pour calculer les métriques du Dashboard en temps réel
 *
 * Utilise les stores Pinia (propertiesStore, paymentsStore, tenantsStore)
 * pour calculer des KPIs réactifs via des computed properties.
 *
 * @returns {DashboardMetrics} Objet contenant toutes les métriques calculées
 *
 * @example
 * const metrics = useDashboardMetrics()
 * // metrics.financial.totalRevenue : revenu du mois courant
 * // metrics.property.occupancyRate : taux d'occupation
 * // metrics.alerts.latePayments : liste des paiements en retard
 */
export function useDashboardMetrics() {
  const propertiesStore = usePropertiesStore()
  const paymentsStore = usePaymentsStore()
  const tenantsStore = useTenantsStore()

  /**
   * Calcule la date de début et de fin du mois courant
   */
  const currentMonthRange = computed(() => {
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    return { startDate, endDate }
  })

  /**
   * Filtre les paiements du mois courant
   */
  const currentMonthPayments = computed(() => {
    const { startDate, endDate } = currentMonthRange.value
    return paymentsStore.payments.filter(payment => {
      if (!payment.dueDate) return false
      const paymentDate = new Date(payment.dueDate)
      return paymentDate >= startDate && paymentDate <= endDate
    })
  })

  /**
   * KPIs Financiers
   */
  const financial: ComputedRef<FinancialMetrics> = computed(() => {
    // Revenu total du mois courant (paiements 'paid')
    const paidPayments = currentMonthPayments.value.filter(
      p => p.status === TRANSACTION_STATUS.PAID
    )
    const totalRevenue = paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0)

    // Revenu en attente (paiements 'pending' + 'late')
    const pendingPayments = currentMonthPayments.value.filter(
      p => p.status === TRANSACTION_STATUS.PENDING || p.status === TRANSACTION_STATUS.LATE
    )
    const pendingRevenue = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0)

    // Total des montants en attente (tous les paiements non payés)
    const allPendingPayments = paymentsStore.payments.filter(
      p => p.status === TRANSACTION_STATUS.PENDING || p.status === TRANSACTION_STATUS.LATE
    )
    const totalPendingAmount = allPendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0)

    return {
      totalRevenue: totalRevenue || 0, // Protection contre NaN
      pendingRevenue: pendingRevenue || 0,
      totalPendingAmount: totalPendingAmount || 0
    }
  })

  /**
   * KPIs Immobiliers
   */
  const property: ComputedRef<PropertyMetrics> = computed(() => {
    const allProperties = propertiesStore.properties || []
    const totalProperties = allProperties.length

    // Liste des biens vacants
    const vacantProperties = allProperties.filter(p => p.status === 'vacant')

    // Calcul du taux d'occupation (évite la division par zéro)
    const occupiedCount = totalProperties - vacantProperties.length
    const occupancyRate =
      totalProperties > 0 ? Math.round((occupiedCount / totalProperties) * 100) : 0

    return {
      occupancyRate: occupancyRate || 0, // Protection contre NaN
      vacantProperties,
      vacantPropertiesCount: vacantProperties.length
    }
  })

  /**
   * Alertes (Actions requises)
   */
  const alerts: ComputedRef<DashboardAlerts> = computed(() => {
    // Paiements en retard
    const latePayments = paymentsStore.latePayments || []

    // Locataires dont le bail expire dans < 30 jours
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const expiringLeases = tenantsStore.tenants.filter(tenant => {
      if (!tenant.exitDate) return false // Pas de date de sortie = bail non terminé
      const exitDate = new Date(tenant.exitDate)
      return exitDate >= now && exitDate <= thirtyDaysFromNow
    })

    const hasAlerts = latePayments.length > 0 || expiringLeases.length > 0

    return {
      latePayments,
      latePaymentsCount: latePayments.length,
      expiringLeases,
      expiringLeasesCount: expiringLeases.length,
      hasAlerts
    }
  })

  /**
   * Métriques complètes du Dashboard
   */
  const metrics: ComputedRef<DashboardMetrics> = computed(() => {
    return {
      financial: financial.value,
      property: property.value,
      alerts: alerts.value
    }
  })

  return {
    metrics,
    financial,
    property,
    alerts,
    currentMonthPayments
  }
}
