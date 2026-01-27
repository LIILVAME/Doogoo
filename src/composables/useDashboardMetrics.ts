import { computed } from 'vue'
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
   * Calcule les périodes pour les comparaisons (mois courant vs mois précédent)
   */
  const dateRanges = computed(() => {
    const now = new Date()

    // Mois courant
    const startCurrent = new Date(now.getFullYear(), now.getMonth(), 1)
    const endCurrent = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    // Mois précédent
    const startPrevious = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endPrevious = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

    return { startCurrent, endCurrent, startPrevious, endPrevious }
  })

  /**
   * Paiements groupés par période
   */
  const paymentsByPeriod = computed(() => {
    const { startCurrent, endCurrent, startPrevious, endPrevious } = dateRanges.value

    const current = (paymentsStore.payments || []).filter(p => {
      if (!p.dueDate) return false
      const d = new Date(p.dueDate)
      return d >= startCurrent && d <= endCurrent
    })

    const previous = (paymentsStore.payments || []).filter(p => {
      if (!p.dueDate) return false
      const d = new Date(p.dueDate)
      return d >= startPrevious && d <= endPrevious
    })

    return { current, previous }
  })

  /**
   * Calcule le pourcentage de croissance
   */
  const calculateGrowth = (current: number, previous: number): string | null => {
    if (previous === 0) return current > 0 ? '+100%' : null
    const growth = ((current - previous) / previous) * 100
    if (growth === 0) return null
    return `${growth > 0 ? '+' : ''}${Math.round(growth)}%`
  }

  /**
   * KPIs Financiers avec tendances
   */
  const financial = computed<FinancialMetrics & { revenueTrend: string | null }>(() => {
    const { current, previous } = paymentsByPeriod.value

    // Revenu mois courant
    const currentPaid = current.filter(p => p.status === TRANSACTION_STATUS.PAID)
    const currentRevenue = currentPaid.reduce((sum, p) => sum + (p.amount || 0), 0)

    // Revenu mois précédent (pour tendance)
    const previousPaid = previous.filter(p => p.status === TRANSACTION_STATUS.PAID)
    const previousRevenue = previousPaid.reduce((sum, p) => sum + (p.amount || 0), 0)

    // Revenu en attente (tout ce qui n'est pas payé)
    const allPending = (paymentsStore.payments || []).filter(
      p => p.status === TRANSACTION_STATUS.PENDING || p.status === TRANSACTION_STATUS.LATE
    )
    const totalPendingAmount = allPending.reduce((sum, p) => sum + (p.amount || 0), 0)

    // Calcul du revenu en attente du mois courant (pendingRevenue) pour compatibilité
    const currentPending = current.filter(
      p => p.status === TRANSACTION_STATUS.PENDING || p.status === TRANSACTION_STATUS.LATE
    )
    const pendingRevenue = currentPending.reduce((sum, p) => sum + (p.amount || 0), 0)

    return {
      totalRevenue: currentRevenue || 0,
      pendingRevenue: pendingRevenue || 0,
      totalPendingAmount: totalPendingAmount || 0,
      revenueTrend: calculateGrowth(currentRevenue, previousRevenue)
    }
  })

  /**
   * KPIs Immobiliers avec tendances
   */
  const property = computed<
    PropertyMetrics & { newPropertiesCount: number; propertyTrend: string | null }
  >(() => {
    const allProperties = propertiesStore.properties || []
    const totalCount = allProperties.length

    const vacantProperties = allProperties.filter(p => p.status === 'vacant')
    const occupiedCount = totalCount - vacantProperties.length
    const occupancyRate = totalCount > 0 ? Math.round((occupiedCount / totalCount) * 100) : 0

    // Tendance (nouveau biens ce mois-ci)
    const { startCurrent } = dateRanges.value
    const newThisMonth = allProperties.filter(p => {
      if (!p.createdAt) return false
      return new Date(p.createdAt) >= startCurrent
    }).length

    // Trend for occupied properties (proxy using new tenants this month)
    const newTenantsCount = (tenantsStore.tenants || []).filter(t => {
      if (!t.entryDate) return false
      return new Date(t.entryDate) >= startCurrent
    }).length

    return {
      occupancyRate,
      occupiedCount,
      occupiedTrend: newTenantsCount > 0 ? `+${newTenantsCount}` : null,
      vacantProperties,
      vacantPropertiesCount: vacantProperties.length,
      newPropertiesCount: newThisMonth,
      propertyTrend: newThisMonth > 0 ? `+${newThisMonth}` : null
    }
  })

  /**
   * Alertes
   */
  const alerts = computed<DashboardAlerts>(() => {
    const latePayments = paymentsStore.latePayments || []
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const expiringLeases = (tenantsStore.tenants || []).filter(tenant => {
      if (!tenant.exitDate) return false
      const exitDate = new Date(tenant.exitDate)
      return exitDate >= now && exitDate <= thirtyDaysFromNow
    })

    return {
      latePayments,
      latePaymentsCount: latePayments.length,
      expiringLeases,
      expiringLeasesCount: expiringLeases.length,
      hasAlerts: latePayments.length > 0 || expiringLeases.length > 0
    }
  })
  /**
   * KPIs Locataires avec tendances
   */
  const tenant = computed(() => {
    const allTenants = tenantsStore.tenants || []
    const totalCount = allTenants.length

    // Tendance (nouveaux locataires ce mois-ci basés sur entryDate)
    const { startCurrent } = dateRanges.value
    const newThisMonth = allTenants.filter(t => {
      if (!t.entryDate) return false
      return new Date(t.entryDate) >= startCurrent
    }).length

    return {
      totalCount,
      newTenantsCount: newThisMonth,
      tenantTrend: newThisMonth > 0 ? `+${newThisMonth}` : null
    }
  })

  /**
   * Activité des paiements (pour PaymentsPage)
   */
  const paymentActivity = computed(() => {
    const { current, previous } = paymentsByPeriod.value

    const countStatus = (list: PaymentData[], status: string) =>
      list.filter(p => p.status === status).length

    const currentPending = countStatus(current, TRANSACTION_STATUS.PENDING)
    const previousPending = countStatus(previous, TRANSACTION_STATUS.PENDING)

    const currentLate = countStatus(current, TRANSACTION_STATUS.LATE)
    const previousLate = countStatus(previous, TRANSACTION_STATUS.LATE)

    const currentPaid = countStatus(current, TRANSACTION_STATUS.PAID)
    const previousPaid = countStatus(previous, TRANSACTION_STATUS.PAID)

    return {
      pending: {
        count: currentPending,
        trend: calculateGrowth(currentPending, previousPending)
      },
      late: {
        count: currentLate,
        trend: calculateGrowth(currentLate, previousLate)
      },
      paid: {
        count: currentPaid,
        trend: calculateGrowth(currentPaid, previousPaid)
      }
    }
  })

  const metrics = computed<DashboardMetrics & { tenant: any; paymentActivity: any }>(() => ({
    financial: financial.value,
    property: property.value,
    alerts: alerts.value,
    tenant: tenant.value,
    paymentActivity: paymentActivity.value
  }))

  return {
    metrics,
    financial,
    property,
    alerts,
    tenant,
    paymentActivity
  }
}
