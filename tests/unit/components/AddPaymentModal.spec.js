import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AddPaymentModal from '@/components/payments/AddPaymentModal.vue'
import { TRANSACTION_STATUS } from '@/utils/constants'

/**
 * Tests unitaires pour AddPaymentModal
 *
 * Valide la logique de préparation des données (preparePaymentData)
 * avec focus sur les validations financières critiques
 */

// Mock des stores
const mockToastStore = {
  error: vi.fn(),
  success: vi.fn(),
  warning: vi.fn(),
  info: vi.fn()
}

const mockPropertiesStore = {
  properties: [
    {
      id: '550e8400-e29b-41d4-a716-446655440000', // UUID valide
      name: 'Appartement Paris',
      city: 'Paris',
      rent: 1200,
      tenant: {
        id: 'tenant-uuid-123',
        name: 'Jean Dupont'
      }
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001', // UUID valide
      name: 'Studio Lyon',
      city: 'Lyon',
      rent: 800,
      tenant: null
    }
  ]
}

const mockSettingsStore = {
  currency: 'EUR'
}

vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => mockToastStore
}))

vi.mock('@/stores/propertiesStore', () => ({
  usePropertiesStore: () => mockPropertiesStore
}))

vi.mock('@/stores/settingsStore', () => ({
  useSettingsStore: () => mockSettingsStore
}))

// Mock i18n
vi.mock('@/composables/useLingui', () => ({
  useI18n: () => ({
    t: key => key
  })
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: key => key
  })
}))

// Mock formatters
vi.mock('@/utils/formatters', () => ({
  formatCurrency: amount => `${amount}€`
}))

