import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePaymentsStore } from '@/stores/paymentsStore'
import { TRANSACTION_STATUS } from '@/utils/constants'

/**
 * Tests unitaires pour paymentsStore
 *
 * Ce fichier teste la logique financière critique de l'application :
 * - Chargement et gestion des paiements
 * - Calculs de statistiques (paiements en attente, en retard, payés)
 * - Opérations CRUD (Create, Read, Update, Delete)
 * - Gestion d'erreurs et états de chargement
 *
 * IMPORTANT : Tous les appels à l'API Supabase sont mockés pour garantir
 * l'isolation des tests et éviter les appels réseau.
 */

// Mock de l'API payments
const mockGetPayments = vi.fn()
const mockGetPaymentById = vi.fn()
const mockCreatePayment = vi.fn()
const mockUpdatePayment = vi.fn()
const mockDeletePayment = vi.fn()

vi.mock('@/api', () => ({
  paymentsApi: {
    getPayments: (...args) => mockGetPayments(...args),
    getPaymentById: (...args) => mockGetPaymentById(...args),
    createPayment: (...args) => mockCreatePayment(...args),
    updatePayment: (...args) => mockUpdatePayment(...args),
    deletePayment: (...args) => mockDeletePayment(...args)
  }
}))

// Mock des stores dépendants
const mockAuthStore = {
  user: { id: 'user-123' }
}

const mockPropertiesStore = {
  properties: [
    {
      id: 'prop-1',
      name: 'Appartement Paris',
      tenant: { id: 'tenant-1', name: 'Jean Dupont' }
    },
    {
      id: 'prop-2',
      name: 'Studio Lyon',
      tenant: null
    }
  ]
}

const mockToastStore = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn()
}

vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => mockAuthStore
}))

vi.mock('@/stores/propertiesStore', () => ({
  usePropertiesStore: () => mockPropertiesStore
}))

vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => mockToastStore
}))

// Mock du composable useStoreLoader
vi.mock('@/composables/useStoreLoader', () => ({
  useStoreLoader: () => ({ cleanup: vi.fn() })
}))

// Mock de Supabase (pour initRealtime/stopRealtime)
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn(() => ({ status: 'SUBSCRIBED' }))
      }))
    })),
    removeChannel: vi.fn()
  }
}))

// Mock des utilitaires
vi.mock('@/utils/formatters', () => ({
  formatCurrency: vi.fn(amount => `${amount}€`)
}))

// Mock de l'environnement
vi.mock('import.meta', () => ({
  env: {
    VITE_ENABLE_ANALYTICS: 'false'
  }
}))

