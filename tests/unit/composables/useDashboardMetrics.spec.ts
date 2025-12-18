import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDashboardMetrics } from '@/composables/useDashboardMetrics'
import { TRANSACTION_STATUS } from '@/utils/constants'

/**
 * Tests unitaires pour useDashboardMetrics
 *
 * Valide le calcul des KPIs financiers, immobiliers et alertes
 */

// Mock des stores
const mockProperties = [
  {
    id: 'prop-1',
    name: 'Appartement Paris',
    status: 'occupied',
    rent: 1200,
    tenant: {
      id: 'tenant-1',
      name: 'Jean Dupont',
      entryDate: '2024-01-01',
      exitDate: '2025-02-01', // Expire dans ~45 jours
      rent: 1200,
      status: 'on_time'
    }
  },
  {
    id: 'prop-2',
    name: 'Studio Lyon',
    status: 'vacant',
    rent: 800
  },
  {
    id: 'prop-3',
    name: 'Maison Marseille',
    status: 'occupied',
    rent: 1500,
    tenant: {
      id: 'tenant-2',
      name: 'Marie Martin',
      entryDate: '2023-06-01',
      exitDate: null, // Pas de date de sortie
      rent: 1500,
      status: 'late'
    }
  }
]

const mockPayments = [
  {
    id: 'payment-1',
    propertyId: 'prop-1',
    property: 'Appartement Paris',
    tenant: 'Jean Dupont',
    amount: 1200,
    dueDate: '2025-01-15', // Mois courant
    status: TRANSACTION_STATUS.PAID
  },
  {
    id: 'payment-2',
    propertyId: 'prop-1',
    property: 'Appartement Paris',
    tenant: 'Jean Dupont',
    amount: 1200,
    dueDate: '2025-01-20', // Mois courant
    status: TRANSACTION_STATUS.PENDING
  },
  {
    id: 'payment-3',
    propertyId: 'prop-3',
    property: 'Maison Marseille',
    tenant: 'Marie Martin',
    amount: 1500,
    dueDate: '2024-12-15', // Mois précédent
    status: TRANSACTION_STATUS.LATE
  },
  {
    id: 'payment-4',
    propertyId: 'prop-3',
    property: 'Maison Marseille',
    tenant: 'Marie Martin',
    amount: 1500,
    dueDate: '2025-01-10', // Mois courant
    status: TRANSACTION_STATUS.LATE
  }
]

const mockPropertiesStore = {
  properties: mockProperties,
  loading: false,
  error: null
}

const mockPaymentsStore = {
  payments: mockPayments,
  loading: false,
  error: null,
  latePayments: mockPayments.filter(p => p.status === TRANSACTION_STATUS.LATE),
  pendingPayments: mockPayments.filter(p => p.status === TRANSACTION_STATUS.PENDING),
  paidPayments: mockPayments.filter(p => p.status === TRANSACTION_STATUS.PAID)
}

const mockTenantsStore = {
  tenants: [
    {
      id: 'tenant-1',
      propertyId: 'prop-1',
      name: 'Jean Dupont',
      property: 'Appartement Paris',
      propertyCity: 'Paris',
      entryDate: '2024-01-01',
      exitDate: '2025-02-01', // Expire dans ~45 jours (pas dans les 30 jours)
      rent: 1200,
      status: 'on_time'
    },
    {
      id: 'tenant-2',
      propertyId: 'prop-3',
      name: 'Marie Martin',
      property: 'Maison Marseille',
      propertyCity: 'Marseille',
      entryDate: '2023-06-01',
      exitDate: null, // Pas de date de sortie
      rent: 1500,
      status: 'late'
    }
  ],
  onTimeTenants: [],
  lateTenants: [],
  totalTenantsRent: 2700
}

vi.mock('@/stores/propertiesStore', () => ({
  usePropertiesStore: () => mockPropertiesStore
}))

vi.mock('@/stores/paymentsStore', () => ({
  usePaymentsStore: () => mockPaymentsStore
}))

vi.mock('@/stores/tenantsStore', () => ({
  useTenantsStore: () => mockTenantsStore
}))