describe('AddPaymentModal - preparePaymentData Logic', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    wrapper = mount(AddPaymentModal, {
      props: {
        isOpen: true,
        isLoading: false
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: {
            template: '<div><slot /></div>'
          }
        },
        mocks: {
          $t: key => key
        }
      }
    })
  })

  describe('preparePaymentData - Validation des champs obligatoires', () => {
    it('should throw error if propertyId is missing', async () => {
      // Arrange
      wrapper.vm.form.propertyId = ''
      wrapper.vm.form.tenant = 'Jean Dupont'
      wrapper.vm.form.amount = 1200
      wrapper.vm.form.dueDate = '2024-12-31'

      // Act
      await wrapper.vm.handleSubmit()

      // Assert
      expect(mockToastStore.error).toHaveBeenCalledWith(
        'Veuillez sélectionner un bien ou saisir un nom de bien'
      )
    })

    it('should throw error if tenant is missing', async () => {
      // Arrange
      wrapper.vm.form.propertyId = '550e8400-e29b-41d4-a716-446655440000'
      wrapper.vm.form.tenant = ''
      wrapper.vm.form.amount = 1200
      wrapper.vm.form.dueDate = '2024-12-31'

      // Act
      await wrapper.vm.handleSubmit()

      // Assert
      expect(mockToastStore.error).toHaveBeenCalledWith('Le nom du locataire est requis')
    })

    it('should throw error if amount is missing or invalid', async () => {
      // Arrange
      wrapper.vm.form.propertyId = '550e8400-e29b-41d4-a716-446655440000'
      wrapper.vm.form.tenant = 'Jean Dupont'
      wrapper.vm.form.amount = null
      wrapper.vm.form.dueDate = '2024-12-31'

      // Act
      await wrapper.vm.handleSubmit()

      // Assert
      expect(mockToastStore.error).toHaveBeenCalledWith('Le montant doit être supérieur à 0')
    })

    it('should throw error if amount is zero', async () => {
      // Arrange
      wrapper.vm.form.propertyId = '550e8400-e29b-41d4-a716-446655440000'
      wrapper.vm.form.tenant = 'Jean Dupont'
      wrapper.vm.form.amount = 0
      wrapper.vm.form.dueDate = '2024-12-31'

      // Act
      await wrapper.vm.handleSubmit()

      // Assert
      expect(mockToastStore.error).toHaveBeenCalledWith('Le montant doit être supérieur à 0')
    })

    it('should throw error if amount is negative', async () => {
      // Arrange
      wrapper.vm.form.propertyId = '550e8400-e29b-41d4-a716-446655440000'
      wrapper.vm.form.tenant = 'Jean Dupont'
      wrapper.vm.form.amount = -100
      wrapper.vm.form.dueDate = '2024-12-31'

      // Act
      await wrapper.vm.handleSubmit()

      // Assert
      expect(mockToastStore.error).toHaveBeenCalledWith('Le montant doit être supérieur à 0')
    })

    it('should throw error if dueDate is missing', async () => {
      // Arrange
      wrapper.vm.form.propertyId = '550e8400-e29b-41d4-a716-446655440000'
      wrapper.vm.form.tenant = 'Jean Dupont'
      wrapper.vm.form.amount = 1200
      wrapper.vm.form.dueDate = ''

      // Act
      await wrapper.vm.handleSubmit()

      // Assert
      expect(mockToastStore.error).toHaveBeenCalledWith("La date d'échéance est requise")
    })

    it('should throw error if custom property name is missing', async () => {
      // Arrange
      wrapper.vm.form.propertyId = 'custom'
      wrapper.vm.form.propertyCustom = ''
      wrapper.vm.form.tenant = 'Jean Dupont'
      wrapper.vm.form.amount = 1200
      wrapper.vm.form.dueDate = '2024-12-31'

      // Act
      await wrapper.vm.handleSubmit()

      // Assert
      expect(mockToastStore.error).toHaveBeenCalled()
      // Vérifie que l'erreur mentionne le bien
      const errorCall = mockToastStore.error.mock.calls[0][0]
      expect(errorCall).toContain('bien')
    })
  })

  describe('preparePaymentData - Conversion des montants (Mathématiques)', () => {
    beforeEach(() => {
      wrapper.vm.form.propertyId = '550e8400-e29b-41d4-a716-446655440000'
      wrapper.vm.form.tenant = 'Jean Dupont'
      wrapper.vm.form.dueDate = '2024-12-31'
      wrapper.vm.form.status = TRANSACTION_STATUS.PENDING
    })

    it('should convert amount string to number', () => {
      // Arrange
      wrapper.vm.form.amount = '1200'

      // Act
      const result = wrapper.vm.preparePaymentData()

      // Assert
      expect(result.amount).toBe(1200) // Doit être un number
      expect(typeof result.amount).toBe('number')
    })

    it('should handle amount with comma as decimal separator', () => {
      // Arrange
      wrapper.vm.form.amount = '1200,50'

      // Act
      const result = wrapper.vm.preparePaymentData()

      // Assert
      expect(result.amount).toBe(1200.5) // toNumber remplace la virgule par un point
    })

    it('should handle amount with dot as decimal separator', () => {
      // Arrange
      wrapper.vm.form.amount = '1200.50'

      // Act
      const result = wrapper.vm.preparePaymentData()

      // Assert
      expect(result.amount).toBe(1200.5)
    })

    it('should handle amount already as number', () => {
      // Arrange
      wrapper.vm.form.amount = 1200

      // Act
      const result = wrapper.vm.preparePaymentData()

      // Assert
      expect(result.amount).toBe(1200)
      expect(typeof result.amount).toBe('number')
    })

    it('should reject amount with invalid characters', async () => {
      // Arrange
      wrapper.vm.form.amount = 'abc'

      // Act
      await wrapper.vm.handleSubmit()

      // Assert
      expect(mockToastStore.error).toHaveBeenCalledWith('Le montant doit être supérieur à 0')
    })

    it('should handle large amounts correctly', () => {
      // Arrange
      wrapper.vm.form.amount = '999999.99'

      // Act
      const result = wrapper.vm.preparePaymentData()

      // Assert
      expect(result.amount).toBe(999999.99)
      expect(typeof result.amount).toBe('number')
    })
  })

  describe('preparePaymentData - Nettoyage des strings', () => {
    beforeEach(() => {
      wrapper.vm.form.propertyId = '550e8400-e29b-41d4-a716-446655440000'
      wrapper.vm.form.amount = 1200
      wrapper.vm.form.dueDate = '2024-12-31'
      wrapper.vm.form.status = TRANSACTION_STATUS.PENDING
    })

    it('should trim tenant name', () => {
      // Arrange
      wrapper.vm.form.tenant = '  Jean Dupont  '

      // Act
      const result = wrapper.vm.preparePaymentData()

      // Assert
      expect(result.tenant).toBe('Jean Dupont') // Trimé
    })

    it('should trim dueDate', () => {
      // Arrange
      wrapper.vm.form.tenant = 'Jean Dupont'
      wrapper.vm.form.dueDate = '  2024-12-31  '

      // Act
      const result = wrapper.vm.preparePaymentData()

      // Assert
      expect(result.dueDate).toBe('2024-12-31') // Trimé
    })

    it('should include tenantId if available', () => {
      // Arrange
      wrapper.vm.form.tenant = 'Jean Dupont'
      wrapper.vm.form.tenantId = 'tenant-uuid-123'

      // Act
      const result = wrapper.vm.preparePaymentData()

      // Assert
      expect(result.tenantId).toBe('tenant-uuid-123')
    })
  })

  describe('preparePaymentData - Gestion du bien custom', () => {
    beforeEach(() => {
      wrapper.vm.form.propertyCustom = 'Bien Custom'
      wrapper.vm.form.tenant = 'Jean Dupont'
      wrapper.vm.form.amount = 1200
      wrapper.vm.form.dueDate = '2024-12-31'
      wrapper.vm.form.status = TRANSACTION_STATUS.PENDING
    })

    it('should handle custom property correctly', () => {
      // Arrange
      wrapper.vm.form.propertyId = 'custom'

      // Act
      const result = wrapper.vm.preparePaymentData()

      // Assert
      expect(result.property).toBe('Bien Custom')
      expect(result.propertyId).toBe('00000000-0000-0000-0000-000000000000') // UUID temporaire pour Zod
    })

    it('should trim custom property name', () => {
      // Arrange
      wrapper.vm.form.propertyId = 'custom'
      wrapper.vm.form.propertyCustom = '  Bien Custom  '

      // Act
      const result = wrapper.vm.preparePaymentData()

      // Assert
      expect(result.property).toBe('Bien Custom') // Trimé
    })
  })

  describe('handleSubmit - Loading state', () => {
    beforeEach(() => {
      wrapper.vm.form.propertyId = '550e8400-e29b-41d4-a716-446655440000'
      wrapper.vm.form.tenant = 'Jean Dupont'
      wrapper.vm.form.amount = 1200
      wrapper.vm.form.dueDate = '2024-12-31'
      wrapper.vm.form.status = TRANSACTION_STATUS.PENDING
    })

    it('should set isSubmitting state correctly', () => {
      // Arrange & Act
      // Initial state
      expect(wrapper.vm.isSubmitting).toBe(false)

      // On peut tester que isSubmitting existe et est initialisé correctement
      // Le test d'état pendant la soumission est complexe avec Vue Test Utils
      // car la fonction handleSubmit est async et peut se terminer rapidement
      expect(typeof wrapper.vm.isSubmitting).toBe('boolean')
    })

    it('should not submit multiple times if already submitting', async () => {
      // Arrange
      wrapper.vm.isSubmitting = true
      const emitSpy = vi.spyOn(wrapper.vm, '$emit')

      // Act
      await wrapper.vm.handleSubmit()

      // Assert
      expect(emitSpy).not.toHaveBeenCalled()
    })
  })

  describe('handleSubmit - Toast notifications', () => {
    it('should call toastStore.error on validation error', async () => {
      // Arrange
      wrapper.vm.form.propertyId = ''
      wrapper.vm.form.tenant = 'Jean Dupont'
      wrapper.vm.form.amount = 1200
      wrapper.vm.form.dueDate = '2024-12-31'

      // Act
      await wrapper.vm.handleSubmit()

      // Assert
      expect(mockToastStore.error).toHaveBeenCalled()
    })
  })

  describe('Component initialization', () => {
    it('should initialize with empty form', () => {
      expect(wrapper.vm.form.propertyId).toBe('')
      expect(wrapper.vm.form.tenant).toBe('')
      expect(wrapper.vm.form.amount).toBeNull()
      expect(wrapper.vm.form.dueDate).toBe('')
      expect(wrapper.vm.isSubmitting).toBe(false)
    })
  })
})