describe('PaymentsStore Unit Tests', () => {
  let store

  // Données de test mockées
  const mockPaymentsData = [
    {
      id: 'payment-1',
      property_id: 'prop-1',
      amount: 1000,
      due_date: '2025-02-01',
      status: TRANSACTION_STATUS.PENDING,
      properties: { id: 'prop-1', name: 'Appartement Paris' },
      tenants: { id: 'tenant-1', name: 'Jean Dupont' }
    },
    {
      id: 'payment-2',
      property_id: 'prop-1',
      amount: 1500,
      due_date: '2025-01-15',
      status: TRANSACTION_STATUS.LATE,
      properties: { id: 'prop-1', name: 'Appartement Paris' },
      tenants: { id: 'tenant-1', name: 'Jean Dupont' }
    },
    {
      id: 'payment-3',
      property_id: 'prop-2',
      amount: 800,
      due_date: '2024-12-01',
      status: TRANSACTION_STATUS.PAID,
      properties: { id: 'prop-2', name: 'Studio Lyon' },
      tenants: null
    }
  ]

  beforeEach(() => {
    // Réinitialise Pinia pour chaque test
    setActivePinia(createPinia())
    store = usePaymentsStore()

    // Réinitialise tous les mocks
    vi.clearAllMocks()

    // Reset des stores mockés
    mockAuthStore.user = { id: 'user-123' }
    mockPropertiesStore.properties = [
      {
        id: 'prop-1',
        name: 'Appartement Paris',
        tenant: { id: 'tenant-1', name: 'Jean Dupont' }
      },
      {
        id: 'prop-2',
        name: 'Studio Lyon',
        tenant: null
      }
    ]
  })

  afterEach(() => {
    // Reset du store après chaque test
    if (store) {
      store.reset()
    }
  })

  describe('Initialisation', () => {
    it('should initialize with empty state', () => {
      expect(store.payments).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('should have computed getters initialized', () => {
      expect(store.pendingPayments).toEqual([])
      expect(store.latePayments).toEqual([])
      expect(store.paidPayments).toEqual([])
    })
  })

  describe('fetchPayments', () => {
    it('should fetch payments successfully and transform data', async () => {
      // Arrange
      mockGetPayments.mockResolvedValue({
        success: true,
        data: mockPaymentsData
      })

      // Act
      await store.fetchPayments()

      // Assert
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
      expect(store.payments).toHaveLength(3)
      expect(store.payments[0]).toMatchObject({
        id: 'payment-1',
        propertyId: 'prop-1',
        property: 'Appartement Paris',
        tenant: 'Jean Dupont',
        amount: 1000,
        dueDate: '2025-02-01',
        status: TRANSACTION_STATUS.PENDING
      })
      expect(mockGetPayments).toHaveBeenCalledWith('user-123')
    })

    it('should set error state when API call fails', async () => {
      // Arrange
      const errorMessage = 'Erreur réseau'
      mockGetPayments.mockResolvedValue({
        success: false,
        message: errorMessage
      })

      // Act
      await store.fetchPayments()

      // Assert
      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMessage)
      expect(store.payments).toEqual([])
    })

    it('should handle API errors and exceptions', async () => {
      // Arrange
      const errorMessage = 'Network error'
      mockGetPayments.mockRejectedValue(new Error(errorMessage))

      // Act
      await store.fetchPayments()

      // Assert
      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMessage)
    })

    it('should not fetch if user is not authenticated', async () => {
      // Arrange
      mockAuthStore.user = null

      // Act
      await store.fetchPayments()

      // Assert
      expect(store.loading).toBe(false)
      expect(mockGetPayments).not.toHaveBeenCalled()
      expect(store.payments).toEqual([])
    })

    it('should skip fetch if already loading (unless forced)', async () => {
      // Arrange
      store.loading = true
      mockGetPayments.mockResolvedValue({
        success: true,
        data: mockPaymentsData
      })

      // Act
      await store.fetchPayments()

      // Assert
      expect(mockGetPayments).not.toHaveBeenCalled()
    })

    it('should force fetch even if loading', async () => {
      // Arrange
      store.loading = true
      mockGetPayments.mockResolvedValue({
        success: true,
        data: mockPaymentsData
      })

      // Act
      await store.fetchPayments(true) // force = true

      // Assert
      expect(mockGetPayments).toHaveBeenCalled()
      expect(store.loading).toBe(false)
    })

    it('should use cache if recent fetch exists', async () => {
      // Arrange
      mockGetPayments.mockResolvedValue({
        success: true,
        data: mockPaymentsData
      })

      // First fetch
      await store.fetchPayments()
      const firstCallCount = mockGetPayments.mock.calls.length

      // Second fetch within cache window
      await store.fetchPayments()

      // Assert: should not call API again (cache)
      expect(mockGetPayments.mock.calls.length).toBe(firstCallCount)
    })
  })

  describe('Computed Getters (Statistics)', () => {
    beforeEach(async () => {
      // Setup: load payments
      mockGetPayments.mockResolvedValue({
        success: true,
        data: mockPaymentsData
      })
      await store.fetchPayments()
    })

    it('should compute pendingPayments correctly', () => {
      const pending = store.pendingPayments

      expect(pending).toHaveLength(1)
      expect(pending[0].status).toBe(TRANSACTION_STATUS.PENDING)
      expect(pending[0].amount).toBe(1000)
    })

    it('should compute latePayments correctly', () => {
      const late = store.latePayments

      expect(late).toHaveLength(1)
      expect(late[0].status).toBe(TRANSACTION_STATUS.LATE)
      expect(late[0].amount).toBe(1500)
    })

    it('should compute paidPayments correctly', () => {
      const paid = store.paidPayments

      expect(paid).toHaveLength(1)
      expect(paid[0].status).toBe(TRANSACTION_STATUS.PAID)
      expect(paid[0].amount).toBe(800)
    })

    it('should update computed getters reactively when payments change', async () => {
      // Initial state
      expect(store.pendingPayments).toHaveLength(1)

      // Add a new pending payment
      const newPayment = {
        id: 'payment-new',
        property_id: 'prop-2',
        amount: 900,
        due_date: '2025-03-01',
        status: TRANSACTION_STATUS.PENDING,
        properties: { id: 'prop-2', name: 'Studio Lyon' },
        tenants: null
      }

      mockGetPayments.mockResolvedValue({
        success: true,
        data: [...mockPaymentsData, newPayment]
      })

      // Force fetch to bypass cache
      await store.fetchPayments(true)

      // Assert: computed should update
      expect(store.pendingPayments).toHaveLength(2)
    })
  })

  describe('addPayment', () => {
    const newPaymentData = {
      propertyId: 'prop-1',
      property: 'Appartement Paris',
      tenant: 'Jean Dupont',
      amount: 1200,
      dueDate: '2025-03-01',
      status: TRANSACTION_STATUS.PENDING
    }

    it('should add payment successfully with optimistic update', async () => {
      // Arrange
      const createdPayment = {
        id: 'payment-new',
        property_id: 'prop-1',
        amount: 1200,
        due_date: '2025-03-01',
        status: TRANSACTION_STATUS.PENDING,
        properties: { id: 'prop-1', name: 'Appartement Paris' },
        tenants: { id: 'tenant-1', name: 'Jean Dupont' }
      }

      mockCreatePayment.mockResolvedValue({
        success: true,
        data: createdPayment
      })

      // Act
      const result = await store.addPayment(newPaymentData)

      // Assert
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
      expect(result).toMatchObject({
        id: 'payment-new',
        propertyId: 'prop-1',
        amount: 1200,
        status: TRANSACTION_STATUS.PENDING
      })
      expect(store.payments.length).toBeGreaterThan(0)
      expect(store.payments.find(p => p.id === 'payment-new')).toBeDefined()
      expect(mockCreatePayment).toHaveBeenCalled()
      expect(mockToastStore.success).toHaveBeenCalled()
    })

    it('should revert optimistic update on API error', async () => {
      // Arrange
      const initialPayments = [...store.payments]
      mockCreatePayment.mockResolvedValue({
        success: false,
        message: 'Erreur de création'
      })

      // Act & Assert
      await expect(store.addPayment(newPaymentData)).rejects.toThrow('Erreur de création')
      expect(store.loading).toBe(false)
      expect(store.error).toBe('Erreur de création')
      expect(store.payments).toEqual(initialPayments)
      expect(mockToastStore.success).not.toHaveBeenCalled()
    })

    it('should throw error if user is not authenticated', async () => {
      // Arrange
      mockAuthStore.user = null

      // Act & Assert
      await expect(store.addPayment(newPaymentData)).rejects.toThrow('User not authenticated')
    })

    it('should find tenant_id from property if provided', async () => {
      // Arrange
      const paymentDataWithoutTenant = {
        propertyId: 'prop-1',
        amount: 1200,
        dueDate: '2025-03-01'
      }

      mockCreatePayment.mockResolvedValue({
        success: true,
        data: {
          id: 'payment-new',
          property_id: 'prop-1',
          amount: 1200,
          due_date: '2025-03-01',
          status: 'pending',
          properties: { id: 'prop-1', name: 'Appartement Paris' },
          tenants: { id: 'tenant-1', name: 'Jean Dupont' }
        }
      })

      // Act
      await store.addPayment(paymentDataWithoutTenant)

      // Assert: should pass tenantId to API
      expect(mockCreatePayment).toHaveBeenCalledWith(
        expect.objectContaining({
          tenantId: 'tenant-1'
        }),
        'user-123'
      )
    })
  })

  describe('updatePayment', () => {
    beforeEach(async () => {
      // Setup: load payments
      mockGetPayments.mockResolvedValue({
        success: true,
        data: mockPaymentsData
      })
      await store.fetchPayments()
    })

    it('should update payment successfully with optimistic update', async () => {
      // Arrange
      const paymentId = 'payment-1'
      const updates = {
        status: TRANSACTION_STATUS.PAID,
        amount: 1100
      }

      const updatedPayment = {
        id: 'payment-1',
        property_id: 'prop-1',
        amount: 1100,
        due_date: '2025-02-01',
        status: TRANSACTION_STATUS.PAID,
        properties: { id: 'prop-1', name: 'Appartement Paris' },
        tenants: { id: 'tenant-1', name: 'Jean Dupont' }
      }

      mockUpdatePayment.mockResolvedValue({
        success: true,
        data: updatedPayment
      })

      // Act
      await store.updatePayment(paymentId, updates)

      // Assert
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
      const updated = store.payments.find(p => p.id === paymentId)
      expect(updated.status).toBe(TRANSACTION_STATUS.PAID)
      expect(updated.amount).toBe(1100)
      expect(mockUpdatePayment).toHaveBeenCalledWith(
        paymentId,
        expect.objectContaining({
          status: TRANSACTION_STATUS.PAID,
          amount: 1100
        }),
        'user-123'
      )
      expect(mockToastStore.success).toHaveBeenCalled()
    })

    it('should revert optimistic update on API error', async () => {
      // Arrange
      const paymentId = 'payment-1'
      const originalPayment = { ...store.payments.find(p => p.id === paymentId) }
      const updates = { status: TRANSACTION_STATUS.PAID }

      mockUpdatePayment.mockResolvedValue({
        success: false,
        message: 'Erreur de mise à jour'
      })

      // Act & Assert
      await expect(store.updatePayment(paymentId, updates)).rejects.toThrow('Erreur de mise à jour')
      expect(store.loading).toBe(false)
      expect(store.error).toBe('Erreur de mise à jour')
      const reverted = store.payments.find(p => p.id === paymentId)
      expect(reverted.status).toBe(originalPayment.status)
    })

    it('should throw error if payment not found', async () => {
      // Arrange
      const updates = { status: TRANSACTION_STATUS.PAID }

      // Act & Assert
      await expect(store.updatePayment('non-existent-id', updates)).rejects.toThrow(
        'Payment not found'
      )
    })

    it('should throw error if user is not authenticated', async () => {
      // Arrange
      mockAuthStore.user = null
      const updates = { status: TRANSACTION_STATUS.PAID }

      // Act & Assert
      await expect(store.updatePayment('payment-1', updates)).rejects.toThrow(
        'User not authenticated'
      )
    })
  })

  describe('removePayment', () => {
    beforeEach(async () => {
      // Setup: load payments
      mockGetPayments.mockResolvedValue({
        success: true,
        data: mockPaymentsData
      })
      await store.fetchPayments()
    })

    it('should remove payment successfully with optimistic update', async () => {
      // Arrange
      const paymentId = 'payment-1'
      const initialCount = store.payments.length

      mockDeletePayment.mockResolvedValue({
        success: true
      })

      // Act
      await store.removePayment(paymentId)

      // Assert
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
      expect(store.payments).toHaveLength(initialCount - 1)
      expect(store.payments.find(p => p.id === paymentId)).toBeUndefined()
      expect(mockDeletePayment).toHaveBeenCalledWith(paymentId, 'user-123')
      expect(mockToastStore.success).toHaveBeenCalledWith('Paiement supprimé avec succès')
    })

    it('should revert optimistic update on API error', async () => {
      // Arrange
      const paymentId = 'payment-1'
      const initialPayments = [...store.payments]
      const initialCount = initialPayments.length

      mockDeletePayment.mockResolvedValue({
        success: false,
        message: 'Erreur de suppression'
      })

      // Act & Assert
      await expect(store.removePayment(paymentId)).rejects.toThrow('Erreur de suppression')
      expect(store.loading).toBe(false)
      expect(store.error).toBe('Erreur de suppression')
      expect(store.payments).toHaveLength(initialCount)
      expect(store.payments.find(p => p.id === paymentId)).toBeDefined()
    })

    it('should throw error if payment not found', async () => {
      // Act & Assert
      await expect(store.removePayment('non-existent-id')).rejects.toThrow('Payment not found')
    })

    it('should throw error if user is not authenticated', async () => {
      // Arrange
      mockAuthStore.user = null

      // Act & Assert
      await expect(store.removePayment('payment-1')).rejects.toThrow('User not authenticated')
    })
  })

  describe('reset', () => {
    beforeEach(async () => {
      // Setup: load payments
      mockGetPayments.mockResolvedValue({
        success: true,
        data: mockPaymentsData
      })
      await store.fetchPayments()
    })

    it('should reset store to initial state', () => {
      // Act
      store.reset()

      // Assert
      expect(store.payments).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })
  })

  describe('Edge Cases & Data Transformation', () => {
    it('should handle payment with missing tenant data', async () => {
      // Arrange
      const paymentWithoutTenant = {
        id: 'payment-no-tenant',
        property_id: 'prop-2',
        amount: 800,
        due_date: '2025-03-01',
        status: TRANSACTION_STATUS.PENDING,
        properties: { id: 'prop-2', name: 'Studio Lyon' },
        tenants: null
      }

      mockGetPayments.mockResolvedValue({
        success: true,
        data: [paymentWithoutTenant]
      })

      // Act
      await store.fetchPayments()

      // Assert
      // When tenants is null, store uses properties.name as fallback (see store line 91)
      expect(store.payments[0].tenant).toBe('Studio Lyon')
      expect(store.payments[0].property).toBe('Studio Lyon')
    })

    it('should convert amount to number', async () => {
      // Arrange
      const paymentWithStringAmount = {
        id: 'payment-string',
        property_id: 'prop-1',
        amount: '1200', // String instead of number
        due_date: '2025-03-01',
        status: TRANSACTION_STATUS.PENDING,
        properties: { id: 'prop-1', name: 'Appartement Paris' },
        tenants: { id: 'tenant-1', name: 'Jean Dupont' }
      }

      mockGetPayments.mockResolvedValue({
        success: true,
        data: [paymentWithStringAmount]
      })

      // Act
      await store.fetchPayments()

      // Assert
      expect(typeof store.payments[0].amount).toBe('number')
      expect(store.payments[0].amount).toBe(1200)
    })

    it('should handle empty payments array', async () => {
      // Arrange
      mockGetPayments.mockResolvedValue({
        success: true,
        data: []
      })

      // Act
      await store.fetchPayments()

      // Assert
      expect(store.payments).toEqual([])
      expect(store.pendingPayments).toEqual([])
      expect(store.latePayments).toEqual([])
      expect(store.paidPayments).toEqual([])
    })
  })
})