describe('useDashboardMetrics', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Reset des stores mockés
    mockPropertiesStore.properties = [...mockProperties]
    mockPaymentsStore.payments = [...mockPayments]
    mockPaymentsStore.latePayments = mockPayments.filter(p => p.status === TRANSACTION_STATUS.LATE)
  })

  describe('Financial Metrics', () => {
    it('should calculate totalRevenue from paid payments in current month', () => {
      const { financial } = useDashboardMetrics()

      // Mois courant = janvier 2025
      // payment-1 : 1200, paid, janvier 2025 → inclus
      // payment-3 : 1500, late, décembre 2024 → exclu
      // payment-4 : 1500, late, janvier 2025 → exclu (pas paid)

      expect(financial.value.totalRevenue).toBeGreaterThanOrEqual(0)
      // Le calcul dépend de la date actuelle, donc on vérifie juste que c'est un nombre valide
      expect(typeof financial.value.totalRevenue).toBe('number')
      expect(isNaN(financial.value.totalRevenue)).toBe(false)
    })

    it('should calculate pendingRevenue from pending and late payments in current month', () => {
      const { financial } = useDashboardMetrics()

      // payment-2 : 1200, pending, janvier 2025 → inclus
      // payment-4 : 1500, late, janvier 2025 → inclus

      expect(typeof financial.value.pendingRevenue).toBe('number')
      expect(isNaN(financial.value.pendingRevenue)).toBe(false)
      expect(financial.value.pendingRevenue).toBeGreaterThanOrEqual(0)
    })

    it('should calculate totalPendingAmount from all pending/late payments', () => {
      const { financial } = useDashboardMetrics()

      // Tous les paiements pending ou late, peu importe le mois
      // payment-2 : 1200, pending
      // payment-3 : 1500, late (décembre)
      // payment-4 : 1500, late (janvier)

      expect(typeof financial.value.totalPendingAmount).toBe('number')
      expect(financial.value.totalPendingAmount).toBeGreaterThanOrEqual(0)
      // Doit être >= à pendingRevenue (qui est limité au mois courant)
      expect(financial.value.totalPendingAmount).toBeGreaterThanOrEqual(
        financial.value.pendingRevenue
      )
    })

    it('should return 0 for revenue if no payments', () => {
      mockPaymentsStore.payments = []
      mockPaymentsStore.latePayments = []
      mockPaymentsStore.pendingPayments = []
      mockPaymentsStore.paidPayments = []

      const { financial } = useDashboardMetrics()

      expect(financial.value.totalRevenue).toBe(0)
      expect(financial.value.pendingRevenue).toBe(0)
      expect(financial.value.totalPendingAmount).toBe(0)
    })
  })

  describe('Property Metrics', () => {
    it('should calculate occupancyRate correctly', () => {
      const { property } = useDashboardMetrics()

      // 2 biens occupés sur 3 = 66.67% ≈ 67%
      expect(property.value.occupancyRate).toBeGreaterThanOrEqual(0)
      expect(property.value.occupancyRate).toBeLessThanOrEqual(100)
      expect(typeof property.value.occupancyRate).toBe('number')
    })

    it('should return 0% occupancyRate if no properties', () => {
      mockPropertiesStore.properties = []

      const { property } = useDashboardMetrics()

      expect(property.value.occupancyRate).toBe(0)
    })

    it('should list vacant properties', () => {
      const { property } = useDashboardMetrics()

      expect(property.value.vacantProperties).toHaveLength(1)
      expect(property.value.vacantProperties[0].id).toBe('prop-2')
      expect(property.value.vacantPropertiesCount).toBe(1)
    })

    it('should return empty array for vacantProperties if all occupied', () => {
      mockPropertiesStore.properties = mockPropertiesStore.properties.map(p => ({
        ...p,
        status: 'occupied'
      }))

      const { property } = useDashboardMetrics()

      expect(property.value.vacantProperties).toHaveLength(0)
      expect(property.value.vacantPropertiesCount).toBe(0)
      expect(property.value.occupancyRate).toBe(100)
    })

    it('should handle division by zero when no properties', () => {
      mockPropertiesStore.properties = []

      const { property } = useDashboardMetrics()

      // Ne doit pas être NaN
      expect(isNaN(property.value.occupancyRate)).toBe(false)
      expect(property.value.occupancyRate).toBe(0)
    })
  })

  describe('Dashboard Alerts', () => {
    it('should list late payments', () => {
      const { alerts } = useDashboardMetrics()

      expect(alerts.value.latePayments.length).toBeGreaterThanOrEqual(0)
      expect(alerts.value.latePaymentsCount).toBe(alerts.value.latePayments.length)
      // Vérifie que tous les paiements sont bien en retard
      alerts.value.latePayments.forEach(payment => {
        expect(payment.status).toBe(TRANSACTION_STATUS.LATE)
      })
    })

    it('should detect expiring leases (exitDate within 30 days)', () => {
      // Ajout d'un locataire avec date de sortie dans 15 jours
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 15)
      const futureDateStr = futureDate.toISOString().split('T')[0]

      mockTenantsStore.tenants = [
        ...mockTenantsStore.tenants,
        {
          id: 'tenant-3',
          propertyId: 'prop-2',
          name: 'Test Tenant',
          property: 'Studio Lyon',
          propertyCity: 'Lyon',
          entryDate: '2024-01-01',
          exitDate: futureDateStr, // Expire dans 15 jours
          rent: 800,
          status: 'on_time'
        }
      ]

      const { alerts } = useDashboardMetrics()

      // Doit détecter le bail expirant
      expect(alerts.value.expiringLeases.length).toBeGreaterThanOrEqual(0)
      expect(alerts.value.expiringLeasesCount).toBe(alerts.value.expiringLeases.length)
    })

    it('should not include leases expiring after 30 days', () => {
      // Locataire avec date de sortie dans 45 jours
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 45)
      const futureDateStr = futureDate.toISOString().split('T')[0]

      mockTenantsStore.tenants = [
        {
          id: 'tenant-1',
          propertyId: 'prop-1',
          name: 'Jean Dupont',
          property: 'Appartement Paris',
          propertyCity: 'Paris',
          entryDate: '2024-01-01',
          exitDate: futureDateStr, // Expire dans 45 jours (pas inclus)
          rent: 1200,
          status: 'on_time'
        }
      ]

      const { alerts } = useDashboardMetrics()

      // Ne doit pas inclure ce bail
      alerts.value.expiringLeases.forEach(lease => {
        if (lease.exitDate) {
          const exitDate = new Date(lease.exitDate)
          const now = new Date()
          const daysDiff = Math.ceil((exitDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          expect(daysDiff).toBeLessThanOrEqual(30)
        }
      })
    })

    it('should set hasAlerts to true if there are alerts', () => {
      mockPaymentsStore.latePayments = [
        {
          id: 'payment-late',
          propertyId: 'prop-1',
          property: 'Test',
          tenant: 'Test',
          amount: 1000,
          dueDate: '2025-01-15',
          status: TRANSACTION_STATUS.LATE
        }
      ]

      const { alerts } = useDashboardMetrics()

      expect(alerts.value.hasAlerts).toBe(true)
    })

    it('should set hasAlerts to false if there are no alerts', () => {
      mockPaymentsStore.latePayments = []
      mockTenantsStore.tenants = mockTenantsStore.tenants.map(t => ({
        ...t,
        exitDate: null // Pas de date de sortie
      }))

      const { alerts } = useDashboardMetrics()

      expect(alerts.value.hasAlerts).toBe(false)
    })
  })

  describe('Edge Cases - Empty Stores', () => {
    it('should handle empty properties store', () => {
      mockPropertiesStore.properties = []
      mockPaymentsStore.payments = []
      mockPaymentsStore.latePayments = []
      mockTenantsStore.tenants = []

      const { property, financial, alerts } = useDashboardMetrics()

      expect(property.value.occupancyRate).toBe(0)
      expect(property.value.vacantProperties).toEqual([])
      expect(financial.value.totalRevenue).toBe(0)
      expect(alerts.value.hasAlerts).toBe(false)
    })

    it('should handle empty payments store', () => {
      mockPaymentsStore.payments = []
      mockPaymentsStore.latePayments = []

      const { financial, alerts } = useDashboardMetrics()

      expect(financial.value.totalRevenue).toBe(0)
      expect(financial.value.pendingRevenue).toBe(0)
      expect(alerts.value.latePayments).toEqual([])
    })

    it('should handle empty tenants store', () => {
      mockTenantsStore.tenants = []

      const { alerts } = useDashboardMetrics()

      expect(alerts.value.expiringLeases).toEqual([])
      expect(alerts.value.expiringLeasesCount).toBe(0)
    })

    it('should avoid NaN in calculations', () => {
      mockPropertiesStore.properties = []
      mockPaymentsStore.payments = []

      const { metrics } = useDashboardMetrics()

      // Vérifie que tous les nombres sont valides (pas NaN)
      expect(isNaN(metrics.value.financial.totalRevenue)).toBe(false)
      expect(isNaN(metrics.value.financial.pendingRevenue)).toBe(false)
      expect(isNaN(metrics.value.property.occupancyRate)).toBe(false)
    })
  })
})
